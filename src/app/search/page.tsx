"use client"

import HeaderSearch from "@/components/HeaderSearch";
import Siderbar from "@/components/Sidebar"
import Search from "@/components/Search";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Suggest from "@/components/Suggest";
export default function Home() {
  const router = useRouter()
  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderSearch/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll">
              <div className="w-full h-[80px]">
                  <Search/>
              </div>
              <div className="w-full h-full mt-10 md:mt-0">
                <div >
                  <Suggest/>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}