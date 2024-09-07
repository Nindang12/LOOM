"use client"
import { useState } from "react"

export default function HeaderActivity(){
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isShow, setIsShow] = useState<boolean>(false);
    const listButton = ["Tất cả","Lượt theo dõi","Thread trả lời","Lượt nhắc","Lượt trích dẫn","Bài đăng lại","Đã xác minh"]
    return(
        <div className="flex flex-row justify-between w-full h-8 items-center gap-2 relative">
            <div className="flex flex-row gap-2 items-center justify-center w-full">
                <span className="font-semibold">Hoạt động</span>
                <button onClick={()=>setIsShow((prv)=>!prv)} className="rounded-full h-5 bg-white border border-gray-300 shadow-sm p-1">
                    <img width={10} src="/assets/arrow-down.svg" alt="icon" />
                </button>
                {
                    isShow&&(
                        <div className="absolute flex flex-col gap-1 shadow-md top-10 left-40 p-4 px-2 w-64 h-[385px] rounded-lg bg-white border border-gray-200">
                            {
                                listButton.map((item:string,index:number) => (
                                    <button onClick={()=>setCurrentIndex(index)} key={index} className="flex flex-row justify-between text-sm font-bold hover:bg-slate-200 px-2 py-3 rounded-lg">
                                        <span>{item}</span>
                                        {
                                            currentIndex === index &&
                                            <img width={18} src="/assets/check.svg" alt="icon" />
                                        }
                                    </button>
                                ))
                            }
                        </div>
                    )
                }
            </div>
            <div className="mr-5">
                <button className="bg-white border border-gray-300 items-center justify-center flex h-6 w-6 shadow-sm rounded-full">
                    <img width={16} src="/assets/option.svg" alt="icon" />
                </button>   
            </div>
        </div>
    )
}