import React, { useEffect, useState } from "react";
import FriendList from "./FriendList";
import { getUserId } from "@/utils/auth";

interface LayoutChatProps {
  children: React.ReactNode;
}

const LayoutChat = ({ children }: LayoutChatProps) => {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setCurrentUserId(userId);
        }
    }, []);
    return (
        <div className="flex h-screen">
            <FriendList currentUserId={currentUserId as string} />
            {children}
        </div>
    );
};

export default LayoutChat;