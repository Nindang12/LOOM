import { NextResponse } from "next/server";
import db from "@/config/db"

export async function GET() {
    try {
        const results = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM user",(err:any, result:[]) => {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(result);
                }
            });
        });
        console.log(results);
        return NextResponse.json(results);
    }catch (error) {
        return NextResponse.json(
            {message: error},   
            {status: 500} // Internal Server Error
        );
    }
}