"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ToastContainer, toast } from 'react-toastify';
import Link from "next/link";
import { checkLogin } from "@/utils/auth";
import { db } from "@/utils/contants"; 
import { generateToken } from "@/utils/auth";

export default function Login(){
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const query = {
        userDetails: {
            $: {
                where: {
                    userId: username,
                    password: password
                }
            }
        }
    }
    const { data } = db.useQuery(query);
    const user = data?.userDetails?.[0];


    useEffect(() => {
        const checkLoginStatus = async () => {
            const loggedIn = await checkLogin();
            setIsLoggedIn(loggedIn);
            if (loggedIn) {
                router.push('/');
            }
        };
        checkLoginStatus();
    }, [router]);

    const onLogin = async () => {
        try {
            if (user) {
                const token = await generateToken(user.userId);
                document.cookie = `token=${token}; path=/; max-age=3600`;
                localStorage.setItem('lastLoginTime', Date.now().toString());
                setIsLoggedIn(true);
                toast.success("Login successful");
                router.push('/');
            } else {
                toast.error("Invalid username or password");
            }
        } catch (err) {
            console.error(err);
            toast.error("An error occurred during login");
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            onLogin()
        }
    }

    return(
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <ToastContainer/>
            <span className="mb-1 font-bold">
                Đăng nhập
            </span>
            <div className="w-full px-3 flex justify-center">
                <input 
                    onChange={(event)=>setUsername(event.target.value)} 
                    className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" 
                    type="text" 
                    placeholder="Tên người dùng, số điện thoại hoặc email" 
                />
            </div>
            <div className="w-full px-3 flex justify-center">
                <input 
                    onChange={(event)=>setPassword(event.target.value)} 
                    onKeyUp={handleKeyPress}
                    className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" 
                    type="password" 
                    placeholder="Mật khẩu" 
                />
            </div>
            <div className="w-full px-3 flex justify-center">
                <button onClick={onLogin} className="md:w-[370px] w-full px-6 py-4 rounded-2xl bg-black text-white font-bold text-sm">Đăng nhập</button>
            </div>
            <button className="text-gray-400 text-sm mt-2">Bạn quên mật khẩu ư?</button>
            <Link href={'/register'} className="w-full px-3 flex justify-center">
                <button className="md:w-[370px] w-full px-6 py-4  rounded-2xl border border-solid border-black font-bold text-sm">Tạo tài khoản</button>
            </Link>
            <span className="text-gray-400 text-sm mt-2">Hoặc có thể đăng nhập bằng</span>
            {/* <LoginGoogle/> */}
        </div>
    )
}