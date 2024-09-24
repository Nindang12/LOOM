import Link from "next/link"
export default function Search({searchAccount}: {searchAccount: (user_id: string) => void}){

    return(
        <div className="flex flex-col items-center m-4">
            <Link href={'/'} className=" md:hidden">
                <button>
                    <img width={60} src="/assets/logowhite.png" alt="" />
                </button>
            </Link>
            <div className="w-full md:w-[590px] h-[45px] flex items-center bg-zinc-50 border rounded-xl">
                <div className="h-full flex items-center justify-center px-3 pl-5 pr-2 ">
                    <img width={15} src="/assets/searchse.svg" alt="" />
                </div>
                <div className="flex-1">
                    <input onChange={(e) => searchAccount(e.target.value)} type="search" className="text-sm focus outline-none w-full bg-zinc-50" placeholder="Tìm Kiếm" />
                </div>
            </div>
        </div>
    )
}