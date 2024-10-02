"use client"
import ProfileLayout from "@/components/ProfileLayoutProps";
import RowThreadssreplied from "@/components/RowThreadsreplied";
import Threadsreplied from "@/components/threadreplied";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { checkLogin } from "@/utils/auth";

export default function ThreadReplied() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName ? pathName.replace("/@", "").replace("/threadreplied", "") : "";
  const [dataAccounts, setDataAccounts] = useState<any>([]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedInUserId = await checkLogin();
      if (!loggedInUserId) {
        router.push("/login");
      }
    };

    checkAuthStatus();
  }, [router]);

  const loadProfile = async () => {
    try {
      const cachedData = localStorage.getItem(`profile_${username}`);
      if (cachedData) {
        setDataAccounts(JSON.parse(cachedData));
      } else {
        const res = await axios.post("/api/account/", {
          username,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.data;
        setDataAccounts(data[0]);
        localStorage.setItem(`profile_${username}`, JSON.stringify(data[0]));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    dataAccounts && (
      <ProfileLayout username={dataAccounts.user_id} fullname={dataAccounts.fullname}>
        <div className="w-max-[630px] h-[80px] t-0">
          <RowThreadssreplied />
        </div>
        <div className="w-min-[630px] h-full flex t-0 mr-[20px]">
          <Threadsreplied userId={username} />
        </div>
      </ProfileLayout>
    )
  );
}
