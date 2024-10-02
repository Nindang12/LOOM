import FriendList from "./FriendList";
import { tx,id,init } from "@instantdb/react"
import { getUserId } from "@/utils/auth";
import React, { ReactNode } from "react";

export default function LayoutChat({children}:{children: ReactNode}){
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
const currentUserId = getUserId() as string;
const db = init<Schema>({ appId: APP_ID })
    return(

        <div className="flex flex-row overflow-y-auto w-full">
            <FriendList db={db} currentUserId={currentUserId} /> 
            {children}       
        </div>
    )
}