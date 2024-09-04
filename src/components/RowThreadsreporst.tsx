"use client"
import Link from "next/link"
import React from "react"
export default function RowThreadsreporsts(){

        return(

            <div className="flex ">
                <Link href={'/profile'}>
                <button className="w-[210px] h-[46px] border-solid border-b-[1px] text-gray-400 text-sm font-bold">
                Thread
                </button>
                </Link>
                <Link href={'/threadreplied'}>
                <button className="w-[210px] h-[46px] border-solid border-b-[1px] text-gray-400 text-sm font-bold">
                    Thread trả lời 
                </button >
                </Link>
                <Link href={'/threadreporsts'}>
                <button className="w-[210px] h-[46px] border-solid border-b-[1px] border-black text-sm font-bold">
                    Bài đăng lại 
                </button>
                </Link>
            </div>
        )
    
}