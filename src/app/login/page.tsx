"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import Link from "next/link";
import md5 from "md5"

export default function Login(){
    const [username, setUsername] = useState<string|null>(null)
    const [password, setPassword] = useState<string|null>(null)

    const router = useRouter()

    const onLogin = async() =>{
        try{
            const response = await axios.post("/api/login",{
                user_id:username,
                password,
            },{
                headers: {
                    'Content-Type': 'application/json'
                }              
            })
            const results = await response.data
            if(results.length ==0){
                toast.error("Login Failed!");
            }else{
                localStorage.setItem("isLogin","true");
                localStorage.setItem("username", username as string);
                router.push('/')
            }
        }catch(err){
            console.log(err)
        }
    }

    return(
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <ToastContainer/>
            <span className="mb-1 font-bold">
                Đăng nhập
            </span>
            <div className="w-full px-3 flex justify-center">
                <input onChange={(event)=>setUsername(event.target.value)} className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" type="text" id=""placeholder="Tên người dùng, số điện thoại hoặc email" />
            </div>
            <div className="w-full px-3 flex justify-center">
                <input onChange={(event)=>setPassword(event.target.value)} className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" type="password" id=""placeholder="Mật khẩu" />
            </div>
            <div className="w-full px-3 flex justify-center">
                <button onClick={onLogin} className="md:w-[370px] w-full px-6 py-4  rounded-2xl bg-black text-white font-bold text-sm">Đăng nhập</button>
            </div>
            <button className="text-gray-400 text-sm mt-2">Bạn quên mật khẩu ư?</button>
            <Link href={'/register'} className="w-full px-3 flex justify-center">
                <button className="md:w-[370px] w-full px-6 py-4  rounded-2xl border border-solid border-black font-bold text-sm">Tạo tài khoản</button>
            </Link>

        </div>
    )
}