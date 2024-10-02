"use client"
import ProfileLayout from "@/components/ProfileLayoutProps";
import RowThreads from "@/components/RowThreads";
import Thread from "@/components/Thread";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { checkLogin } from "@/utils/auth";
import RowThreadss from "@/components/RowThreads";
export default function Home() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName.replace("/@", "");
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
    <ProfileLayout username={dataAccounts.user_id} fullname={dataAccounts.fullname}>
      <div className="w-max-[630px] h-[80px] t-0">
        <RowThreadss />
      </div>
      <div className="w-max-[630px] h-full t-0 ml-[20px] mr-[20px] z-0">
        <Thread userId={username} />
      </div>
    </ProfileLayout>
  );
}
