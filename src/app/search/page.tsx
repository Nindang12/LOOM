"use client"

import HeaderSearch from "@/components/HeaderSearch";
import Siderbar from "@/components/Sidebar"
import Search from "@/components/Search";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Suggest from "@/components/Suggest";
import axios from "axios";
import { db } from "@/utils/contants";
import { checkLogin, getUserId } from "@/utils/auth";

export default function SearchPage() {
  const router = useRouter()
  const [accountData, setAccountData] = useState<AccountData[]>([]);
  const [search, setSearch] = useState<string>("")
  const [userId, setUserId] = useState<string>("")

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    if(typeof window !== "undefined"){
      const userId = getUserId();
      setUserId(userId as string)
    }
  }, [])

  const query = {
    userDetails: {}
  }

  const { data } = db.useQuery(query)

  const filteredData = useMemo(() => {
    return data?.userDetails.filter((item: any) => item.userId.includes(search)&&item.userId !== userId);
  }, [data, search]);
  

  useEffect(() => {
    const verifyLogin = async () => {
        const loggedIn = await checkLogin();
        setIsLoggedIn(loggedIn)
        if (!loggedIn) {
            router.push('/login');
        }
    };
    verifyLogin();
}, [router]);
  
  // console.log({filteredData})

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderSearch/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll">
              <div className="w-full h-[80px]">
                  <Search searchAccount={setSearch}/>
              </div>
              <div className="w-full h-full mt-10 md:mt-0 flex flex-col">
                <span className="text-sm font-bold text-gray-400 ml-5 mb-5">Gợi ý theo dõi</span>
                {
                  filteredData && filteredData.length > 0 && filteredData.map((item: any)=>{
                    return <Suggest key={item.userId} data={item}/>
                  })
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}