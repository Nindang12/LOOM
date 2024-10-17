import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"

export default function Header(){
    const router = useRouter()
    const pathname = usePathname()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isShow, setIsShow] = useState<boolean>(false);

    const listButton = [
        { name: "Dành cho bạn", link: "/" },
        { name: "Đang theo dõi", link: "/following" },
        { name: "Đã thích", link: "/liked" },
        { name: "Đã lưu", link: "/saved" }
    ]

    useEffect(() => {
        const index = listButton.findIndex(item => item.link === pathname)
        if (index !== -1) {
            setCurrentIndex(index)
        }
    }, [pathname])

    const handleButtonClick = async (index: number, link: string) => {
        setCurrentIndex(index);
        setIsShow(false);
        try {
            await router.push(link);
        } catch (error) {
            console.error("Navigation error:", error);
            // Có thể thêm xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng
        }
    }

    return( 
        <div className="flex flex-row justify-between w-full h-8 items-center gap-2 p-8 relative">
            <div className="flex flex-row gap-2 items-center justify-center w-full">
                <span className="font-semibold">{listButton[currentIndex].name}</span>
                <button 
                    onClick={() => setIsShow(prev => !prev)} 
                    className="rounded-full h-5 bg-white border border-gray-300 shadow-sm p-1"
                >
                    <img width={10} src="/assets/arrow-down.svg" alt="icon" />
                </button>
                {isShow && (
                    <div 
                        className="absolute z-50 flex flex-col gap-1 shadow-md top-12 left-40 p-4 px-2 w-64 h-auto rounded-lg bg-white border border-gray-200"
                        ref={(node) => {
                            if (node) {
                                const handleClickOutside = (event: MouseEvent) => {
                                    if (node && !node.contains(event.target as Node)) {
                                        setIsShow(false);
                                    }
                                };
                                document.addEventListener("mousedown", handleClickOutside);
                                return () => {
                                    document.removeEventListener("mousedown", handleClickOutside);
                                };
                            }
                        }}
                    >
                        {listButton.map((item, index) => (
                            <button 
                                key={index} 
                                className="flex flex-row justify-between hover:bg-slate-200 px-2 py-3 rounded-lg"
                                onClick={() => handleButtonClick(index, item.link)}
                            >
                                <span>{item.name}</span>
                                {currentIndex === index && (
                                    <img width={18} src="/assets/check.svg" alt="icon" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}