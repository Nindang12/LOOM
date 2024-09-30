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

        let query = `
            SELECT p.*, 
                   op.post_content AS original_content,
                   op.user_id AS original_user_id
            FROM post p
            INNER JOIN post op ON p.repost = op.post_id
            WHERE p.user_id = ? AND p.repost IS NOT NULL
            ORDER BY p.create_at DESC
        `;
        let params = [user_id];

        const [reposts] = await connection.execute(query, params);

        return NextResponse.json({ reposts }, { status: 200 });
    } catch (error) {
        console.error("Error fetching reposts:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching reposts" },
            { status: 500 }
        );
    }
}
