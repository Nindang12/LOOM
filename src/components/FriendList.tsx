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
        <div className="w-96 border-r h-screen flex flex-col z-10">
            {/* Header */}
            <div className='flex justify-between items-center p-4 '>
                <div className='flex items-center'>
                    <h2 className="text-xl font-bold mr-2">{currentUserId}</h2>
                    <img width={12} src="/assets/arrow-down.svg" alt="arrow" />
                </div>
                <img width={25} src="/assets/PencilSimpleLine.svg" alt="penchat" />
            </div>

            {/* Navigation */}
            <div className='flex justify-between '>
                <h2 className="text-base font-bold p-4">Tin nhắn</h2>
                <h2 className="text-base text-gray-300 font-bold p-4">Tin nhắn đang chờ</h2>
            </div>

            {/* Friend List */}
            <div className="flex-grow overflow-y-auto">
                <div className="grid grid-cols-1 gap-2 pl-4 pr-4">
                    {data?.friendships?.map((friendship:any) => (
                        <Link
                            key={friendship.id}
                            href={`/messages/chat/${friendship.friendId}`}
                            className="p-4 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center"   
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
        </div>
    )
}

export default FriendList;