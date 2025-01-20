import {Dispatch, SetStateAction, useState} from "react";
import { TodoType } from "../../types";
import {
    DndContext,
    DragEndEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    closestCenter,
} from '@dnd-kit/core';

import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import SortableTodo from '../SortableTodo';

interface DashboardProps {
    handleOpen: (type: "edit") => void;
    todos: TodoType[];
    setTodos: Dispatch<SetStateAction<TodoType[]>>;
}

export default function Dashboard({handleOpen, todos, setTodos} : DashboardProps) {
    const [statuses] = useState<string[]>(["TO DO", "IN PROGRESS", "TESTING", "DONE"]);
    const groupedTodos: Record<string, TodoType[]> = {};

    statuses.forEach((status) => {
        groupedTodos[status] = [];
    });

    todos.forEach((todo) => {
        const status = todo.status.toUpperCase();
        if (groupedTodos[status]) {
            groupedTodos[status].push(todo);
        }
    });

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        },
    });
    const touchSensor = useSensor(TouchSensor);
    const sensors = useSensors(mouseSensor, touchSensor);

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over) return;
        if (active.id === over.id) return;

        const activeId = Number(active.id);
        const overId = Number(over.id);

        let activeStatus = "";
        let overStatus = "";

        for (const status of statuses) {
            const idsInThisCol = groupedTodos[status].map((todo) => todo.id);
            if (idsInThisCol.includes(activeId)) {
                activeStatus = status;
            }
            if (idsInThisCol.includes(overId)) {
                overStatus = status;
            }
        }
        if (activeStatus && overStatus) {
            if (activeStatus === overStatus) {
                const columnTodos = groupedTodos[activeStatus];
                const oldIndex = columnTodos.findIndex((todo) => todo.id === activeId);
                const newIndex = columnTodos.findIndex((todo) => todo.id === overId);

                const updatedColumn = arrayMove(columnTodos, oldIndex, newIndex);
                const newTodos = [
                    ...todos.filter((t) => t.status.toUpperCase() !== activeStatus),
                    ...updatedColumn,
                ];
                setTodos(newTodos);
            } else {
                setTodos((prevTodos) =>
                    prevTodos.map((todo) =>
                        todo.id === activeId ? { ...todo, status: overStatus.toLowerCase() } : todo
                    )
                );
            }
        }
    }



    return (
        <div className='bg-white rounded-xl my-3'>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className='flex items-start flex-wrap justify-between px-6 py-[25px]'>
                    {statuses.map((status: string, index: number) => (
                        <div key={index} className='md:min-w-[265px] min-h-[150px] xl:mt-0 mt-10'>
                            <div>
                                <h2 className='font-almarai text-[#6C0093] md:text-[32px] text-xl leading-[35.71px]'>{status}</h2>
                            </div>
                            <div
                                className='min-h-[805px] mt-3 bg-[#FDE1FF] rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] p-2'>
                                <SortableContext
                                    id={status}
                                    items={groupedTodos[status].map((todo) => todo.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {groupedTodos[status].length > 0 ? (
                                        groupedTodos[status].map((todo: TodoType) => (
                                            <SortableTodo key={todo.id} todo={todo} handleOpen={handleOpen} />
                                        ))
                                    ) : (
                                        <div className="text-gray-500 text-sm">No tasks available</div>
                                    )}
                                </SortableContext>
                            </div>
                        </div>
                    ))}
                </div>
            </DndContext>
        </div>
    );
}
