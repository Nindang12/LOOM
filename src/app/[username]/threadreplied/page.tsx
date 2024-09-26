"use client"
import EditProfile from "@/components/EditProfile";
import Follower from "@/components/FollowerInProfile";
import HeaderProfile from "@/components/HeaderProfile";
import NameProfile from "@/components/NameProfile";
import Siderbar from "@/components/Sidebar"
import RowThreadssreplied from "@/components/RowThreadsreplied";
import Threadsreplied from "@/components/threadreplied";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";


export default function ThreadReplied() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName ? pathName.replace("/@", "").replace("/threadreplied", "") : "";
  const [dataAccounts, setDataAccounts] = useState<any>([]);
  
  useEffect(() => {
      if (!sessionStorage.getItem("isLogin")) {
          router.push("/login");
      }
      if (username) {
          loadProfile();
      }
  }, []);

  const loadProfile = async () => {
      try {
          const res = await axios.post("/api/account/", {
              username
          }, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });
          const data = await res.data;
          setDataAccounts(data[0]);
      } catch (error) {
          console.error(error);
      }
  };
  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderProfile />
          <div className="flex flex-col border border-gray-300 w-full  rounded-xl mt-10 h-screen overflow-y-scroll ">
              <div className="w-max-[630px] h-[80px] ml-[15px] mr-[15px]">
                {dataAccounts && (
                                <NameProfile username={dataAccounts.user_id} fullname={dataAccounts.fullname} />
                            )}              
                </div>
              <div className="w-max-[630px] h-[80px] ml-[15px] mr-[20px]  ">
                  <Follower/>
              </div>
              <div className="w-max-[630px] h-[90px] t-0">
                <EditProfile/>
              </div>
              <div className="w-max-[630px] h-[80px] t-0">
                <RowThreadssreplied/>
              </div>
              <div className="w-max-[630px] h-full flex items-center justify-center t-0 ml-[20px] mr-[20px]">
                <Threadsreplied/>
              </div>

          </div>
        </div>
      </div>
    </div>
  );
}