"use client";
import { db } from "@/utils/contants";
import Link from "next/link";
import Avatar from "./Avatar";
import React, { useState } from 'react';
import GroupCreationModal from './GroupCreationModal';
import axios from "axios";

interface GroupListProps {
    currentUserId: string;
}

const GroupList: React.FC<GroupListProps> = ({ currentUserId }) => {
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

    const query = {
        groups: {
            $: {
                where: {
                    members: {
                        $contains: currentUserId
                    }
                }
            }
        }
    }

    const { data: groupsData } = db.useQuery(query);

    return (
        <div className="w-full md:w-[397px] border-r h-screen flex flex-col">
            <div className='flex justify-between items-center p-4 border-b'>
                <h2 className="text-xl font-bold">Nhóm chat</h2>
                <img 
                    onClick={() => setisShowOptionChat(prev => !prev)} 
                    width={25} 
                    src="/assets/PencilSimpleLine.svg" 
                    alt="optionchat" 
                    className="cursor-pointer" 
                />
            </div>

            <div className="flex-grow overflow-y-auto">
                {groupsData?.groups?.map((group: any) => (
                    <Link
                        key={group.id}
                        href={`/messages/GroupChat?groupId=${group.id}`}
                        className="flex items-center p-4 hover:bg-gray-100"
                    >
                        <Avatar userId={group.adminId} altText="Group Avatar" width={40} height={40} />
                        <span className="ml-3 text-lg">{group.name}</span>
                    </Link>
                ))}
            </div>

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
    );
};

export default GroupList;
