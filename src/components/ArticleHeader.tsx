import Link from "next/link"
export default function ArticleHeader(){
    return(
        <div>
            <div className="">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row gap-2 mt-2 ml-5 items-center">
                        <div>
                            <img className=" rounded-full w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />
                            <div className="relative top-[-20px] left-3 p-1 ">
                                <img width={20} src="/assets/addfriend.svg" alt="" />
                            </div>

                        </div>
                        <div>
                            <div className="flex flex-row gap-2">
                                <Link href={`/chien_ha`} className="font-bold text-sm">
                                    <span>chien_ha</span>
                                </Link>
                                <span className="text-sm text-gray-400">20 giờ</span>
                            </div>
                            <div className="text-sm">
                                <p>stt</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button className="mr-5 hover:bg-slate-100 p-3 rounded-full">
                            <img width={10} src="/assets/optiononarticle.svg" alt="" />
                        </button>
                    </div>
                </div>
            
                
            </div>
            
        </div>
        
        
    )
}