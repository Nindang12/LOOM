'use client'

import Sidebar from "@/components/Sidebar"
import FriendList from "@/components/FriendList"
import AddFriend from "@/components/AddFriend"
import { init } from "@instantdb/react"
import { useState } from "react"
import { getUserId } from "@/utils/auth";
import LayoutChat from "@/components/LayoutChat"

// ID for app: NexuSocial
const APP_ID = '5e07a141-e7d9-4273-9cba-877a820f73dd'

type Schema = {
    messages: {
        id: string
        senderId: string
        receiverId: string
        content: string
        createdAt: number
    }
    friendships: {
        id: string
        userId: string
        friendId: string
        createdAt: number
    }
    users: {
        id: string
        username: string
    }
}

const db = init<Schema>({ appId: APP_ID })

const Messages = () => {
    const [showAddFriend, setShowAddFriend] = useState(false)

    const currentUserId = getUserId() as string;

    const handleFriendAdded = () => {
        setShowAddFriend(false)
    }

    const query = {
        friendships: {
            $: {
                where: {
                    friendId: currentUserId,
                    isPendingRequest: true,
                },
            },
        },
    }

    const { isLoading, error, data } = db.useQuery(query)

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading friend requests: {error.message}</div>


    return (
        <div className="flex md:flex-row flex-col-reverse w-full h-screen">
            <Sidebar />
            <div className="flex flex-col w-full h-full">
                <div className="md:hidden">
                    <h2 className="text-xl font-bold p-4 border-b">Tin nhắn</h2>
                    <FriendList db={db} currentUserId={currentUserId} />    
                </div>
                <div className="flex-grow hidden md:block h-full">
                    <LayoutChat>
                        <div className="flex items-center justify-center w-full">
                            <div className="text-center max-w-md mx-auto">
                                <div className="flex justify-center items-center mb-8">
                                    <div className="border-2 border-black flex flex-col justify-center items-center rounded-full p-6">
                                        <img width={80} src="/assets/messenger.svg" alt="messenger" />
                                    </div>
                                </div>
                                <h1 className="text-2xl font-semibold mb-4">Tin nhắn của bạn</h1>
                                <p className="text-gray-600 mb-6">Gửi ảnh và tin nhắn riêng tư cho bạn bè hoặc nhóm</p>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-lg transition duration-300">Gửi tin nhắn</button>
                            </div>
                        </div>
                    </LayoutChat>
                </div>
            </div>
        </div>
    )
}

export default Messages