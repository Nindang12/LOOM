"use client"
import Link from "next/link";
export default function HeaderViewPost(){
    return(
        <div className="flex flex-row justify-between w-full h-8 items-center gap-2 relative">
            <div className="flex flex-row gap-2 items-center justify-between w-full">
                <Link href={'/'} className="rounded-full bg-white  shadow-sm p-1">
                    <img width={20} src="/assets/arrow-left.svg" alt="icon" />
                </Link>
                <span className="font-semibold">Dành cho bạn</span>
                <div></div>
            </div>
        </div>
    )
}