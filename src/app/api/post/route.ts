import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const { content, user_id,image_content } = body;
        const create_at = new Date().getTime(); // Convert current timestamp to UNIX timestamp (seconds since epoch)

        if (!content || !user_id || !image_content) {
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
        if (image_content) {
            const photo_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            await connection.execute(
                'INSERT INTO photo (photo_id, post_id, photo_content, user_id, created_at) VALUES (?, ?, ?, ?, ?)',
                [photo_id, post_id, image_content, user_id, create_at]
            );
        }
        
        return NextResponse.json(
            { message: "Post created successfully", postId: (results as any).insertId },
            { status: 200 } // Created
        );
    } catch (error) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { message: "An error occurred while creating the post", error: error },
            { status: 500 } // Internal Server Error
        );
    }
}


export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('userId');
    const post_id = searchParams.get('postId');

    if (!user_id && !post_id) {
        return NextResponse.json(
            { message: "Missing user_id or post_id parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        let query = 'SELECT * FROM post WHERE user_id = ? AND post_id = ?';
        let params = [user_id, post_id];

        const [posts] = await connection.execute(query, params);

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching posts" },
            { status: 500 }
        );
    }
}
