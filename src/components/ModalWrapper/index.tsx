import { Box, Modal } from "@mui/material";
import {useEffect, useState} from "react";
import { TodoType } from "../../types";

interface ModalProps {
    mode: "create" | "edit" | null;
    open: boolean;
    onClose: () => void;
    onCreate: (title: string, description: string) => void;
    onUpdate: (id:number, title: string, description: string, updatedStatus: string) => void;
    onDelete: (id:number) => void;
    selectedTodo: TodoType | null;
}

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "90%",
    maxWidth: "800px",
    transform: "translate(-50%, -50%)",
    fontFamily: "inter",
    bgcolor: "background.paper",
    borderRadius: "32px",
    p: { xs: "20px", sm: "30px", md: "40px" },
};


export default function ModalWrapper({ mode, open, onClose, onCreate, onUpdate, onDelete, selectedTodo }: ModalProps) {
    const [title, setTitle] = useState<string>(selectedTodo?.title || "");
    const [description, setDescription] = useState<string>(selectedTodo?.description || "");
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [errorText, setErrorText] = useState<string>('');

    useEffect(() => {
        if (selectedTodo) {
            setTitle(selectedTodo.title);
            setDescription(selectedTodo.description);
            setSelectedStatus(selectedTodo.status);
        }
    }, [selectedTodo]);

    const handleSave = () => {
        if (!title || !description) {
            setErrorText("All fields are required!");
            return;
        }
        setErrorText("");
        if (mode === "edit" && selectedTodo) {
            const updatedStatus = selectedStatus || selectedTodo.status;
            onUpdate(selectedTodo.id, title, description, updatedStatus);
        } else if (mode === "create") {
            onCreate(title, description);
        }
    };


    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="flex justify-between items-start md:items-center">
                    <h2 className="text-xl md:text-2xl leading-tight">{mode === "create" ? "CREATE TASK" : "EDIT TASK"}</h2>
                    <span
                        onClick={onClose}
                        className="text-[#AF00B2] hover:text-[#850087] cursor-pointer text-lg md:text-xl"
                    >
                        &#x2715;
                    </span>
                </div>
                <Box sx={{ mt: 2 }}>
                    {errorText && <h2 className="text-[#CF0707] font-semibold">{errorText}</h2>}
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full mt-6 p-3 rounded-lg border border-[#AF00B2] text-sm md:text-base"
                            placeholder="Title"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full mt-5 mb-10 p-3 rounded-lg border border-[#AF00B2] text-sm md:text-base"
                            placeholder="Description"
                            style={{ minHeight: "120px", maxHeight: "160px" }}
                        />
                        {mode === "edit" && selectedStatus && (
                            <div className="w-fit flex flex-wrap gap-3 mb-6 bg-[#F2CBFF] p-4 rounded-lg">
                                {["TO DO", "IN PROGRESS", "TESTING", "DONE"].map((status: string, index: number) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setSelectedStatus(status);
                                        }}
                                        className={`py-2 px-4 rounded-lg text-sm md:text-base text-white 
                                        ${selectedStatus?.toUpperCase() === status ? "bg-[#A201DC]" : "bg-[#D45FFF]"}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}

                        <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                            <div className="flex gap-4">
                                {mode === "edit" && selectedTodo && (
                                    <button onClick={() => onDelete(selectedTodo.id)} className="text-sm md:text-base text-[#CF0707] hover:text-[#F91818]">
                                        DELETE TASK
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="text-sm md:text-base text-[#8E8E8E] hover:text-[#707070]"
                                >
                                    CLOSE
                                </button>
                            </div>
                            <div>
                                <button
                                    onClick={handleSave}
                                    className="text-sm md:text-base text-[#AF00B2] hover:text-[#850087]">
                                    {mode === "create" ? "CREATE" : "SAVE CHANGES"}
                                </button>
                            </div>
                        </Box>
                    </form>
                </Box>
            </Box>
        </Modal>
    );
}
