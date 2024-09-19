import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    const { user_id, password, fullname, email } = await req.json();
    
    if (!user_id || !password || !fullname || !email) {
        return NextResponse.json(
            { message: "All fields are required" },
            { status: 400 }
        );
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await db;
        await connection.execute(
            'INSERT INTO user (user_id, password, fullname, email, point) VALUES (?, ?, ?, ?, ?)',
            [user_id, hashedPassword, fullname, email, 0]
        );

        return NextResponse.json({ message: "User registered successfully" }, { status: 200 });
    } catch (error:any) {
        console.error("Registration error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return NextResponse.json(
                { message: "User ID or email already exists" },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { message: "An error occurred during registration" },
            { status: 500 }
        );
    }
}