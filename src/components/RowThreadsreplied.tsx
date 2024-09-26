"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
export default function RowThreadssreplied(){
    const [username,setUsername] = useState<string|null>(null);
    useEffect(()=>{
        if(sessionStorage.getItem("isLogin")){
            setUsername(sessionStorage.getItem("user_id"))
        }
    },[])
    return(
        <div className="flex ">
            <Link  href={`/@${username}`} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className="h-[46px] text-gray-400 text-sm font-bold">Thread</button> 
            </Link>
            <button className="w-1/3 h-[46px] border-solid border-b-[1px] border-black text-sm font-bold">
                <Link href={`/@${username}/threadreplied`}>Thread trả lời</Link> 
            </button >
            <Link  href={`/@${username}/threadreporsts`} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className="w-[120px] md:w-[210px] h-[46px] border-solid border-b-[1px] text-gray-400 text-sm font-bold">Bài đăng lại</button> 
            </Link>
        </div>
    )
}