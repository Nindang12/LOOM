"use client"

import HeaderSearch from "@/components/HeaderSearch";
import Siderbar from "@/components/Sidebar"
import Search from "@/components/Search";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Suggest from "@/components/Suggest";
import axios from "axios";

export default function SearchPage() {
  const router = useRouter()
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  
  const searchAccount = async (user_id: string) => {
    if(user_id === ""){
      setAccountData([])
    }else{
      if(user_id.length > 0){
        try {
          const response = await axios.get(`/api/account?userId=${user_id}`);
          if (!response) {
            return null;
          }
          const accountData = await response.data;
          setAccountData(accountData);
        } catch (error) {
          console.error('Failed to fetch account:', error);
        }
      }
    }
  };

  //console.log(accountData)

  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderSearch/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll">
              <div className="w-full h-[80px]">
                  <Search searchAccount={searchAccount}/>
              </div>
              <div className="w-full h-full mt-10 md:mt-0">
                {
                  accountData.length > 0 &&accountData.map((item)=>{
                    return <Suggest key={item.user_id} data={item}/>
                  })
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}