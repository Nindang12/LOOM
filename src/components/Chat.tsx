"use client"
import { useState, useEffect, useRef } from 'react'
import { init,tx,id } from '@instantdb/react'

interface Message {
    id: string
    senderId: string
    receiverId: string
    content: string
    createdAt: number
}

const APP_ID = '5e07a141-e7d9-4273-9cba-877a820f73dd'

type Schema = {
    messages: {
        id: string
        senderId: string
        receiverId: string
        content: string
        createdAt: number
    }
}

const db = init<Schema>({ appId: APP_ID })

const Chat = ({ friendId, userId }: { friendId: string, userId?: string }) => {
    const [newMessage, setNewMessage] = useState('')
    const chatEndRef = useRef<HTMLDivElement>(null)

    //console.log(userId)

    const query = {
        messages: {
            $: {
                where: {
                    or: [
                        { and: [{ senderId: userId }, { receiverId: friendId }] },
                        { and: [{ senderId: friendId }, { receiverId: userId }] }
                    ]
                },
            },
        }
    }

    const { isLoading, error, data } = db.useQuery(query)

    //console.log(data)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data])

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        db.transact([
            tx.messages[id()].update({
                senderId: userId,
                receiverId: friendId,
                content: newMessage,
                createdAt: Date.now(),
            }),
        ]);

        setNewMessage('')
    }

    if (isLoading) return <div>Loading...</div>

    return (
        <div className="w-full max-w-2xl flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {Array.isArray(data?.messages) && data?.messages.map((message:any) => (
                    <div
                        key={message.id}
                        className={`mb-4 ${
                            message.senderId === Number(userId) ? 'text-right' : 'text-left'
                        }`}
                    >
                        <div
                            className={`inline-block p-2 rounded-lg ${
                                message.senderId === Number(userId)
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200'
                            }`}
                        >
                            {message.content}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {new Date(message.createdAt).toLocaleString('us')}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded-l-lg p-2"
                        placeholder="Type a message..."
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Chat