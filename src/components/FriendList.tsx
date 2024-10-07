'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import ShowMess from './ShowMess';

interface FriendListProps {
    db: any
    currentUserId: string
}

const FriendList: React.FC<FriendListProps> = ({ db, currentUserId }) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isShowMessage, setisShowMessage] = useState<boolean>(false);

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

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
    const getTimeSinceLastOnline = (lastOnlineTimestamp: number): string => {
        const now = Date.now();
        const diffInSeconds = Math.floor((now - lastOnlineTimestamp) / 1000);
        
        if (diffInSeconds < 60) {
            return `${diffInSeconds}s ago`;
        } else if (diffInSeconds < 3600) {
            return `${Math.floor(diffInSeconds / 60)}m ago`;
        } else if (diffInSeconds < 86400) {
            return `${Math.floor(diffInSeconds / 3600)}h ago`;
        } else {
            return `${Math.floor(diffInSeconds / 86400)}d ago`;
        }
    };
    if (isLoading) return <div>Loading friends...</div>
    if (error) return <div>Error loading friends: {error.message}</div>

    return (
        <div className="w-full md:w-[397px] border-r h-screen flex flex-col">
            {/* Header */}
            <div className='flex justify-between items-center p-4 border-b'>
                <div onClick={() => setIsShow(prev => !prev)} className='flex items-center cursor-pointer'>
                    <h2 className="text-xl font-bold mr-2">{currentUserId}</h2>
                    <img width={12} src="/assets/arrow-down.svg" alt="arrow" />
                </div>
                <img onClick={() => setisShowMessage(prev => !prev)} width={25} src="/assets/PencilSimpleLine.svg" alt="penchat" className="cursor-pointer" />
            </div>

            {/* Navigation */}
            <div className='flex justify-between border-b'>
                <h2 className="text-base font-bold p-4">Tin nhắn</h2>
                <Link href={'/requests'}><h2 className="text-base text-gray-300 font-bold p-4 cursor-pointer hover:bg-gray-100">Tin nhắn đang chờ</h2></Link>
            </div>

            {/* Friend List */}
            <div className="flex-grow overflow-y-auto">
                <div className="flex flex-col">
                    {data?.friendships?.map((friendship: any) => (
                        <Link
                            key={friendship.id}
                            href={`/messages/chat/${friendship.friendId}`}
                            className="p-4 hover:bg-gray-100 flex items-center border-b"   
                        >
                            <img
                                src={`https://api.dicebear.com/6.x/initials/svg?seed=${friendship.friendId}`}
                                alt="Friend Avatar"
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold">{friendship.friendId}</span>
                                    <span className="text-xs text-gray-500">
                                        {friendship.isOnline ? (
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full">Online</span>
                                        ) : (
                                            friendship.lastOnline ? getTimeSinceLastOnline(friendship.lastOnline) : 'Offline'
                                        )}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 truncate mt-1">
                                    {friendship.lastMessage ? friendship.lastMessage.content : 'No messages yet'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            
            {isShow && (
                <div onClick={toggleModal} className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-45 z-50">
                    <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                        <div className='mb-4'>
                            <div className="flex justify-between items-center p-4 border-b">
                                <div></div>
                                <span className="font-medium text-xl">Chuyển tài khoản</span>
                                <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex items-center justify-between mb-6 p-3 rounded-lg">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                    <span className="ml-4 font-medium">{currentUserId}</span>
                                </div>
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <Link href="/login" className="text-blue-500 hover:text-blue-600 font-medium">Đăng nhập vào tài khoản hiện có</Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isShowMessage && (
                <ShowMess
                    db={db}
                    currentUserId={currentUserId}
                    isOpen={isShowMessage}
                    onClose={() => setisShowMessage(false)}
                />
            )}
        </div>
    )
}

export default FriendList;