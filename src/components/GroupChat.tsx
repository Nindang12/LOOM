"use client"
import { useState, useEffect, useRef } from 'react'
import { init, tx, id } from '@instantdb/react'
import Link from 'next/link'
import { db } from "@/utils/contants"
import Avatar from './Avatar'

const GroupChat = ({ groupId, userId }: { groupId: string; userId: string }) => {
    const [newMessage, setNewMessage] = useState('')
    const chatEndRef = useRef<HTMLDivElement>(null)
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [audio, setAudio] = useState<File | null>(null)
    const [audioPreview, setAudioPreview] = useState<string | null>(null)

    // Truy vấn tin nhắn của group
    const query = {
        messages: {
            $: {
                where: { groupId },
            },
        },
    }

    // Truy vấn thông tin nhóm
    const queryGroupDetails = {
        groups: {
            $: { where: { id: groupId } },
        },
    }

    const { data: groupDetails } = db.useQuery(queryGroupDetails)
    const { isLoading, error, data } = db.useQuery(query)

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data])

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setImage(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setImagePreview(reader.result as string)
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setAudio(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => setAudioPreview(reader.result as string)
            reader.readAsDataURL(file)
        } else {
            setAudioPreview(null)
        }
    }

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newMessage.trim() && !image && !audio) return

        await db.transact([
            tx.messages[id()].update({
                groupId,
                senderId: userId,
                content: newMessage,
                imageUrl: imagePreview,
                audioUrl: audioPreview,
                createdAt: Date.now(),
            }),
        ])

        setNewMessage('')
        setImage(null)
        setImagePreview(null)
        setAudio(null)
        setAudioPreview(null)
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>Error loading chat</div>

    return (
        <div className="w-full h-full flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
                <div className="flex items-center">
                    <Link href="/groups" className="text-blue-500 mr-3 md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-xl font-semibold">{groupDetails?.groups[0]?.name}</h2>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {Array.isArray(data?.messages) && data.messages.map((message: any, index: number) => {
                    const messageTime = new Date(message.createdAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    })

                    return (
                        <div key={message.id} className={`mb-4 flex ${message.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                            <div className="flex items-start gap-2">
                                <Avatar userId={message.senderId} altText="Sender Avatar" width={30} height={30} style="rounded-full" />
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-500">{message.senderId}</div>
                                    <div
                                        className={`p-3 rounded-lg max-w-xs ${
                                            message.senderId === userId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                                        }`}
                                    >
                                        {message.content && <div>{message.content}</div>}
                                        {message.imageUrl && <img src={message.imageUrl} alt="Uploaded" className="mt-2 rounded" />}
                                        {message.audioUrl && (
                                            <audio controls className="mt-2">
                                                <source src={message.audioUrl} type="audio/mpeg" />
                                            </audio>
                                        )}
                                        <div className="text-xs mt-1 text-right">{messageTime}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                    {imagePreview && <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded" />}
                    {audioPreview && (
                        <audio controls className="w-24">
                            <source src={audioPreview} type="audio/mpeg" />
                        </audio>
                    )}

                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 border rounded-lg p-2"
                        placeholder="Type a message..."
                    />

                    <label htmlFor="image-upload" className="cursor-pointer p-2 bg-gray-200 rounded">
                        <img src="/assets/image.svg" alt="Upload Image" width={20} />
                    </label>
                    <label htmlFor="audio-upload" className="cursor-pointer p-2 bg-gray-200 rounded">
                        <img src="/assets/audio.svg" alt="Upload Audio" width={20} />
                    </label>

                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Send
                    </button>

                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                    <input type="file" accept="audio/*" onChange={handleAudioChange} className="hidden" id="audio-upload" />
                </div>
            </form>
        </div>
    )
}

export default GroupChat
