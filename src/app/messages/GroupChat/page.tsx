'use client';

import Sidebar from "@/components/Sidebar";
import FriendList from "@/components/FriendList";
import { useEffect, useState } from "react";
import { checkLogin, getUserId } from "@/utils/auth";
import LayoutChat from "@/components/LayoutChat";
import { useRouter, usePathname } from "next/navigation";
import GroupChat from "@/components/GroupChat";
import GroupList from "@/components/GroupList";
import axios from "axios";

const GroupChatPage = () => {
    const router = useRouter();
    const pathName = usePathname();
    const groupId = pathName?.replace("/messages/GroupChat/", "");
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [groupData, setGroupData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verify login and get user ID
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userId = getUserId();
            setCurrentUserId(userId);
        }
    }, []);

    // Fetch group data
    useEffect(() => {
        const fetchGroupData = async () => {
            if (groupId) {
                try {
                    const response = await axios.post("https://your-instantdb-url.com/api/v1/query", {
                        query: {
                            groups: {
                                $: {
                                    where: { id: groupId },
                                    include: {
                                        members: true,
                                        messages: { orderBy: { createdAt: 'asc' } },
                                    },
                                },
                            },
                        },
                    });
                    setGroupData(response.data.groups[0]);
                } catch (error) {
                    console.error("Error fetching group data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchGroupData();
    }, [groupId]);

    if (isLoading || !groupId || !currentUserId) {
        return (
            <div className="flex md:flex-row flex-col-reverse w-full h-screen">
                <Sidebar />
                <div className="flex flex-col w-full h-full">
                    <div className="md:hidden">
                        <h2 className="text-xl font-bold p-4 border-b">Tin nhắn</h2>
                        <GroupList currentUserId={currentUserId || ""} />
                    </div>
                    <div className="flex-grow hidden md:block h-full">
                        <LayoutChat>
                            <div className="flex items-center justify-center w-full">
                                <div>Loading...</div>
                            </div>
                        </LayoutChat>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="hidden md:block">
                <div className="flex md:flex-row flex-col-reverse overflow-hidden w-full h-screen">
                    <Sidebar />
                    <div className="flex flex-col w-full h-full overflow-hidden">
                        <LayoutChat>
                            <div className="flex items-center justify-center w-full">
                                <div className="flex-grow h-full overflow-y-auto">
                                    <GroupChat
                                        groupId={groupId}
                                        userId={currentUserId}
                                    />
                                </div>
                            </div>
                        </LayoutChat>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupChatPage;
