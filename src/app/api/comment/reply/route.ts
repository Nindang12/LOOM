import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { comment_id, user_id, reply_content,post_id } = await req.json();

    try {
        const connection = await db;
        const create_at = new Date().toISOString().slice(0, 19).replace('T', ' ');

        // Insert the reply into the comment table
        const reply_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
        await connection.execute(
            'INSERT INTO comment (comment_id, user_id, comment_content, reply_id, create_at,post_id) VALUES (?, ?, ?, ?, ?, ?)',
            [reply_id,user_id, reply_content, comment_id, create_at,post_id]
        );

        return NextResponse.json({ 
            message: "Reply added successfully", 
            reply_id: reply_id 
        }, { status: 201 });

    } catch (error) {
        console.error("Error adding reply:", error);
        return NextResponse.json(
            { message: "An error occurred while adding the reply" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const comment_id = searchParams.get('commentId');

    if (!comment_id) {
        return NextResponse.json(
            { message: "Missing commentId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [replies]: any = await connection.execute(
            'SELECT * FROM comment WHERE reply_id = ? ORDER BY created_at DESC',
            [comment_id]
        );

        return NextResponse.json({ replies }, { status: 200 });

    } catch (error) {
        console.error("Error fetching replies:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching replies" },
            { status: 500 }
        );
    }
}
