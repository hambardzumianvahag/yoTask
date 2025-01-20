import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Todo from "../Todo";
import { TodoType } from "../../types";

interface SortableTodoProps {
    todo: TodoType;
    handleOpen: (type: "edit", todo: TodoType) => void;
}

export default function SortableTodo({ todo, handleOpen }: SortableTodoProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: todo.id.toString(),
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Todo todo={todo} handleOpen={handleOpen} />
        </div>
    );
}
