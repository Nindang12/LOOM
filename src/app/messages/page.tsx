'use client'

import Sidebar from "@/components/Sidebar"
import FriendList from "@/components/FriendList"
import AddFriend from "@/components/AddFriend"
import { init } from "@instantdb/react"
import { useState, useEffect } from "react"
import { getUserId, checkLogin } from "@/utils/auth";
import { tx,id } from "@instantdb/react"
import { useRouter } from 'next/navigation';

// ID for app: NexuSocial
const APP_ID = '5e07a141-e7d9-4273-9cba-877a820f73dd'

type Schema = {
    messages: {
        id: string
        senderId: string
        receiverId: string
        content: string
        createdAt: number
    }
    friendships: {
        id: string
        userId: string
        friendId: string
        createdAt: number
    }
    users: {
        id: string
        username: string
    }
}

const db = init<Schema>({ appId: APP_ID })

const Messages = () => {
    const [showAddFriend, setShowAddFriend] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()

    const currentUserId = getUserId() as string;

    useEffect(() => {
        const verifyLogin = async () => {
            const loggedIn = await checkLogin();
            setIsLoggedIn(loggedIn);
            setIsLoading(false);
            if (!loggedIn) {
                router.push('/login');
            }
        };
        verifyLogin();
    }, [router]);

    const handleFriendAdded = () => {
        setShowAddFriend(false)
    }

    const query = {
        friendships: {
            $: {
                where: {
                    friendId: currentUserId,
                    isPendingRequest: true,
                },
            },
        },
    }

    const { isLoading: isQueryLoading, error, data } = db.useQuery(query)

    if (isLoading) return <div>Loading...</div>
    if (!isLoggedIn) return null; // This will prevent the component from rendering while redirecting

    if (isQueryLoading) return <div>Loading friend requests...</div>
    if (error) return <div>Error loading friend requests: {error.message}</div>

    const handleAcceptFriend = async (friendshipId: string, friendId: string) => {
        try {
            await db.transact(
                tx.friendships[friendshipId].update({
                    isFriend: true,
                    isPendingRequest: false,
                })
            )

            await db.transact(
                tx.friendships[id()].update({
                    userId: currentUserId,
                    friendId: friendId,
                    createdAt: Date.now(),
                    isFriend: true,
                    isPendingRequest: false,
                })
            )

        } catch (error) {
            console.error("Error accepting friend request:", error)
            alert("Error accepting friend request")
        }
    }

    return (
        <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Sidebar />
            <div className="flex flex-col w-full">
            {data?.friendships?.map((friendship: any) => (
                <div key={friendship.id} className="p-4 border-b">
                    <span>{friendship.userId} wants to be your friend</span>
                    <button
                        onClick={() => handleAcceptFriend(friendship.id, friendship.userId)}
                        className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Accept
                    </button>
                </div>
            ))}
                <button
                    onClick={() => setShowAddFriend(!showAddFriend)}
                    className="m-2 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    {showAddFriend ? 'Cancel' : 'Add Friend'}
                </button>
                {showAddFriend && (
                    <AddFriend
                        currentUserId={currentUserId}
                        db={db}
                        onFriendAdded={handleFriendAdded}
                    />
                )}
                <div className="flex flex-row justify-center mt-2 w-full">
                    <FriendList db={db} currentUserId={currentUserId} />
                    {/* <ChatMessages currentUserId={currentUserId} friendId={selectedFriendId} db={db} /> */}
                </div>
            </div>
        </div>
    )
}

export default Messages