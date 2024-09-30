import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { post_id, user_id } = await req.json();

    try {
        const connection = await db;

        // Check if the user has already liked the post
        const [existingLike] = await connection.execute(
            'SELECT * FROM action_like_post WHERE post_id = ? AND user_id = ?',
            [post_id, user_id]
        );

        const create_at = new Date().getTime();

        if (Array.isArray(existingLike) && existingLike.length > 0) {
            // User has already liked the post, so remove the like
            await connection.execute(
                'DELETE FROM action_like_post WHERE post_id = ? AND user_id = ?',
                [post_id, user_id]
            );
            return NextResponse.json({ message: "Like removed successfully" });
        } else {
            // User hasn't liked the post, so add a new like
            await connection.execute(
                'INSERT INTO action_like_post (post_id, user_id, create_at) VALUES (?, ?, ?)',
                [post_id, user_id, create_at]
            );
            return NextResponse.json({ message: "Post liked successfully" });
        }
    } catch (error) {
        console.error("Error in like/unlike action:", error);
        return NextResponse.json(
            { message: "An error occurred while processing the like/unlike action", error: error },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get('postId');

    if (!post_id) {
        return NextResponse.json(
            { message: "Missing post_id parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [results] = await connection.execute(
            'SELECT COUNT(*) as total_likes FROM action_like_post WHERE post_id = ?',
            [post_id]
        );

        const totalLikes = (results as any)[0].total_likes;

        return NextResponse.json({ total_likes: totalLikes }, { status: 200 });
    } catch (error) {
        console.error("Error fetching total likes:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching total likes" },
            { status: 500 }
        );
    }
}

