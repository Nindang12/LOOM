import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const { content, user_id } = body;
        const create_at = Math.floor(Date.now() / 1000); // Convert current timestamp to UNIX timestamp (seconds since epoch)

        if (!content || !user_id) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 } // Bad Request
            );
        }

        const connection = await db;
        const post_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
        const [results] = await connection.execute(
            'INSERT INTO post (post_id, post_content, user_id, create_at) VALUES (?, ?, ?, ?)',
            [post_id, content, user_id, create_at]
        );

        return NextResponse.json(
            { message: "Post created successfully", postId: (results as any).insertId },
            { status: 200 } // Created
        );
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { message: "An error occurred while creating the post" },
            { status: 500 } // Internal Server Error
        );
    }
}
