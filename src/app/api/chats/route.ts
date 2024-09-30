import { NextResponse } from 'next/server'
import db from "@/config/db";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId1 = searchParams.get('userId1');
    const userId2 = searchParams.get('userId2');

    if (!userId1 || !userId2) {
        return NextResponse.json(
            { message: "Both userId1 and userId2 query parameters are required" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;
        const [chats] = await connection.execute(`
            SELECT 
                c.id,
                IF(c.user1_id = ?, c.user2_id, c.user1_id) as otherUserId,
                u.user_id as otherUserName,
                m.content as lastMessage
            FROM chats c
            JOIN user u ON u.user_id = IF(c.user1_id = ?, c.user2_id, c.user1_id)
            LEFT JOIN messages m ON m.id = (
                SELECT id FROM messages 
                WHERE chat_id = c.id 
                ORDER BY created_at DESC 
                LIMIT 1
            )
            WHERE (c.user1_id = ? AND c.user2_id = ?) OR (c.user1_id = ? AND c.user2_id = ?)
            ORDER BY m.created_at DESC
        `, [userId1, userId1, userId1, userId2, userId2, userId1]);

        return NextResponse.json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        return NextResponse.json(
            { message: "An error occurred while fetching chats" },
            { status: 500 }
        );
    }
}