"use client"

import Sidebar from "@/components/Sidebar"
import Chat from "@/components/Chat"
import { usePathname } from "next/navigation"
import { getUserId } from "@/utils/auth"
const ChatPage = () => {
    const pathName = usePathname();
    const friendId = pathName.replace("/messages/chat/","")
    const currentUserId = getUserId() as string;
    return (
        <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Sidebar />
            <div className="flex flex-row justify-center mt-2 w-full">
                <Chat friendId={friendId} userId={currentUserId} />
            </div>
        </div>
    )
}

export default ChatPage