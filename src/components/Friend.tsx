import React from "react";
import Link from "next/link";
import Avatar from "./Avatar";
import { db } from "@/utils/contants";


const Friend = ({friendship}: {friendship: any}) => {
    const queryfriendDetails = {
        userDetails: {
            $: {
                where: {
                    userId: friendship.friendId
                }
            }
        }
    }
    const { data: datafriendDetails } = db.useQuery(queryfriendDetails)

    // Query to get the latest message for the friend
    const queryLatestMessage = {
        messages: {
            $: {
                where: {
                    or: [
                        { and: [{ senderId: friendship.userId }, { receiverId: friendship.friendId }] },
                        { and: [{ senderId: friendship.friendId }, { receiverId: friendship.userId }] }
                    ]
                },
                order: {
                    serverCreatedAt: 'desc' as const,
                }
            }
        }
    }
    const { data: dataLatestMessage } = db.useQuery(queryLatestMessage)

    return (
        <Link
            key={friendship.id}
            href={`/messages/chat/${friendship.friendId}`}
            className="p-4 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center"   
        >
            <div className="relative">
                <Avatar userId={friendship.friendId} altText="Friend Avatar" width={40} height={40} style="rounded-full mr-3" />
                {/* <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${friendStatus === 'online' ? 'bg-green-500' : 'bg-gray-500'}`}></span> */}
            </div>
            <div>
                <span>{datafriendDetails?.userDetails[0].fullname}</span>
                <p className="text-sm text-gray-500 font-thin">{dataLatestMessage?.messages[0]?.content || "No messages yet"}</p>
            </div>
        </Link>
    )
}

export default Friend