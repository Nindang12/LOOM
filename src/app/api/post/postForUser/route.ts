import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('userId');

    if (!user_id) {
        return NextResponse.json(
            { message: "Missing user_id or post_id parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        let query = 'SELECT * FROM post WHERE user_id = ? AND repost is null ORDER BY create_at DESC';
        let params = [user_id];

        const [posts] = await connection.execute(query, params);

        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching posts" },
            { status: 500 }
        );
    }
}
