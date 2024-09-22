import { NextRequest, NextResponse } from "next/server";
import db from "@/config/db"
import { login } from "@/utils/utils";


export async function POST(req: NextRequest) {
    const body = await req.json()
    try{
        const results = await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user WHERE user_id="${body.username}" AND password="${body.password}"`,(err:any, result:[]) => {
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