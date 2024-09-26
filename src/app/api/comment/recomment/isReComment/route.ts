import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const comment_id = searchParams.get('commentId');
    const user_id = searchParams.get('userId');

    if (!comment_id || !user_id) {
        return NextResponse.json(
            { message: "Missing commentId or userId parameter" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;

        const [existingRecomment]: any = await connection.execute(
            'SELECT * FROM comment WHERE reply_id = ? AND user_id = ?',
            [comment_id, user_id]
        );

        const isRecommented = Array.isArray(existingRecomment) && existingRecomment.length > 0;

        return NextResponse.json({ isRecommented }, { status: 200 });
    } catch (error) {
        console.error("Error checking if comment is recommented:", error);
        return NextResponse.json(
            { message: "An error occurred while checking if the comment is recommented" },
            { status: 500 }
        );
    }
}
