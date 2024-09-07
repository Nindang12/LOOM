"use client"
import { useState } from "react"
import Link from "next/link"
export default function Suggest(){
    const [isFollowing, setIsFollowing] = useState(false);

    const toggleFollow = () => {
        setIsFollowing(!isFollowing);
    };
    return(
        <div className="ml-5 cursor-pointer">
            <div className="mb-5 hidden md:bolck" >
                <span className="text-sm font-bold text-gray-400">Gợi ý theo dõi</span>
            </div>
            <div className="">
                {/* header */}
                <div className="flex flex-row justify-between items-center ">
                    <div className="flex flex-row gap-2 items-center ">
                        <div>
                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt=""></img>           
                        </div>
                        <div className="flex flex-col ">
                            <Link href={`/chien_ha`} className="font-bold text-sm">
                                <span className="">chien_ha</span>
                            </Link>
                            <div className="text-sm text-gray-400">
                                <p>Hà Minh Chiến</p>
                            </div>
                        </div>
                    </div>
                    <button onClick={toggleFollow} className="flex mr-5 items-center justify-center w-auto h-[35px] border border-gray-400 rounded-xl">
                        <span className={`text-base p-5 font-medium ${isFollowing ? 'text-gray-400' : 'text-black'}`}>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
                    </button>
                </div>
                
                {/* body */}
                <div>
                    <p className="text-sm font-normal px-[40px] py-2">100K người theo dõi</p>
                </div>
                <div className="w-[568px] h-[1px] bg-gray-300 ml-[40px] mb-5"></div>
            </div>
            {/* blockihfui */}  
                      
        </div>
    )
}