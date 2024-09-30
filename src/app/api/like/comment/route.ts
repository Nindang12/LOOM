import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { comment_id, user_id } = await req.json();

    try {
        const connection = await db;

        // Check if the user has already liked the comment
        const [existingLike] = await connection.execute(
            'SELECT * FROM action_like_comment WHERE comment_id = ? AND user_id = ?',
            [comment_id, user_id]
        );

        const create_at = new Date().getTime();

        if (Array.isArray(existingLike) && existingLike.length > 0) {
            // User has already liked the comment, so remove the like
            await connection.execute(
                'DELETE FROM action_like_comment WHERE comment_id = ? AND user_id = ?',
                [comment_id, user_id]
            );
            return NextResponse.json({ message: "Like removed successfully" });
        } else {
            // User hasn't liked the comment, so add a new like
            await connection.execute(
                'INSERT INTO action_like_comment (comment_id, user_id, create_at) VALUES (?, ?, ?)',
                [comment_id, user_id, create_at]
            );
            return NextResponse.json({ message: "Comment liked successfully" });
        }
    } catch (error) {
        console.error("Error in like/unlike action:", error);
        return NextResponse.json(
            { message: "An error occurred while processing the like/unlike action" },
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

        const [result]:any = await connection.execute(
            'SELECT COUNT(*) as total_likes FROM action_like_comment WHERE comment_id = ?',
            [comment_id]
        );

        const totalLikes = result[0].total_likes;

        return NextResponse.json({ total_likes: totalLikes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching total likes for comment:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching total likes for the comment" },
            { status: 500 }
        );
    }
}
