'use client'

import Sidebar from "@/components/Sidebar"
import { init } from "@instantdb/react"
import { useEffect, useState } from "react"
import { checkLogin, getUserId } from "@/utils/auth";
import { useRouter } from "next/navigation"
import FriendWaiting from "@/components/FriendWaiting"
import LayoutChatWaiting from "@/components/LayoutChatWaiting"

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

const Requests = () => {
    const router = useRouter()
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    
    useEffect(() => {
        const verifyLogin = async () => {
            const loggedIn = await checkLogin();
            if (!loggedIn) {
                router.push('/login');
            }
        };
        verifyLogin();
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setCurrentUserId(userId as string);
        }
    }, [router]);

    return (
        <div className="flex md:flex-row flex-col-reverse w-full h-screen">
            <Sidebar />
            <div className="flex flex-col w-full h-full">
                <div className="md:hidden">
                    <h2 className="text-xl font-bold p-4 border-b">Tin nhắn</h2>
                    <FriendWaiting db={db} currentUserId={currentUserId as string} />    
                </div>
                <div className="flex-grow hidden md:block h-full">
                    <LayoutChatWaiting>
                        <div className="flex items-center justify-center w-full">
                            <div className="text-center max-w-md mx-auto">
                                <div className="flex justify-center items-center mb-8">
                                    <div className="border-2 border-black flex flex-col justify-center items-center rounded-full p-6">
                                        <svg aria-label="" className="x1lliihq x1n2onr6 x5n08af" fill="currentColor" height="48" role="img" viewBox="0 0 24 24" width="48"><title></title><path d="M15.507 12.752a4.5 4.5 0 1 0-4.501-4.5 4.505 4.505 0 0 0 4.5 4.5Zm0-7a2.5 2.5 0 1 1-2.501 2.5 2.502 2.502 0 0 1 2.5-2.5Zm2.444 8.252h-4.907a5.054 5.054 0 0 0-5.049 5.049v.447a1 1 0 0 0 2 0v-.447a3.053 3.053 0 0 1 3.049-3.05h4.907a3.053 3.053 0 0 1 3.05 3.05v.447a1 1 0 0 0 2 0v-.447a5.055 5.055 0 0 0-5.05-5.05Zm-8.286-2.392a.88.88 0 0 0 0-1.224c-.009-.008-.012-.02-.02-.03L6.685 7.4a.907.907 0 0 0-1.283 1.284l1.41 1.409h-4.81a.907.907 0 1 0 0 1.814h4.81l-1.41 1.41a.907.907 0 0 0 1.284 1.284l2.959-2.96c.008-.008.011-.02.02-.03Z"></path></svg>
                                    </div>
                                </div>
                                <h1 className="text-2xl font-semibold mb-4">Tin nhắn đang chờ</h1>
                                <p className="text-gray-600 mb-6">Đây là tin nhắn của những người bạn đã hạn chế hoặc không theo dõi. Chỉ khi nào được bạn cho phép nhắn tin thì họ mới biết là bạn đã xem tin nhắn đang chờ.</p>
                            </div>
                        </div>
                    </LayoutChatWaiting>
                </div>
            </div>
        </div>
    )
}

export default Requests