"use client"
import { useState } from "react"

export default function HeaderProfile(){
    return(
        <div className="flex flex-row justify-between w-full h-8 items-center gap-2 relative">
            <div className="flex flex-row gap-2 items-center justify-center w-full">
                <span className="font-semibold">Trang cá nhân</span>
            </div>
            <div className="mr-5">
                <button className="bg-white border border-gray-300 items-center justify-center flex h-6 w-6 shadow-sm rounded-full">
                    <img width={16} src="/assets/option.svg" alt="icon" />
                </button>   
            </div>
        </div>
    )
}