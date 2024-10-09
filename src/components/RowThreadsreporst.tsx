"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserId } from "@/utils/auth";

export default function RowThreadssreposts({username}:{username:string}){
    return(
        <div className="flex items-center justify-between ">
            <Link  href={`/@${username}`} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className="  h-[46px]  text-gray-400 text-sm font-bold">Thread</button> 
            </Link>
            <Link  href={`/@${username}/threadreplied`} className="w-1/3 flex justify-center border-solid border-b-[1px]">
               <button  className=" h-[46px]  text-gray-400 text-sm font-bold">Thread trả lời</button> 
            </Link>
            <Link  href={`/@${username}/threadreporsts`} className="w-1/3 flex justify-center border-solid border-b-[1px] border-black">
               <button  className=" h-[46px]  text-black text-sm font-bold">Bài đăng lại</button> 
            </Link>
        </div>
    )
}