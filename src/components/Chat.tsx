"use client"
import { useState, useEffect, useRef } from 'react'

interface Message {
    id: number
    senderId: number
    content: string
    timestamp: string
}

const Chat = ({ user_id, userId }: { user_id: string, userId?: string }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState('')
    const chatEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch(`/api/messages?userId1=a&userId2=nhanvo`)
            const data = await response.json()
            setMessages(data)
        }
        fetchMessages()

        // Set up real-time updates (e.g., using WebSocket or Server-Sent Events)
        // This is a placeholder for real-time functionality
        const interval = setInterval(fetchMessages, 5000)

        return () => clearInterval(interval)
    }, [user_id])

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim()) return

        const response = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ recipientId: user_id, content: newMessage }),
        })

        if (response.ok) {
            setNewMessage('')
            // Optionally, you can update the messages state here
        }
    }

    return (
        <div className="w-full max-w-2xl flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
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
                            {new Date(message.timestamp).toLocaleString()}
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