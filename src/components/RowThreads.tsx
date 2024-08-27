import Link from "next/link"
export default function RowThreadss(){
    return(
        <div className="flex ">
            <button className="w-[210px] h-[46px] border-solid border-b-[1px] border-black text-sm font-bold">
               <Link className="" href={'/profile'}>Thread</Link> 
            </button>
            <button className="w-[210px] h-[46px] border-solid border-b-[1px] text-gray-400 text-sm font-bold">
                <Link href={'/threadreplied'}>Thread trả lời</Link> 
            </button >
            <button className="w-[210px] h-[46px] border-solid border-b-[1px] text-gray-400 text-sm font-bold">
                <Link className="" href={'/threadreporsts'}>Bài đăng lại</Link> 
            </button>
        </div>
    )
}