"use client"
import Link from "next/link"
import React from "react"
export default function RowThreadssreplied(){
    return(
        <div className="flex ">
            <Link  href={'/profile'} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className="h-[46px] text-gray-400 text-sm font-bold">Thread</button> 
            </Link>
            <button className="w-1/3 h-[46px] border-solid border-b-[1px] border-black text-sm font-bold">
                <Link href={'/threadreplied'}>Thread trả lời</Link> 
            </button >
            <Link  href={'/threadreporsts'} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className="w-[120px] md:w-[210px] h-[46px] border-solid border-b-[1px] text-gray-400 text-sm font-bold">Bài đăng lại</button> 
            </Link>
        </div>
    )
}