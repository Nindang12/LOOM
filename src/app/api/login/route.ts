import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    const { user_id, password } = await req.json();

    if (!user_id || !password) {
        return NextResponse.json(
            { message: "User ID and password are required" },
            { status: 400 }
        );
    }

    try {
        const connection = await db;
        const [rows] = await connection.execute(
            'SELECT * FROM user WHERE user_id = ?',
            [user_id]
        );

        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0] as any;
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                return NextResponse.json(
                    { message: "Login successful", user: { user_id: user.user_id, fullname: user.fullname, email: user.email } },
                    { status: 200 }
                );
            }
        }

        return NextResponse.json(
            { message: "Invalid credentials" },
            { status: 401 }
        );
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "An error occurred during login" },
            { status: 500 }
        );
    }
}