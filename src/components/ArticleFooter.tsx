export default function ArticleFooter(){
    return(
        <div className="border-b border-gray-200">
            <div className="flex mt-5 ml-[60px] items-center text-sm font-thin gap-5 mb-3 ">
                    <button className="flex hover:bg-slate-100 p-2 rounded-3xl">
                        <img className="" width={20} src="/assets/heartonarticle.svg" alt="" />
                        <span>100</span>
                    </button>
                    <button className="flex hover:bg-slate-100 p-2 rounded-3xl">
                        <img className="" width={20} src="/assets/comment.svg" alt="" />
                        <span>100</span>
                    </button>
                    <button className="flex hover:bg-slate-100 p-2 rounded-3xl">
                        <img className="" width={20} src="/assets/replay.svg" alt="" />
                        <span>100</span>
                    </button>
                    <button className="flex hover:bg-slate-100 p-1 rounded-3xl">
                        <img className="" width={30} src="/assets/share.svg" alt="" />
                        <span>100</span>
                    </button>
                </div>
        </div>
    )
}