"use client"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function Siderbar(){
    const [isShow, setIsShow] = useState<boolean>(false);
    const [username,setUsername] = useState<string|null>(null);

    useEffect(()=>{
        if(sessionStorage.getItem("isLogin")){
            setUsername(sessionStorage.getItem("user_id"))
        }
    },[])

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }



    return(
        <div className="">
            <div className="flex justify-center md:w-20 md:h-screen items-center bg-zinc-50 w-screen h-20">
                <div className="flex md:flex-col  md:gap-16 gap-5  flex-row ">
                    <Link href={"/"} className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={20} src="/assets/home.svg" alt="home" />
                    </Link>
                    <Link href={"/search"} className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={20} src="/assets/search.svg" alt="search" />
                    </Link>
                    <div onClick={()=>setIsShow((prv)=>!prv)}  className="md:hidden hover:bg-slate-200 p-3 rounded-lg">
                        <img width={30} src="/assets/write.svg" alt="" />
                    </div>
                    <Link href={"/activity"}className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={20} src="/assets/heart.svg" alt="heart" />
                    </Link>
                    <Link href={`/@${username}`} className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={20} src="/assets/profile.svg" alt="profile" />
                    </Link>
                </div>
            </div>
        {
            isShow && (
                <div className=" flex flex-col z-20 items-center fixed top-0 left-0 w-full h-full bg-white " >
                    
                    <div className="py-5 flex flex-row ">
                        <div onClick={toggleModal}  className="w-[120px] md:hidden pl-[20px]">Huỷ</div>
                        <span className=" w-[120px]text-black md:text-white font-bold">Thread </span>
                        <div className="w-[120px] md:hidden"></div>
                    </div>
                        <div className="flex flex-col  w-screen ml-10">
                            <div className="flex flex-row items-start">
                                <img width={30} className="rounded-full w-8 h-8 bg-cover " src="data:image/jpeg;base64,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" alt="" />
                                <div className="flex flex-col px-3">
                                    <span className="text-sm">nindang84 </span>
                                    <input className="focus outline-none text-sm font-light w-[full]" type="text" placeholder="Bắt đầu threads..." />
                                </div>
                                
                            </div>
                            <div className="flex flex-row">
                                <div className="h-[25px] w-[2px] bg-slate-500 mx-4"></div>
                                <div>
                                    <button className="px-2">
                                        <img width={20} src="/assets/album.svg" className="" alt="icon" />
                                    </button >   
                                    <button className="px-2">
                                        <img width={15} src="/assets/gif.svg" alt="" />
                                    </button>
                                    <button className="px-2">
                                        <img width={15} src="/assets/number.svg" alt="" />
                                    </button>
                                    <button className="px-2">
                                        <img width={20} src="/assets/bargraph.svg" alt="" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <div className="px-2">
                                    <img width={30} className="rounded-full w-4 h-4  bg-cover" src="data:image/jpeg;base64,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" alt="" />
                                </div>
                                <div className="text-slate-500 text-sm font-light">
                                    <button>Thêm vào threads</button>
                                </div>
                            </div>
                            </div>
                            <div className="pt-10 flex flex-row  items-center justify-between translate-y-[500px] gap-5 md:translate-y-0">
                                <div className="text-slate-400 text-sm font-light">
                                    <button>Bất kỳ ai cũng có thể trả lời và trích dẫn</button>
                                </div>
                                <div>
                                    <button className="w-20 h-10 flex justify-center items-center bg-gray-400  md:mr-[40px] border border-gray-4 00 rounded-full">
                                        <span className="font-semibold text-white md:text-black">Đăng</span>
                                    </button>
                                </div>
                            </div>
                        </div>
            )
        }
        </div>
    )
}