import Header from "../Header";
import { useState } from "react";
import Dashboard from "../Dashboard";
import ModalWrapper from "../ModalWrapper";
import todoData from "../../../data.json";
import { TodoType } from "../../types";


export default function Layout() {
    const [todos, setTodos] = useState<TodoType[]>(todoData as TodoType[]);
    const [open, setOpen] = useState<boolean>(false);
    const [mode, setMode] = useState<"create" | "edit" | null>(null);
    const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);

    const handleOpen = (type: "create" | "edit", todo?: TodoType) => {
        setMode(type);
        if (type === "edit" && todo) {
            setSelectedTodo(todo);
        } else {
            setSelectedTodo(null);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setMode(null);
    };

    const createTask = (title: string, description: string) => {
        const newTask = {
            id: todos.length + 1,
            title,
            description,
            status: "to do",
        };
        setTodos(prevTodos => [...prevTodos, newTask]);
        handleClose();
    };

    const updateTask = (id: number, updatedTitle: string, updatedDescription: string, updatedStatus: string) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) =>
                todo.id === id
                    ? { ...todo, title: updatedTitle, description: updatedDescription, status: updatedStatus }
                    : todo
            )
        );
        handleClose();
    };

    const deleteTask = (id: number) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        handleClose();
    };

    return (
        <div className='bg-[#F4E3FF] my-[31px] py-3 px-4 mx-[50px] rounded-xl'>
            <Header open={open} handleOpen={handleOpen} />
            <Dashboard handleOpen={handleOpen} todos={todos} setTodos={setTodos} />
            {open && <ModalWrapper mode={mode} open={open} onClose={handleClose} onCreate={createTask} onUpdate={updateTask} onDelete={deleteTask} selectedTodo={selectedTodo} />}
        </div>
    )
}