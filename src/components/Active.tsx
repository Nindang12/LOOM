"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserId } from "@/utils/auth"
import { db } from "@/utils/contants"
import { tx, id } from "@instantdb/react"

export default function Active() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setCurrentUserId(userId as string);
        }
    }, [])

    const query = {
        friendships: {
            $: {
                where: {
                    and: [
                        { isPendingRequest: true },
                        { friendId: currentUserId }
                    ]
                }
            }
        }
    }
    const { data } = db.useQuery(query)
    
    const acceptFriend = async (userId: string, friendId: string,idRequest: string) => {
        if (!userId || !friendId) return;

        try {
            await db.transact([
                tx.friendships[id()].update({
                    userId: friendId,
                    friendId: userId,
                    isFriend: true,
                    isPendingRequest: false,
                    createdAt: Date.now()
                })
            ]);
            await db.transact([
                tx.friendships[idRequest].update({
                    userId: userId,
                    friendId: friendId,
                    isFriend: true, 
                    isPendingRequest: false,
                    createdAt: Date.now()
                })
            ]);
            console.log('Friend request accepted successfully');
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Error accepting friend request. Please try again.');
        }
    };

    return (
        <div className="flex flex-col gap-3">
            {data?.friendships.map((request) => (
                <div key={request.id} className="flex items-center mt-2 ml-5 p-2">
                    <div className="flex flex-row gap-2">
                        <img src="https://placehold.co/40x40" alt="Profile picture of the user" className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col">
                            <span className="font-bold text-sm">{request.userId}</span>
                            <span className="text-sm text-gray-400">started following you. 7w</span>
                        </div>
                    </div>
                    <button onClick={() => acceptFriend(currentUserId as string, request.userId as string,request.id as string)} className="ml-auto bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                        Follow
                    </button>
                </div>
            ))}
        </div>
    )
}