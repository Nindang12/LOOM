'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import axios from "axios";
import { db } from "@/utils/contants";
import Avatar from './Avatar';
import Friend from './Friend';
import GroupCreationModal from './GroupCreationModal';
const FriendList = ({currentUserId }: {currentUserId: string}) => {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isShowOptionChat, setisShowOptionChat] = useState<boolean>(false);
    const [isGroupCreationModalOpen, setIsGroupCreationModalOpen] = useState<boolean>(false);
    const createNewGroup = async (groupName: string, selectedFriends: string[]) => {
        try {
            const response = await axios.post('/api/groups', {
                name: groupName,
                members: selectedFriends
            });
            console.log('Group created successfully:', response.data);
        } catch (error) {
            console.error('Error creating group:', error);
        }
    };

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
                <img onClick={() => setisShowOptionChat(prev => !prev)} width={25} src="/assets/PencilSimpleLine.svg" alt="optionchat" className="cursor-pointer" />
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
            {isShowOptionChat && (
                <div className="absolute left-[220px] mt-12 w-48 bg-white border rounded-md shadow-lg z-10">
                    <div className="py-1">
                        <button
                            className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                                setisShowOptionChat(false);
                                setIsGroupCreationModalOpen(true);
                            }}
                        >
                            Tạo nhóm mới
                            <img width={15} className='ml-2' src="/assets/addgroub.svg" alt="addgroub" />
                        </button>
                    </div>
                </div>
            )}
            {isGroupCreationModalOpen && (
                <GroupCreationModal
                    currentUserId={currentUserId}
                    onClose={() => setIsGroupCreationModalOpen(false)}
                    onCreateGroup={(groupName, selectedFriends) => {
                        createNewGroup(groupName, selectedFriends);
                        setIsGroupCreationModalOpen(false);
                    }}
                />
            )}
        </div>
    )
}

export default FriendList;  