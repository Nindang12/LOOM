export default function Search(){
    return(
        <div className="w-[590px] h-[45px] flex items-center bg-zinc-50 m-5 border rounded-xl">
            <div className="h-full flex items-center justify-center px-3 pl-5 pr-2 ">
                <img width={15} src="/assets/searchse.svg" alt="" />
            </div>
            <div >
                <input type="search" className="text-sm focus outline-none w-[525px] bg-zinc-50" placeholder="Tìm Kiếm" />
            </div>
        </div>
    )
}