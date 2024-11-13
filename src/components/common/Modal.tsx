interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    onRedirect: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, onRedirect }) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
                <div className="mb-6">
                    <img 
                        src="/loom.png" 
                        alt="Loom Logo" 
                        className="w-28 h-20 mx-auto"
                    />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-black">{title}</h2>
                <p className="mb-8 text-gray-400 text-sm">{message}</p>
                <div className="space-y-3">
                    <button 
                        onClick={onRedirect}
                        className="w-full px-4 py-3 bg-[#25252b] text-white rounded-lg hover:bg-[#4842E3] transition-colors duration-200"
                    >
                        Đăng nhập với Loom
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;