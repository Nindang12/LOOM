    import Link from "next/link"
    export default function Option_active_quotes(){
        return(
        <div className="flex flex-col justify-center md:hidden ">  
            <button className="my-5">
                <Link href={'/'} className="flex justify-center ">
                    <img width={60}  src="/assets/logowhite.png" alt="" />
                </Link>
            </button>
            <div className="flex flex-row overflow-x-auto w-full max-w-[400px] "> {/* Thiết lập chiều rộng tối đa */}
                <Link href="/activity"><button className=" whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Tất cả</button></Link>
                <Link href="/activity/follow"><button className="whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Lượt theo dõi</button></Link>
                <Link href="/activity/replies"><button className="whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Thread trả lời</button></Link>
                <Link href="/activity/mentions"><button className="whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Lượt nhắc</button></Link>
                <Link href="/activity/quotes"><button className="bg-black text-white whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Lượt trích dẫn</button></Link>
                <Link href="/activity/reposts"><button className="whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Bài đăng lại</button></Link>
                <Link href="/activity/verified"><button className="whitespace-nowrap text-sm font-bold ml-2 border border-1 border-solid rounded-lg py-1 px-7">Đã xác minh</button></Link>
            </div>
        </div>
        )
    }