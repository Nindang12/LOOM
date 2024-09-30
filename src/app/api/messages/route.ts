import { NextResponse } from 'next/server'
import db from "@/config/db";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);
    const userId1 = searchParams.get('userId1');
    const userId2 = searchParams.get('userId2');

    if (!userId1 || !userId2) {
        return NextResponse.json(
            { message: "Both userId1 and userId2 query parameters are required" },
            { status: 400 } // Bad Request
        );
    }

    try {
        const connection = await db;
        const [messages] = await connection.execute(
            `SELECT m.id, m.sender_id as senderId, m.content, m.created_at as timestamp
            FROM messages m
            JOIN chats c ON m.chat_id = c.id
            WHERE (c.user1_id = ? AND c.user2_id = ?) OR (c.user1_id = ? AND c.user2_id = ?)
            ORDER BY m.created_at ASC`,
            [userId1, userId2, userId2, userId1]
        );

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { message: "An error occurred while fetching messages" },
            { status: 500 } // Internal Server Error
        );
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const connection = await db;
        const [results] = await connection.execute(
            'INSERT INTO messages (chat_id, sender_id, content) VALUES (?, ?, ?)',
            [body.chatId, body.senderId, body.content]
        );
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json(
            { message: "An error occurred while sending the message" },
            { status: 500 } // Internal Server Error
        );
    }
}