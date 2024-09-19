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
                'INSERT INTO action_like_comment (comment_id, user_id) VALUES (?, ?)',
                [comment_id, user_id]
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
