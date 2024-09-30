"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Chat {
    id: number
    otherUserId: number
    otherUserName: string
    lastMessage: string
}

const ChatList = () => {
    const [chats, setChats] = useState<Chat[]>([])

    useEffect(() => {
        const fetchChats = async () => {
            const response = await fetch(`/api/chats?userId1=a&userId2=nhanvo`)
            const data = await response.json();
            console.log(data)
            setChats(data)
        }
        fetchChats()
    }, [])

    return (
        <div className="w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
            <ul>
                {chats.length > 0 && chats.map((chat) => (
                    <li key={chat.id} className="mb-2">
                        <Link href={`/chat/${chat.otherUserId}`}>
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="font-semibold">{chat.otherUserName}</h3>
                                <p className="text-gray-600">{chat.lastMessage}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ChatList