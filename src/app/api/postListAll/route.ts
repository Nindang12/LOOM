import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json(
            { message: "Missing userId parameter" },
            { status: 400 } // Bad Request
        );
    }

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(
                'SELECT * FROM post WHERE user_id = ?',
                [userId],
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
            { posts: results },
            { status: 200 } // OK
        );
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while fetching posts" },
            { status: 500 } // Internal Server Error
        );
    }
}
