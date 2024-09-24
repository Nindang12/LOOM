import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { user_id, post_id,post_content } = await req.json();

    try {
        const connection = await db;

        const [existingRepost] = await connection.execute(
            'SELECT * FROM post WHERE user_id = ? AND repost = ?',
            [user_id, post_id]
        );

        if (Array.isArray(existingRepost) && existingRepost.length > 0) {
            await connection.execute(
                'DELETE FROM post WHERE user_id = ? AND repost = ?',
                [user_id, post_id]
            );
            return NextResponse.json({ message: "Unreposting successfully" });
        } else {
            const create_at = new Date().getTime();
            const repost_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            await connection.execute(
                'INSERT INTO post (user_id, post_id, repost, create_at, post_content) VALUES (?, ?, ?, ?, ?)',
                [user_id, repost_id, post_id, create_at, post_content]
            );
            return NextResponse.json({ message: "Reposting successfully" });
        }
    } catch (error) {
        console.error("Error in reposting action:", error);
        return NextResponse.json(
            { message: "An error occurred while processing the reposting action" },
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

        const [repostCountResult]: any = await connection.execute(
            'SELECT COUNT(*) as repostCount FROM post WHERE repost = ?',
            [post_id]
        );

        const repostCount = repostCountResult[0]?.repostCount || 0;

        return NextResponse.json({ repostCount }, { status: 200 });
    } catch (error) {
        console.error("Error getting total reposts:", error);
        return NextResponse.json(
            { message: "An error occurred while getting the total reposts" },
            { status: 500 }
        );
    }
}


