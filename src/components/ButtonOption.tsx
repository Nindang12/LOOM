import { useState, useEffect } from "react"

export default function ButtonOption(){
    const [isShow, setIsShow] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return(
        <div className="flex justify-center items-center relative">
            <button className="hover:bg-slate-200 p-3 rounded-lg" onClick={() => setIsShow((prev) => !prev)}>
                <img width={20} src="/assets/option-row.svg" alt="option" />
            </button>
            {isShow && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsShow(false)}>
                    <div 
                        className={`absolute bg-white rounded-2xl shadow-lg p-4 ${
                            isMobile 
                                ? "bottom-0 left-0 right-0 rounded-t-2xl" 
                                : "bottom-24 left-5 w-48"
                        }`} 
                        onClick={(e) => e.stopPropagation()}
                    >   
                        <div className="border-b">
                            <button className="flex justify-center items-center text-black w-full hover:bg-slate-200 rounded-lg">
                                <span className="mr-2">Giao diện</span>
                                <img width={12} src="/assets/arrow-right.svg" alt="arrow" />
                            </button>
                            <button className="py-3 text-black w-full hover:bg-slate-200 rounded-lg">Thông tin chi tiết</button>
                            <button className="py-3 text-black w-full hover:bg-slate-200 rounded-lg">Cài đặt</button>
                        </div>
                        <div className="border-t">
                            <button className="py-3 text-black w-full hover:bg-slate-200 rounded-lg">Báo cáo sự cố</button>
                            <button 
                                className="py-3 text-black w-full hover:bg-slate-200 rounded-lg"
                                onClick={() => {
                                    setIsLoggedIn(false);
                                    console.log("Logging out...");
                                    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                                    localStorage.removeItem('lastLoginTime');
                                    window.location.href = '/login';
                                }}
                            >
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}