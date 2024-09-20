import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function POST(req: NextRequest) {
    const body = await req.json();
    try {
        const connection = await db;
        const [results] = await connection.execute(
            'SELECT user_id, fullname, phone_number, location FROM user WHERE user_id = ?',
            [body.username]
        );
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error fetching account:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching the account" },
            { status: 500 } // Internal Server Error
        );
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) {
        return NextResponse.json(
            { message: "userId query parameter is required" },
            { status: 400 } // Bad Request
        );
    }

    try {
        const connection = await db;
        const [results] = await connection.execute(
            'SELECT user_id,fullname,image FROM user WHERE user_id LIKE ?',
            [`%${userId}%`] // Use LIKE with wildcards
        );
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error searching user_id:", error);
        return NextResponse.json(
            { message: "An error occurred while searching for the user" },
            { status: 500 } // Internal Server Error
        );
    }
}