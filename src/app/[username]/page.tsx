"use client"

import EditProfile from "@/components/EditProfile";
import Follower from "@/components/FollowerInProfile";
import HeaderProfile from "@/components/HeaderProfile";
import NameProfile from "@/components/NameProfile";
import Siderbar from "@/components/Sidebar"
import RowThreadss from "@/components/RowThreads";
import Thread from "@/components/Thread";
import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";


export default function Home() {
    const router = useRouter()
    const pathName = usePathname();
    const username = pathName.replace("/@","")
    

    useEffect(()=>{
        if(!localStorage.getItem("isLogin")){
            router.push("/login")
        }
        if(username){
            loadProfile()
        }
    },[])

    const loadProfile = async()=>{
        try {
            const res = await axios.post("/api/account/",{
                username
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.data
            console.log(data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
      <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
        <Siderbar/>
        <div className="flex flex-row justify-center mt-2 w-full">
          <div className="max-w-screen-sm w-full h-screen">
            <HeaderProfile />
            <div className="flex flex-col border border-gray-300 w-full  rounded-xl mt-10 h-screen overflow-y-scroll ">
                <div className="w-max-[630px] h-[80px] ml-[15px] mr-[15px]">
                    <NameProfile/>
                </div>
                <div className="w-max-[630px] h-[80px] ml-[15px] mr-[20px]  ">
                    <Follower/>
                </div>
                <div className="w-max-[630px] h-[90px] t-0">
                  <EditProfile/>
                </div>
                <div className="w-max-[630px] h-[80px] t-0">
                  <RowThreadss/>
                </div>
                <div className="w-max-[630px] h-full t-0 ml-[20px] mr-[20px]">
                  <Thread/>
                </div>

            </div>
          </div>
        </div>
      </div>
    );
  }