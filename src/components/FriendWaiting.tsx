'use client'

import Link from 'next/link'
import React from 'react'

interface FriendListProps {
    db: any
    currentUserId: string
}

const FriendWaiting: React.FC<FriendListProps> = ({ db, currentUserId }) => {
    const query = {
        friendships: {
            $: {
                where: {
                    and: [
                        { isFriend: false },
                        { receiverId: currentUserId },
                    ]
                },
            },
        },
    }
    const { isLoading, error, data } = db.useQuery(query)

    if (isLoading) return <div>Đang tải tin nhắn đang chờ...</div>
    if (error) return <div>Lỗi khi tải tin nhắn đang chờ: {error.message}</div>

    return (
        <div className="w-full md:w-1/4 border-r h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <div className='flex gap-5 items-center p-4 border-b bg-white'>
                <Link href='/messages' className='flex items-center cursor-pointer'>
                    <img width={25} src="/assets/arrow-left.svg" alt="Quay lại" />
                </Link>
                <span className='text-2xl font-medium'>Tin nhắn đang chờ</span>
            </div>

            {/* Pending Messages List */}
            <div className="flex-grow bg-white overflow-y-auto">
                {data?.friendships?.length === 0 ? (
                    <div className="text-center p-4 text-gray-500">
                        Không có tin nhắn đang chờ
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-2 p-4">
                        {data?.friendships?.map((friendship: any) => (
                            <div
                                key={friendship.id}
                                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-between"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${friendship.userId}`}
                                        alt="Avatar người gửi"
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                    <div>
                                        <span className="font-medium">{friendship.userId}</span>
                                        <p className="text-sm text-gray-500">Muốn gửi tin nhắn cho bạn</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200">
                                        Chấp nhận
                                    </button>
                                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200">
                                        Từ chối
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FriendWaiting;