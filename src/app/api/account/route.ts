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