"use client"
import { useState, useEffect, useRef } from 'react'
import { init, tx, id } from '@instantdb/react'

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
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Cấu hình truy vấn để lấy tin nhắn giữa user và friend
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

    // Sử dụng InstantDB query để lấy dữ liệu
    const { isLoading, error, data } = db.useQuery(query)

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data])

    // Hàm gửi tin nhắn
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newMessage.trim()) return // Ngăn việc gửi tin nhắn rỗng

        // Thêm tin nhắn mới vào cơ sở dữ liệu
        await db.transact([
            tx.messages[id()].update({
                senderId: userId,
                receiverId: friendId,
                content: newMessage,
                createdAt: Date.now(),
            }),
        ])

        // Reset ô nhập tin nhắn
        setNewMessage('')
    }

    // Hàm xử lý khi nhấp vào một tin nhắn
    const handleSelectMessage = (messageId: string) => {
        setSelectedMessageId(prev => (prev === messageId ? null : messageId)) // Bật/tắt hiển thị ngày tháng
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading chat</div>

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex items-center p-4 bg-gray-100 border-b">
                <img
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${friendId}`}
                    alt="Friend Avatar"
                    className="w-10 h-10 rounded-full mr-3"
                />
                <h2 className="text-xl font-semibold">{friendId}</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {Array.isArray(data?.messages) && data?.messages.map((message: Message, index: number) => {
                    const currentMessageTime = new Date(message.createdAt);
                    const previousMessage = index > 0 ? data.messages[index - 1] : null;
                    const previousMessageTime = previousMessage ? new Date(previousMessage.createdAt) : null;
                    const timeDifference = previousMessageTime ? (currentMessageTime.getTime() - previousMessageTime.getTime()) / (1000 * 60) : Infinity;

                    const showTimestamp = !previousMessage || timeDifference > 10;

                    return (
                        <div key={message.id}>
                            {showTimestamp && (
                                <div className="text-xs w-full flex justify-center text-gray-500 mb-1">
                                    {currentMessageTime.toLocaleString('en-US')}
                                </div>
                            )}
                            <div
                                className={`mb-4 flex ${
                                    message.senderId === userId ? 'justify-end' : 'justify-start'
                                }`}
                            >
                                <div className={`flex flex-col ${message.senderId === userId ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`inline-block p-3 rounded-lg max-w-xs ${
                                            message.senderId === userId
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-black'
                                        }`}
                                    >
                                        <div>{message.content}</div>
                                        <div className="text-xs mt-1 text-right">
                                            {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={chatEndRef} />
            </div>

            {/* Form để gửi tin nhắn */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                <div className="flex">
                    <input
                        
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded-l-lg p-2 outline-none"
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
