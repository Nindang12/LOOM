"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { getUserId } from "@/utils/auth";
import { db } from "@/utils/contants";
import { tx, id } from "@instantdb/react";

export default function Suggest({data}:{data: any}){
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [isFriendAdded, setIsFriendAdded] = useState(false);


    const queryIsFollowing = {
        friendships: {
            $: {
                where: {
                    userId: userId,
                    isFollowing: true,
                    friendId: data.userId
                }
            }
        }
    }
    const { data: dataIsFollowing } = db.useQuery(queryIsFollowing)

    const queryFollowedOfUser = {
        friendships: {
            $: {
                where: {
                    userId: data.userId,
                    isFollowing: true,
                }
            }
        }
    }
    const { data: dataFollowedOfUser } = db.useQuery(queryFollowedOfUser)
    //console.log(dataFollowedOfUser)

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserId(userId as string);
        }
    }, [])


    const toggleFollow = () => {
        if (!userId) {
            console.error('User ID not found in session storage');
            return;
        }
        setIsFollowing(!isFollowing);
        addFriend(userId, data.userId)
    };

    const addFriend = async (userId: string, friendId: string) => {
        if (!userId || !friendId || isFriendAdded) return;

        try {
            db.transact([tx.friendships[id()].update(
                {
                    userId: userId,
                    friendId: friendId,
                    isFriend: false,
                    isPendingRequest: true,
                    isFollowing: true,
                    createdAt: Date.now()
                }
            )]);
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend');
        }
    };

    return(
        <div className="ml-5 cursor-pointer">
            <div className="">
                {/* header */}
                <div className="flex flex-row justify-between items-center ">
                    <div className="flex flex-row gap-2 items-center ">
                        {
                            data.avatar ? (
                                <div>
                                    <img className=" rounded-full z-0 w-8 h-8 bg-cover" src={data.avatar} alt=""></img>           
                                </div>
                            ) : (
                                <div>
                                    <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="/assets/avt.png" alt=""></img>           
                                </div>
                            )
                        } 
                        <div className="flex flex-col ">
                            <Link href={`/@${data.userId}`} className="font-semibold hover:underline text-sm">
                                <span className="">{data.userId}</span>
                            </Link>
                            <div className="text-sm text-gray-400">
                                <p>{data.fullname}</p>
                            </div>
                        </div>
                    </div>
                    {
                        userId === data.userId &&!dataIsFollowing?.friendships?.length ? null : (
                            <button disabled={isFollowing || !dataIsFollowing?.friendships?.length} onClick={toggleFollow} className="flex mr-5 items-center justify-center w-auto h-[35px] border border-gray-400 rounded-xl">
                                <span className={`text-base p-5 font-medium ${isFollowing || dataIsFollowing?.friendships?.length ? 'text-gray-400' : 'text-black'}`}>{isFollowing || dataIsFollowing?.friendships?.length ? 'Đang theo dõi' : 'Theo dõi'}</span>
                            </button>
                        )
                    }
                </div>
                
                {/* body */}
                <div>
                    <p className="text-sm font-normal px-[40px] py-2">{dataFollowedOfUser?.friendships?.length} người theo dõi</p>
                </div>
                <div className="w-full h-[1px] bg-gray-300 mb-5"></div>
            </div>

        </div>
    )
}