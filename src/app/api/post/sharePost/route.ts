import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { post_id, user_id } = await req.json();

    try {
        const connection = await db;

        // Check if the user has already liked the post
        const [existingLike] = await connection.execute(
            'SELECT * FROM share WHERE post_id = ? AND user_id = ?',
            [post_id, user_id]
        );

        if (Array.isArray(existingLike) && existingLike.length > 0) {
            return NextResponse.json({ message: "Post already shared" });
        } else {
            const create_at = new Date().getTime();
            const share_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            await connection.execute(
                'INSERT INTO share (share_id, post_id, user_id, create_at) VALUES (?, ?, ?, ?)',
                [share_id, post_id, user_id, create_at]
            );
            return NextResponse.json({ message: "Post shared successfully" });
        }
    } catch (error) {
        console.error("Error in share post action:", error);
        return NextResponse.json(
            { message: "An error occurred while processing the share post action" },
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

        const [results] = await connection.execute(
            'SELECT COUNT(*) as total_shares FROM share WHERE post_id = ?',
            [post_id]
        );

        const totalShares = (results as any)[0].total_shares;

        return NextResponse.json({ total_shares: totalShares }, { status: 200 });
    } catch (error) {
        console.error("Error fetching total shares:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching total shares" },
            { status: 500 }
        );
    }
}

