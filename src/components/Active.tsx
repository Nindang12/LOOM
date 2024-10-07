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
    
    const addFriend = async (userId: string, friendId: string) => {
        if (!userId || !friendId) return;

        try {
            db.transact([tx.friendships[id()].update(
                { 
                    userId: userId,
                    friendId: friendId,
                    isFriend: true,
                    isPendingRequest: false,
                    createdAt: Date.now()
                }
            )]);
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend');
        }
    };

    return (
        <div className="flex flex-col">
            {data?.friendships.map((request) => (
                <div key={request.id} className="flex flex-col mt-2 ml-5 cursor-pointer">
                    <div className="flex flex-row gap-2">
                        <Link href={`/@${request.userId}`}>
                            <img className="rounded-full mt-2 z-0 w-8 h-8 bg-cover" src="/assets/logo.png" alt=""></img>           
                        </Link>
                        <div className="flex flex-col">
                            <div className="flex gap-2 items-center">
                                <Link href={`/@${request.userId}`} className="font-bold text-sm">
                                    <span>{request.userId}</span>
                                </Link>
                                <span className="text-sm text-gray-400">wants to add you as a friend</span>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button className="bg-black text-white px-4 py-2 rounded-full text-sm" onClick={() => addFriend(currentUserId as string, request.userId as string)}>Accept</button>
                                <button className="bg-gray-200 text-black px-4 py-2 rounded-full text-sm">Decline</button>
                            </div>
                        </div>
                    </div>
                    <div className="w-[568px] h-[1px] bg-gray-300 ml-[40px] mb-5"></div>
                </div>
            ))}
            {/* Your existing code for other activities */}
        </div>
    )
}