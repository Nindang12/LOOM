import Link from "next/link"
export default function Foryou(){
    return(   
            <div className="flex flex-col items-center mt-5">
                <Link href={'/'}>
                    <button>
                        <img width={60} src="/assets/logowhite.png" alt="" />
                    </button>
                </Link>
                <div className="w-screen h-[50px]">
                    <Link href={'/'}>
                        <button  className="w-1/2 text-sm font-bold p-3 border-solid border-b-[1px] border-black " >
                            Dành cho bạn
                        </button>
                    </Link>
                    <Link href={'/following'}>
                        <button className="w-1/2 text-sm font-bold text-gray-400 border-solid border-b-[1px] p-3 border-gray-400">
                            Đang theo dõi
                        </button>
                    </Link>
                </div>
            </div>
    )
}