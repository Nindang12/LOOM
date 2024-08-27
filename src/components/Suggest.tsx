"use client"
import { useState } from "react"
import Link from "next/link"
export default function Suggest(){
    const[isShow,setIsShow]=useState<boolean>(false);
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }
    return(
        <div className="ml-5 cursor-pointer">
            <div className="mb-5" >
                <span className="text-sm font-bold text-gray-400">Gợi ý theo dõi</span>
            </div>
            <div className="">
                {/* header */}
                <div className="flex flex-row justify-between z-0">
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
                    <button onClick={()=>setIsShow((prv)=>!prv)} className="flex mr-5 items-center justify-center w-[100px] h-[35px] border border-gray-400 rounded-xl">
                        <span className="text-base font-medium">Theo dõi</span>
                    </button>
                    
                    
                </div>
                {
                        isShow &&(
                            <button onClick={toggleModal} className="bg-white absolute top-[205px] px-3 right-[575px] z-1 flex items-center justify-center w-[130px] h-[35px] border border-gray-400 rounded-xl">
                        <span className="text-gray-400 text-base font-medium">Đã theo dõi</span>
                    </button>
                        )
                    }
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