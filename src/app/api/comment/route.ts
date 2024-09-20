import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { post_id, user_id, comment_content } = await req.json();
    const create_at = new Date().getTime(); // Get current timestamp in milliseconds

    try {
        if (!post_id || !user_id || !comment_content) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const connection = await db;
        const comment_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
        
        await connection.execute(
            'INSERT INTO comment (comment_id, post_id, user_id, comment_content, create_at) VALUES (?, ?, ?, ?, ?)',
            [comment_id, post_id, user_id, comment_content, create_at]
        );

        return NextResponse.json(
            { message: "Comment created successfully", comment_id: comment_id },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { message: "An error occurred while creating the comment" },
            { status: 500 }
        );
    }
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get('postId');

    if (!post_id) {
        return NextResponse.json(
            { message: "Missing postId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [comments] = await connection.execute(
            `SELECT c.comment_id, c.user_id, c.comment_content, c.create_at, 
                    (SELECT COUNT(*) FROM action_like_comment WHERE comment_id = c.comment_id) as like_count
                FROM comment c
                WHERE c.post_id = ?
                ORDER BY c.create_at DESC`,
            [post_id]
        );

        return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching comments" },
            { status: 500 }
        );
    }
}


