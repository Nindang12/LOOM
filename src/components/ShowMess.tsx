'use client'

import React, { useState, useEffect } from 'react'
import axios from "axios";

interface ShowMessProps {
    db: any
    currentUserId: string
    isOpen: boolean
    onClose: () => void
}

const ShowMess: React.FC<ShowMessProps> = ({ db, currentUserId, isOpen, onClose }) => {
    const [accountData, setAccountData] = useState<AccountData[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);


    const handleFriendSelection = (friendId: string) => {
        setSelectedFriends(prev => 
            prev.includes(friendId) 
                ? prev.filter(id => id !== friendId) 
                : [...prev, friendId]
        );
    };

    const startChat = () => {
        console.log("Starting chat with:", selectedFriends);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-full max-w-md h-3/4 flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <span className="font-medium text-xl">Tin nhắn mới</span>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                    <div className="flex items-center mb-4">
                        <span className="mr-2">Tới:</span>
                        <input 
                            type="text" 
                            placeholder="Tìm kiếm..." 
                            className="flex-1 p-2 border rounded"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className='flex-grow overflow-y-auto'>
                        {accountData.length > 0 ? (
                            accountData.map((account) => (
                                <div 
                                    key={account.user_id} 
                                    className={`flex items-center p-2 hover:bg-gray-100 cursor-pointer ${selectedFriends.includes(account.user_id) ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleFriendSelection(account.user_id)}
                                >
                                    <img
                                        src={account.image || `https://api.dicebear.com/6.x/initials/svg?seed=${account.username}`}
                                        alt={`${account.fullname}'s avatar`}
                                        className="w-10 h-10 rounded-full mr-3"
                                    />
                                    <div>
                                        <p className="font-medium">{account.fullname}</p>
                                        <p className="text-sm text-gray-500">@{account.username}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Không tìm thấy tài khoản.</p>
                        )}
                    </div>
                </div>
                <div className="p-4 border-t">
                    <button 
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        onClick={startChat}
                        disabled={selectedFriends.length === 0}
                    >
                        Chat
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShowMess;