interface HeaderProps {
    open: boolean;
    handleOpen: (type: "create") => void;
}

export default function Header({open, handleOpen}: HeaderProps) {

    return (
        <div className='flex md:items-center items-start justify-between md:flex-row flex-col'>
            <div>
                <h1
                    className='font-abhaya font-bold leading-[75.5px] text-[#BB2EC8] md:text-[64px] text-4xl'
                >
                    {!open ? "TaskToDone" : "YoTask"}
                </h1>
            </div>
            <div>
                {!open && (
                    <button
                        onClick={() => handleOpen("create")}
                        className="text-[#AD00B2] font-inter leading-[29.05px] md:text-2xl text-base hover:text-[#850087]"
                    >
                        CREATE TASK
                    </button>
                )}
            </div>
        </div>
    )
}