"use client"
import ProfileLayout from "@/components/ProfileLayoutProps";
import Thread from "@/components/Thread";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { checkLogin } from "@/utils/auth";
import RowThreadss from "@/components/RowThreads";
import { db } from "@/utils/contants";


export default function Home() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName?.replace("/@", "");

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

  return (
    <ProfileLayout 
      username={data?.userDetails?.[0]?.userId} 
      fullname={data?.userDetails?.[0]?.fullname} 
      image={data?.userDetails?.[0]?.avatar} 
      bio={data?.userDetails?.[0]?.bio}
      link={data?.userDetails?.[0]?.link}
    >
      <div className="w-max-[630px] h-[auto] t-0">
        <RowThreadss username={username || ""} />
      </div>
      <div className="w-max-[630px] h-full t-0 ml-[20px] mr-[20px] z-0">
        <Thread userId={username || ""} />
      </div>
    </ProfileLayout>
  );
}

