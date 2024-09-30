"use client"

import EditProfile from "@/components/EditProfile";
import Follower from "@/components/FollowerInProfile";
import HeaderProfile from "@/components/HeaderProfile";
import NameProfile from "@/components/NameProfile";
import Siderbar from "@/components/Sidebar"
import Threadsreporsts from "@/components/threadreporsts";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import RowThreadsreposts from "@/components/RowThreadsreporst";

export default function ThreadReporsts() {
    const router = useRouter();
    const pathName = usePathname();
    const username = pathName ? pathName.replace("/@", "").replace("/threadreporsts", "") : "";
    const [dataAccounts, setDataAccounts] = useState<any>([]);
    const [reposts,setReposts] = useState<any>([])

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
    const getRepostForUser = async () => {
        if (!username) return;

        try {
            const response = await fetch(`/api/post/repost/repostForUser?userId=${username}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                if (Array.isArray(result.reposts)) {
                    setReposts(result.reposts);
                } else {
                    console.error('Unexpected response format');
                }
            } else {
                console.error('Failed to fetch reposts for user');
            }
        } catch (error) {
            console.error('Error fetching reposts for user:', error);
        }
    };

    useEffect(() => {
        if (username) {
            getRepostForUser();
        }
    }, [username]);

    return (
        <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Siderbar />
            <div className="flex flex-row justify-center mt-2 w-full">
                <div className="max-w-screen-sm w-full h-screen">
                    <HeaderProfile />
                    <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-[screen] overflow-y-scroll">
                        <div className="w-max-[630px] h-[80px] ml-[15px] mr-[15px]">
                            {dataAccounts && (
                                <NameProfile username={dataAccounts.user_id} fullname={dataAccounts.fullname} />
                            )}
                        </div>
                        <div className="w-max-[630px] h-[80px] ml-[15px] mr-[20px]">
                            <Follower />
                        </div>
                        <div className="w-max-[630px] h-[90px] t-0">
                            <EditProfile />
                        </div>
                        <div className="w-max-[630px] h-[80px] t-0">
                            <RowThreadsreposts />
                        </div>
                        <div className="w-max-[630px] flex justify-center h-full t-0 ml-[20px] mr-[20px] flex-col gap-2">
                            {
                                reposts.map((data:any)=>(
                                    <Threadsreporsts user_id={data.user_id} content={data.original_content} postId={data.repost} repostedBy={username} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}