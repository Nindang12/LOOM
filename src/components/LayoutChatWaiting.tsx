import { tx,id,init } from "@instantdb/react"
import { getUserId } from "@/utils/auth";
import React, { ReactNode, useEffect, useState } from "react";
import FriendWaiting from "./FriendWaiting";

export default function LayoutChatWaiting({children}:{children: ReactNode}){
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
const [currentUserId, setCurrentUserId] = useState<string | null>(null);
const db = init<Schema>({ appId: APP_ID })

useEffect(() => {
    if(typeof window !== 'undefined'){
        const userId = getUserId();
        setCurrentUserId(userId as string);
    }
}, [])

    return(

        <div className="flex flex-row overflow-y-auto w-full">
            <FriendWaiting db={db} currentUserId={currentUserId as string} /> 
            {children}       
        </div>
    )
}