import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const { user_id, following_id } = await req.json();

    try {
        const connection = await db;

        const [existingLike] = await connection.execute(
            'SELECT * FROM user_details WHERE user_id = ? AND following_id = ?',
            [user_id, following_id]
        );

        if (Array.isArray(existingLike) && existingLike.length > 0) {
            await connection.execute(
                'DELETE FROM user_details WHERE user_id = ? AND following_id = ?',
                [user_id, following_id]
            );
            return NextResponse.json({ message: "Unfollowing successfully" });
        } else {
            await connection.execute(
                'INSERT INTO user_details (user_id, following_id) VALUES (?, ?)',
                [user_id, following_id]
            );
            return NextResponse.json({ message: "Following successfully" });
        }
    } catch (error) {
        console.error("Error in following action:", error);
        return NextResponse.json(
            { message: "An error occurred while processing the following action" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const followingId = searchParams.get('followingId');

    try {
        const connection = await db;

        const [existingFollow] = await connection.execute(
            'SELECT * FROM user_details WHERE user_id = ? AND following_id = ?',
            [userId, followingId]
        );

        const isFollowing = Array.isArray(existingFollow) && existingFollow.length > 0;
        return NextResponse.json({ isFollowing }, { status: 200 });
    } catch (error) {
        console.error("Error in checking follow status:", error);
        return NextResponse.json(
            { message: "An error occurred while checking the follow status" },
            { status: 500 }
        );
    }
}