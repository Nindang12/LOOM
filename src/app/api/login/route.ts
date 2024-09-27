import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/auth";

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
            if(passwordMatch){
                const token = await generateToken(user_id);
                const response = NextResponse.json({ message: "Login successful" });
                response.cookies.set({
                    name: 'token',
                    value: token,
                });
                return response;
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