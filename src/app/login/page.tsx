"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast, Toaster } from 'react-hot-toast';
import Link from "next/link";
import { checkLogin } from "@/utils/auth";
import { db } from "@/utils/contants"; 
import { generateToken } from "@/utils/auth";

export default function Login(){
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const query = {
        userDetails: {
            $: {
                where: {
                    userId: username.includes('@gmail.com') ? username.replace('@gmail.com', '') : username,
                    password: password
                }
            }
        }
    }
    const { data,isLoading:isLoadingQuery } = db.useQuery(query);
    const user = data?.userDetails?.[0];

    useEffect(() => {
        const checkLoginStatus = () => {
            if (checkLogin()) {
                router.push('/');
            }
        };
        checkLoginStatus();
    }, [router]);

    const onLogin = () => {
        if (!username || !password) {
            toast.error("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        setIsLoading(true);
        try {
            if (user && !isLoadingQuery) {
                toast.success("Đăng nhập thành công!");
                const token = generateToken(user.userId);
                document.cookie = `token=${token}; path=/; max-age=3600`;
                localStorage.setItem('lastLoginTime', Date.now().toString());
                router.push('/');
            } else {
                toast.error("Tên đăng nhập hoặc mật khẩu không chính xác");
            }
        } catch (err) {
            console.log(err);
            toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            onLogin()
        }
    }

    return(
        <div className="flex flex-col justify-center items-center h-screen gap-2">
            <Toaster position="top-center"/>
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
                <button 
                    onClick={onLogin} 
                    disabled={isLoading}
                    className={`md:w-[370px] w-full px-6 py-4 rounded-2xl ${
                        isLoading ? 'bg-gray-400' : 'bg-black'
                    } text-white font-bold text-sm flex justify-center items-center`}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
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