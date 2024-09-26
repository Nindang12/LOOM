import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('userId');

    if (!user_id) {
        return NextResponse.json(
            { message: "Missing userId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [comments] = await connection.execute(
            `SELECT c.comment_id, c.post_id, c.comment_content, c.create_at, 
                    (SELECT COUNT(*) FROM action_like_comment WHERE comment_id = c.comment_id) as like_count,
                    c.user_id
                FROM comment c
                WHERE c.user_id = ?
                ORDER BY c.create_at DESC`,
            [user_id]
        );

        return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
        console.error("Error fetching comments for user:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching comments for user" },
            { status: 500 }
        );
    }
}