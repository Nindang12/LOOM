import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const post_id = searchParams.get('postId');
    const user_id = searchParams.get('userId');

    if (!post_id || !user_id) {
        return NextResponse.json(
            { message: "Missing postId or userId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [existingRepost]: any = await connection.execute(
            'SELECT * FROM post WHERE repost = ? AND user_id = ?',
            [post_id, user_id]
        );

        const isReposted = Array.isArray(existingRepost) && existingRepost.length > 0;

        return NextResponse.json({ isReposted }, { status: 200 });
    } catch (error) {
        console.error("Error checking if post is reposted:", error);
        return NextResponse.json(
            { message: "An error occurred while checking if the post is reposted" },
            { status: 500 }
        );
    }
}
