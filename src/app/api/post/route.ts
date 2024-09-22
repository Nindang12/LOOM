import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"


export async function POST(req: NextRequest) {
    const body = await req.json()
    try{
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM post WHERE user_id="${body.username}"`,(err:any, result:[]) => {
                if (err) {
                    reject(err);
                } 
                else {
                    resolve(result);
                }
            });
        });
        return NextResponse.json(results)
    }catch(error){
        return NextResponse.json(
            {message: error},   
            {status: 500} // Internal Server Error
        );
    }
}