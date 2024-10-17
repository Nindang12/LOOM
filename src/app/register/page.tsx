"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import { init,tx,id } from "@instantdb/react"

type Schema = {
    users: {
        id: string
        userId: string
        createdAt: number
    }
}

export default function Register(){
    const [username, setUsername] = useState<string|null>(null)
    const [password, setPassword] = useState<string|null>(null)
    const [email, setEmail] = useState<string|null>(null)
    const [isEmail, setIsEmail] = useState<boolean>(true)
    const router = useRouter()

    const APP_ID = '5e07a141-e7d9-4273-9cba-877a820f73dd'
    const db = init<Schema>({ appId: APP_ID })
    const query = { users: { userId: username } };
    const { isLoading, data } = db.useQuery(query);

    const addUserToInstantDB = async (user: { user_id: string }) => {    
        const userExists = !isLoading && data && data.users && data.users.length > 0;
        if(!userExists){
            await db.transact(
                tx.users[id()].update({
                userId: user.user_id,
                createdAt: Date.now(),
                })
            ).finally(async()=>{
                await db.transact(
                    tx.userDetails[id()].update({
                    userId: user.user_id,
                    fullname: user.user_id,
                    email: email as string,
                    password: password as string,
                    avatar: null,
                    bio: null,
                    birthday: null,
                    gender: null,
                    phone: null,
                    address: null,
                    status: null,
                    point: 0,
                    createdAt: Date.now(),
                    })
                );
            });
            
        }

    }

    const onRegister = async() =>{
        try{
            const isEmail = CheckisEmail(email as string);
            setIsEmail(isEmail)
            if(isEmail){
                try {
                    const username = (email as string).split('@')[0];
                    await addUserToInstantDB({
                        user_id: username
                    })
                    router.push("/");
                } catch (error:any) {
                    console.error("Registration error:", error);
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    
    const CheckisEmail = (email:string) => {
        const re = /^[a-zA-Z0-9._-]+@(std\.ttu\.edu\.vn\.com|gmail\.com)$/;
        return re.test(email);
    }

    return(
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <span className="mb-1 font-bold">
                Đăng ký
            </span>
            <div className="w-full px-3 flex justify-center">
                <input onChange={(event)=>setEmail(event.target.value)} className={`md:w-[370px] w-full px-6 py-4 focus outline-none border ${!isEmail?"border-red-500":"border-gray-300"} border-solid  rounded-2xl bg-gray-100 text-sm`} type="text" id=""placeholder="Email" />
            </div>
            <div className="w-full px-3 flex justify-center">
                <input onChange={(event)=>setPassword(event.target.value)} className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" type="password" id=""placeholder="Mật khẩu" />
            </div>
            <div className="w-full px-3 flex justify-center">
                <button onClick={onRegister} className="md:w-[370px] w-full px-6 py-4  rounded-2xl bg-black text-white font-bold text-sm">Đăng ký</button>
            </div>
        </div>
    )
}