import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { user_id, comment_id,comment_content } = await req.json();

    try {
        const connection = await db;

        const [existingRepost] = await connection.execute(
            'SELECT * FROM comment WHERE user_id = ? AND reply_id = ?',
            [user_id, comment_id]
        );

        if (Array.isArray(existingRepost) && existingRepost.length > 0) {
            await connection.execute(
                'DELETE FROM comment WHERE user_id = ? AND reply_id = ?',
                [user_id, comment_id]
            );
            return NextResponse.json({ message: "Unrecommenting successfully" });
        } else {
            const create_at = new Date().getTime();
            const reply_comment_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            await connection.execute(
                'INSERT INTO comment (user_id, comment_id, reply, create_at, comment_content) VALUES (?, ?, ?, ?, ?)',
                [user_id, reply_comment_id, comment_id, create_at, comment_content]
            );
            return NextResponse.json({ message: "Recommenting successfully" });
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
    const comment_id = searchParams.get('commentId');

    if (!comment_id) {
        return NextResponse.json(
            { message: "Missing commentId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [recommentCountResult]: any = await connection.execute(
            'SELECT COUNT(*) as replyCount FROM comment WHERE reply_id = ?',
            [comment_id]
        );

        const repostCount = recommentCountResult[0]?.replyCount || 0;

        return NextResponse.json({ repostCount }, { status: 200 });
    } catch (error) {
        console.error("Error getting total reposts:", error);
        return NextResponse.json(
            { message: "An error occurred while getting the total reposts" },
            { status: 500 }
        );
    }
}


