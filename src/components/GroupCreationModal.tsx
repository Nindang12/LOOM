import React, { useState } from 'react';
import { db } from "@/utils/contants";

interface GroupCreationModalProps {
    currentUserId: string;
    onClose: () => void;
    onCreateGroup: (groupName: string, selectedFriends: string[]) => void;
}

const GroupCreationModal = ({ currentUserId, onClose, onCreateGroup }: GroupCreationModalProps) => {
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState<string[]>([]);

    // Query to get user's friends
    const query = {
        friendships: {
            $: {
                where: {
                    and: [
                        { isFriend: true },
                        { userId: currentUserId },
                    ]
                },
            },
        },
    }
    const { data: friendsData } = db.useQuery(query);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (groupName.trim() && selectedFriends.length > 0) {
            onCreateGroup(groupName, [...selectedFriends, currentUserId]);
        }
    };

    const toggleFriendSelection = (friendId: string) => {
        setSelectedFriends(prev => 
            prev.includes(friendId) 
                ? prev.filter(id => id !== friendId)
                : [...prev, friendId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Tạo nhóm mới</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Tên nhóm"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                    />

                    <div className="max-h-60 overflow-y-auto mb-4">
                        <h3 className="font-medium mb-2">Chọn thành viên:</h3>
                        {friendsData?.friendships?.map((friendship: any) => (
                            <div 
                                key={friendship.friendId}
                                className="flex items-center p-2 hover:bg-gray-100 rounded"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedFriends.includes(friendship.friendId)}
                                    onChange={() => toggleFriendSelection(friendship.friendId)}
                                    className="mr-3"
                                />
                                <span>{friendship.friendId}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={!groupName.trim() || selectedFriends.length === 0}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
                        >
                            Tạo nhóm
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GroupCreationModal;
