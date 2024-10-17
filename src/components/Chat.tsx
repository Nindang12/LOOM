"use client"
import { useState, useEffect, useRef } from 'react'
import { init, tx, id } from '@instantdb/react'
import Link from 'next/link'
import { db } from "@/utils/contants"
import Avatar from './Avatar'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';


const generateToken = (tokenServerUrl: string, appID: number, userID: string) => {
    // Obtain the token interface provided by the App Server
    return fetch(tokenServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: appID,
        user_id: userID,
      }),
    }).then(async (res) => {
      const result = await res.text();
      return result;
    });
  }

const Chat = ({ friendId, userId }: { friendId: string, userId?: string }) => {
    const [newMessage, setNewMessage] = useState('')
    const chatEndRef = useRef<HTMLDivElement>(null)
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [audio, setAudio] = useState<File | null>(null)
    const [audioPreview, setAudioPreview] = useState<string | null>(null)


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

    const queryfriendDetails = {
        userDetails: {
            $: {
                where: {
                    userId: friendId
                }
            }
        }
    }
    const { data: datafriendDetails } = db.useQuery(queryfriendDetails)

    // Sử dụng InstantDB query để lấy dữ liệu
    const { isLoading, error, data } = db.useQuery(query)

    // Tự động cuộn xuống cuối khi có tin nhắn mới
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [data])

    const callAudioWithFriend = async () => {
        const token = await generateToken(
            'https://preview-uikit-server.zegotech.cn/api/token',
            2013980891,
            userId as string
        );
    
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(0,'f491cf961e89601de0c58a61f5573fd8','',userId as string,userId as string);
        // create instance object from token
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        const targetUser = {
            userID: friendId,
            userName: datafriendDetails?.userDetails[0].fullname // Replace with actual friend's name if available
        };
    
        zp?.sendCallInvitation({
            callees: [targetUser],
            callType: ZegoUIKitPrebuilt.InvitationTypeVoiceCall, // Use InvitationTypeVoiceCall for audio calls
            timeout: 60, // Timeout duration (second). 60s by default, range from [1-600s].
        }).then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
        });
    }

    // Handle image selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setImage(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }

    // Handle audio selection and preview
    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        setAudio(file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setAudioPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setAudioPreview(null)
        }
    }

    // Hàm gửi tin nhắn
    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newMessage.trim() && !image && !audio) return // Ngăn việc gửi tin nhắn rỗng

        // Thêm tin nhắn mới vào cơ sở dữ liệu
        await db.transact([
            tx.messages[id()].update({
                senderId: userId,
                receiverId: friendId,
                content: newMessage,
                imageUrl: imagePreview, // Save image URL if available
                audioUrl: audioPreview, // Save audio URL if available
                createdAt: Date.now(),
            }),
        ])

        // Reset ô nhập tin nhắn, hình ảnh và âm thanh
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
                    <Link href="/messages" className="text-blue-500 mr-3 md:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <Avatar userId={friendId} altText="Friend Avatar" width={40} height={40} style="rounded-full mr-3" />
                    <h2 className="text-xl font-semibold">{datafriendDetails?.userDetails[0].fullname}</h2>
                </div>
                <div className="flex items-center">
                    <button onClick={callAudioWithFriend} className="p-2 rounded-full hover:bg-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-200 ml-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
                {Array.isArray(data?.messages) && data?.messages.map((message: any, index: number) => {
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
                                        {message.content && <div>{message.content}</div>}
                                        {message.imageUrl && (
                                            <img src={message.imageUrl} alt="Uploaded" className="mt-2 max-w-full rounded" />
                                        )}
                                        {message.audioUrl && (
                                            <audio controls className="mt-2">
                                                <source src={message.audioUrl} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
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
                <div className="flex flex-col">
                    {imagePreview && (
                        <div className="mt-2 w-[400px] max-h-[400px]">
                            <img src={imagePreview} alt="Preview" className="rounded h-[300px]" />
                        </div>
                    )}
                    {audioPreview && (
                        <div className="mt-2 w-[200px]">
                            <audio controls className="rounded">
                                <source src={audioPreview} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                    <div className="flex">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-1 border rounded-l-lg p-2 outline-none break-words"
                            placeholder="Type a message..."
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className="bg-gray-200 text-black px-4 py-2 cursor-pointer">
                            Upload
                        </label>
                        <input
                            type="file"
                            accept="audio/*"
                            onChange={handleAudioChange}
                            className="hidden"
                            id="audio-upload"
                        />
                        <label htmlFor="audio-upload" className="bg-gray-200 text-black px-4 py-2 cursor-pointer">
                            Upload Audio
                        </label>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
                        >
                            Send
                        </button>
                    </div>
                    
                </div>
            </form>
        </div>
    )
}

export default Chat