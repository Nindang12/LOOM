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
    console.log("friendships", data)

    if (isLoading) return <div>Loading friends...</div>
    if (error) return <div>Error loading friends: {error.message}</div>


    return (
        <div className="w-1/3 border-r overflow-y-auto">
            <h2 className="text-xl font-bold p-4 border-b">Friends</h2>
            {data?.friendships?.map((friendship:any) => (
                <Link
                    key={friendship.id}
                    href={`/messages/chat/${friendship.friendId}`}
                    className="p-4 border-b cursor-pointer hover:bg-gray-100"   
                >
                    {friendship.friendId}
                </Link>
            ))}
        </div>
    )
}

export default FriendList;