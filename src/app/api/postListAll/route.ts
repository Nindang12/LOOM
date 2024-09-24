import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    try {
        const connection = await db;
        const [results]: any = await connection.execute('SELECT * FROM post where repost is null ORDER BY create_at DESC');
        

        return NextResponse.json(
            { posts: results},
            { status: 200 } // OK
        );
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching posts" },
            { status: 500 } // Internal Server Error
        );
    }
}
