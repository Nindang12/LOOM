import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

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
        const [results]: any = await connection.execute(
            'SELECT photo_id,photo_content FROM photo WHERE post_id = ?',
            [post_id]
        );

        return NextResponse.json(
            { photos: results },
            { status: 200 } // OK
        );
    } catch (error) {
        console.error("Error fetching photos:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching photos" },
            { status: 500 } // Internal Server Error
        );
    }
}
