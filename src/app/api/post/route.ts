import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"

export async function POST(req: NextRequest) {
    const body = await req.json()
    try {
        const { content, userId } = body;

        if (!content || !userId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 } // Bad Request
            );
        }

        const results = await new Promise((resolve, reject) => {
            db.query(
                'INSERT INTO post (content, user_id) VALUES (?, ?)',
                [content, userId],
                (err: any, result: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });

        return NextResponse.json(
            { message: "Post created successfully", postId: results.insertId },
            { status: 201 } // Created
        );
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while creating the post" },
            { status: 500 } // Internal Server Error
        );
    }
}
