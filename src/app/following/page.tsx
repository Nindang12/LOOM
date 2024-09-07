import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";
import React from "react";
import Following from "@/components/Following";
import ArticleFollowing from "@/components/ArticleFollowing";

export default function Home() {
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  return (
    <div className=" flex md:flex-row flex-col-reverse overflow-hidden h-screen">
      <div className="">
      <Siderbar/>

      </div>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <Header/>
          <div className="flex flex-col border border-gray-300 w-screen rounded-xl mt-10 gap-10 h-screen overflow-y-scroll f">
              <div className="w-full hidden md:block  h-[80px] ">
                  <UploadThread/>
              </div>
              <div className="w-full md:hidden  h-[80px]">
                <Following/>
              </div>
              <div className="w-full z-1">
                <div >
                  <ArticleFollowing/>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
