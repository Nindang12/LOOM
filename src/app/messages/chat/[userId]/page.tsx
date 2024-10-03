"use client"

import Sidebar from "@/components/Sidebar"
import Chat from "@/components/Chat"
import { usePathname } from "next/navigation"
import { getUserId } from "@/utils/auth"
import LayoutChat from "@/components/LayoutChat"
import Link from "next/link"

const ChatPage = () => {
    const pathName = usePathname();
    const friendId = pathName.replace("/messages/chat/", "")
    const currentUserId = getUserId() as string;

    return (
        <div>
            <div className="md:block">
                <div className="flex md:flex-row flex-col-reverse overflow-hidden w-full h-screen">       
                        <Sidebar />
                    <div className="flex flex-col w-full md:w-3/4 lg:w-4/5 h-full overflow-hidden">
                        <LayoutChat>
                            <div className="flex items-center justify-center w-full">
                                <div className="flex-grow h-full overflow-y-auto">
                                    <Chat 
                                        friendId={friendId} 
                                        userId={currentUserId} 
                                    />
                                </div>
                            </div>
                        </LayoutChat>
                    </div>
                </div> 
            </div>
            <div className="md:hidden">
                <div className="flex flex-col h-screen">
                    <div className="flex items-center justify-between p-4 border-b">
                        <Link href="/messages" className="text-blue-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        <h1 className="text-xl font-semibold">Chat</h1>
                        <div className="w-6"></div> {/* Placeholder for balance */}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <Chat 
                            friendId={friendId} 
                            userId={currentUserId} 
                        />
                    </div>
                    <div className="md:hidden">
                        <Sidebar />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatPage
{/* */}