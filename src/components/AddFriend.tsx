'use client'

import { useEffect, useState } from 'react'
import { tx, id } from '@instantdb/react'
import { NextPage } from 'next'

interface AddFriendProps {
    currentUserId: string
    db: any
    onFriendAdded: () => void
}

const AddFriend: NextPage<AddFriendProps> = ({ currentUserId, db, onFriendAdded }) => {
    const [friendUsername, setFriendUsername] = useState('');
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    
    const query = { users: {} }
    const { isLoading: queryLoading, error: queryError, data: queryData } = db.useQuery(query)

    useEffect(() => {
        setIsLoading(queryLoading)
        if (queryLoading || queryError) {
            setError(queryError)
            return;
        }
    
        if (queryData) {
            console.log("queryData", queryData)
            setData(queryData)
        }
    }, [queryLoading, queryError, queryData])

    const addFriend = async () => {
        if (!data || !data.users || data.users.length === 0) {
            return null
        }

        const existingUser = data.users.filter((user: any) => user.userId === friendUsername)
        if (existingUser.length > 0) {
            //console.log("existingUser", existingUser)
            const friendId = existingUser[0].userId
            try {
                await db.transact(
                    tx.friendships[id()].update({
                        userId: currentUserId,
                        friendId: friendId,
                        createdAt: Date.now(),
                        isFriend: false,
                        isPendingRequest: true,
                    })
                )
                onFriendAdded()
            } catch (error) {
                console.error("Error adding friend:", error)
                alert("Error adding friend")
            }
        }
    }

    return (
        <div className="p-4 border-b">
            <input
                type="text"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter friend's username"
            />
            <button
                onClick={addFriend}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                disabled={isLoading}
            >
                Add Friend
            </button>
            {error && <p className="text-red-500">Error querying the database</p>}
        </div>
    )
}

export default AddFriend