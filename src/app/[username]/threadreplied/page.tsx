"use client"
import ProfileLayout from "@/components/ProfileLayoutProps";
import RowThreadssreplied from "@/components/RowThreadsreplied";
import Threadsreplied from "@/components/threadreplied";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { checkLogin } from "@/utils/auth";
import { db } from "@/utils/contants";

export default function ThreadReplied() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName ? pathName.replace("/@", "").replace("/threadreplied", "") : "";

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedInUserId = await checkLogin();
      if (!loggedInUserId) {
        router.push("/login");
      }
    };

    checkAuthStatus();
  }, [router]);

  const query = {
    userDetails: {
      $:{
        where:{
          userId: username
        }
      },
    }
  }

  const {data, isLoading} = db.useQuery(query)
  //console.log(data)
  return (
    data && (
      <ProfileLayout 
        username={data.userDetails[0].userId} 
        fullname={data.userDetails[0].fullname} 
        image={data.userDetails[0].avatar} 
        bio={data.userDetails[0].bio} 
        link={data.userDetails[0].link}
        >
        <div className="w-max-[630px] h-[auto] t-0">
          <RowThreadssreplied username={username} />
        </div>
        <div className="w-min-[630px] h-full flex t-0 mr-[20px]">
          <Threadsreplied userId={username} />
        </div>
      </ProfileLayout>
    )
  );
}
