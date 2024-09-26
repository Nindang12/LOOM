import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const comment_id = searchParams.get('commentId');
    const user_id = searchParams.get('userId');

    if (!comment_id || !user_id) {
        return NextResponse.json(
            { message: "Missing postId or userId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [existingLike]: any = await connection.execute(
            'SELECT * FROM action_like_comment WHERE comment_id = ? AND user_id = ?',
            [comment_id, user_id]
        );

        const isLiked = Array.isArray(existingLike) && existingLike.length > 0;

        return NextResponse.json({ isLiked }, { status: 200 });
    } catch (error) {
        console.error("Error checking if post is liked:", error);
        return NextResponse.json(
            { message: "An error occurred while checking if the post is liked" },
            { status: 500 }
        );
    }
}