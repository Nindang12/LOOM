"use client"
import { useState } from "react"

export default function Header(){
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isShow, setIsShow] = useState<boolean>(false);

    const listButton = ["Dành cho bạn","Đã thích","Đã theo dõi","Đang theo dõi"]

    return(
        <div className="flex flex-row justify-between w-full h-8 items-center gap-2 relative">
            <div className="flex flex-row gap-2 items-center justify-center w-full">
                <span className="font-semibold">Dành cho bạn</span>
                <button onClick={()=>setIsShow((prv)=>!prv)} className="rounded-full h-5 bg-white border border-gray-300 shadow-sm p-1">
                    <img width={10} src="/assets/arrow-down.svg" alt="icon" />
                </button>
                {
                    isShow&&(
                        <div className="absolute flex flex-col gap-1 shadow-md top-10 left-40 p-4 px-2 w-64 h-60 rounded-lg bg-white border border-gray-200">
                            {
                                listButton.map((item:string,index:number) => (
                                    <button onClick={()=>setCurrentIndex(index)} key={index} className="flex flex-row justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
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
        </div>
    )
}