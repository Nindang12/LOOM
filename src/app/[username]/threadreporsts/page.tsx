"use client"
import ProfileLayout from "@/components/ProfileLayoutProps";
import Threadsreporsts from "@/components/threadreporsts";
import RowThreadsreposts from "@/components/RowThreadsreporst";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { checkLogin } from "@/utils/auth";

export default function ThreadReporsts() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName.replace("/@", "").replace("/threadreporsts", "");
  const [dataAccounts, setDataAccounts] = useState<any>([]);
  const [reposts, setReposts] = useState<any>([]);

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

  const getRepostForUser = async () => {
    try {
      const response = await fetch(`/api/post/repost/repostForUser?userId=${username}`);
      if (response.ok) {
        const result = await response.json();
        setReposts(result.reposts || []);
      }
    } catch (error) {
      console.error("Error fetching reposts for user:", error);
    }
  };

  useEffect(() => {
    loadProfile();
    getRepostForUser();
  }, [username]);

  return (
    <ProfileLayout username={dataAccounts.user_id} fullname={dataAccounts.fullname}>
      <RowThreadsreposts />
      <div className="w-max-[630px] flex justify-center h-auto t-0 ml-[20px] mr-[20px] flex-col gap-2">
        {reposts.map((data: any) => (
          <Threadsreporsts
            key={data.repost}
            user_id={data.user_id}
            content={data.original_content}
            postId={data.repost}
            repostedBy={username}
          />
        ))}
      </div>
    </ProfileLayout>
  );
}
