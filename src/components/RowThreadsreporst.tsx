"use client"
import Link from "next/link"
import React from "react"
export default function RowThreadssreposts(){
    return(
        <div className="flex items-center justify-between ">
            <Link  href={'/profile'} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className="  h-[46px]  text-gray-400 text-sm font-bold">Thread</button> 
            </Link>
            <Link  href={'/threadreplied'} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className=" h-[46px]  text-gray-400 text-sm font-bold">Thread trả lời</button> 
            </Link>
            <button className="w-1/3  h-[46px] border-solid border-b-[1px] border-black text-sm font-bold">
                <Link className="" href={'/threadreporsts'}>Bài đăng lại</Link> 
            </button>
        </div>
    )
}