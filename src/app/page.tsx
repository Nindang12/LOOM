"use client"

import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/Article";
import React, { useEffect } from "react";
import Foryou from "@/components/Foryou";
import { useRouter } from "next/navigation";

export default function Home() {
  
  const router = useRouter()
  
  useEffect(()=>{
    if(!localStorage.getItem("isLogin")){
      router.push("/login")
    }
  },[])
  return (
    <div className=" flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <div className="">
        <Siderbar/>
      </div>
      <div className="flex flex-row justify-center mt-2 w-full ">
        <div className="max-w-screen-sm w-full h-screen">
          <Header/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 gap-10 h-screen overflow-y-scroll f">
              <div className="w-full hidden md:block  h-[80px]">
                  <UploadThread/>
              </div>
              <div className="w-full md:hidden  h-[80px] ">
                <Foryou/>
              </div>
              <div className="w-full  ">
                <div >
                  <Article/>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
