import { db } from "@/utils/contants";
import { create } from 'zustand';
import React from 'react';
interface NotificationState {
    unreadMessages: number;
    unreadActivities: number;
    setUnreadMessages: (count: number) => void;
    setUnreadActivities: (count: number) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
    unreadMessages: 0,
    unreadActivities: 0,
    setUnreadMessages: (count) => set({ unreadMessages: count }),
    setUnreadActivities: (count) => set({ unreadActivities: count }),
}));

export const useNotifications = (userId: string) => {
    const { setUnreadMessages, setUnreadActivities } = useNotificationStore();

    // Query for unread messages
    const messagesQuery = {
        messages: {
            $: {
                where: {
                    and: [
                        { receiverId: userId },
                        { isRead: false }
                    ]
                }
            }
        }
    };

    // Query for unread activities
    const activitiesQuery = {
        activities: {
            $: {
                where: {
                    and: [
                        { userId: userId },
                        { isRead: false }
                    ]
                }
            }
        }
    };

    const { data: messages } = db.useQuery(messagesQuery);
    const { data: activities } = db.useQuery(activitiesQuery);

    React.useEffect(() => {
        setUnreadMessages(messages?.messages?.length || 0);
        setUnreadActivities(activities?.activities?.length || 0);
    }, [messages, activities]);
}; 