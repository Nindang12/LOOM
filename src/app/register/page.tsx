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
    const { data } = db.useQuery(query);

    const addUserToInstantDB = async (user: { user_id: string }) => {    
        const userExists = data && data.users && data.users.length > 0;
        if(!userExists){
            await db.transact(
                tx.users[id()].update({
                userId: user.user_id,
                createdAt: Date.now(),
                })
            );
        }

    }

    const onRegister = async() =>{
        try{
            const isEmail = CheckisEmail(email as string);
            setIsEmail(isEmail)
            if(isEmail){
                try {
                    const response = await axios.post("/api/register", {
                        user_id: username,
                        password,
                        email,
                        fullname: username
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.status === 200) {
                        // Add user to InstantDB
                        await addUserToInstantDB({
                            user_id: username as string
                        });
                        toast.success("Registration successful!");
                        router.push("/");
                    } else {
                        toast.error("Registration failed. Please try again.");
                    }
                } catch (error:any) {
                    if (axios.isAxiosError(error) && error.response) {
                        if (error.response.status === 409) {
                            toast.error("User ID or email already exists.");
                        } else {
                            toast.error("An error occurred during registration.");
                        }
                    } else if (error.message === 'User ID already exists') {
                        toast.error("User ID already exists.");
                    } else {
                        toast.error("An unexpected error occurred.");
                    }
                    console.error("Registration error:", error);
                }
            }
        }catch(err){
            console.log(err)
        }
    }
    
    const CheckisEmail = (email:string) => {
        const re = /^[a-zA-Z0-9._-]+@gmail.[a-zA-Z]{2,6}$/;
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
                <input onChange={(event)=>setUsername(event.target.value)} className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" type="text" id=""placeholder="Tên người dùng, số điện thoại hoặc email" />
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