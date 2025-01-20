import EditIcon from "../Icons/Edit";
import { TodoType } from "../../types";

interface TodoProps {
    todo: TodoType;
    handleOpen: (type: "edit", todo: TodoType ) => void;
}

export default function Todo({ todo, handleOpen }: TodoProps) {
    return (
        <div className='p-2 font-inter bg-white hover:bg-[#F5C4FF] rounded-md mb-2 max-w-[249px]'>
            <h3>{todo.id}</h3>
            <h4 className='text-xs pt-4 pb-[34px]'>{todo.title}</h4>
            <div className="flex justify-end">
                <div className='cursor-pointer' onClick={() => handleOpen("edit", todo)}>
                    <EditIcon />
                </div>
            </div>
        </div>
    );
}
