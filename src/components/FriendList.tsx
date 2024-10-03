'use client'

import Link from 'next/link'
import React from 'react'

interface FriendListProps {
    db: any
    currentUserId: string
}

const FriendList: React.FC<FriendListProps> = ({ db, currentUserId }) => {
    const query = {
        friendships: {
            $: {
                where: {
                    and: [
                        { isFriend: true },
                        { userId: currentUserId },
                    ]
                },
            },
        },
    }
    const { isLoading, error, data } = db.useQuery(query)
    //console.log("friendships", data)

    if (isLoading) return <div>Loading friends...</div>
    if (error) return <div>Error loading friends: {error.message}</div>

    return (
        <div className="w-96 border-r h-screen justify-start flex flex-col">
            <h2 className="text-xl font-bold p-4 border-b">Tin nhắn</h2>
            <div className="grid grid-cols-1 gap-2 p-4">
                {data?.friendships?.map((friendship:any) => (
                    <Link
                        key={friendship.id}
                        href={`/messages/chat/${friendship.friendId}`}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100 flex items-center"   
                    >
                        <img
                            src={`https://api.dicebear.com/6.x/initials/svg?seed=${friendship.friendId}`}
                            alt="Friend Avatar"
                            className="w-10 h-10 rounded-full mr-3"
                        />
                        <span>{friendship.friendId}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default FriendList;