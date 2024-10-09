'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { db } from "@/utils/contants";
import Avatar from './Avatar';
import Friend from './Friend';

const FriendList = ({currentUserId }: {currentUserId: string}) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isShowMessage, setisShowMessage] = useState<boolean>(false);
    const [accountData, setAccountData] = useState<AccountData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    const searchFriend = async (user_id: string) => {
        if (user_id === "") {
            setAccountData([]);
        } else {
            if (user_id.length > 0) {
                try {
                    const response = await axios.get(`/api/account?userId=${user_id}`);
                    if (!response) {
                        return null;
                    }
                    const accountData = await response.data;
                    setAccountData(accountData);
                } catch (error) {
                    console.error('Failed to fetch account:', error);
                }
            }
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchTerm) {
                searchFriend(searchTerm);
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm]);

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


    const queryUserDetails = {
        userDetails: {
            $: {
                where: {
                    userId: currentUserId
                }
            }
        }
    }

    const { data: dataUserDetails } = db.useQuery(queryUserDetails)

    if (isLoading) return <div>Loading friends...</div>
    if (error) return <div>Error loading friends: {error.message}</div>


    return (
        <div className="w-full md:w-[397px] border-r h-screen flex flex-col">
            {/* Header */}
            <div className='flex justify-between items-center p-4 border-b'>
                <div onClick={() => setIsShow(prev => !prev)} className='flex items-center cursor-pointer'>
                    <h2 className="text-xl font-bold mr-2">{dataUserDetails?.userDetails[0].fullname}</h2>
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
                <div className="grid grid-cols-1 gap-2 p-4">
                    {data?.friendships?.map((friendship: any) => (
                        <Friend key={friendship.id} friendship={friendship} />
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
                <div></div>
            )}
        </div>
    )
}

export default FriendList;