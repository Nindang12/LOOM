import { useState } from "react"

export default function ButtonOption(){
    const [isShow, setIsShow] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    return(
        <div className="flex justify-center items-center relative">
            <button className="hover:bg-slate-200 p-3 rounded-lg" onClick={() => setIsShow((prev) => !prev)}>
                <img width={20} src="/assets/option-row.svg" alt="option" />
            </button>
            {isShow && (
                <div className="fixed inset-0" onClick={() => setIsShow(false)}>
                    <div className="absolute bottom-24 left-5 w-48 bg-white rounded-2xl shadow-lg p-4" onClick={(e) => e.stopPropagation()}>   
                        <div className="border-b ">
                            <button className=" py-3 flex justify-center items-center text-black w-full hover:bg-slate-200 rounded-lg">
                                Giao diện
                                <img width={20} className="pl-2" src="/assets/arrow-right.svg" alt="arrow" />
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