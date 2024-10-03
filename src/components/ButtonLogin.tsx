"use client"
import { useRouter } from "next/navigation"
import { toast } from 'react-toastify';
import { db } from "@/utils/contants";
import { useEffect, useState } from 'react';
import { checkLogin, generateToken, logout } from '../utils/auth';

const ButtonLogin = ({username, password}: {username: string, password: string}) => {
    const router = useRouter()
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Move the useQuery hook to the top level
    const query = { userDetails: { 
        $:{
            where:{
                userId: username,
                password: password
            }
        }
    } };
    const { isLoading, error, data } = db.useQuery(query);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const loggedIn = await checkLogin();
            setIsLoggedIn(loggedIn);
        };
        checkLoginStatus();
    }, []);

    const onLogin = async() => {
        try {
            if (!isLoading) {
                const userExists = data && data.userDetails && data.userDetails.length > 0;
                if (userExists) {
                    const token = await generateToken(username);
                    document.cookie = `token=${token}; path=/; max-age=3600`;
                    localStorage.setItem('lastLoginTime', Date.now().toString());
                    setIsLoggedIn(true);
                    toast.success("Login successful");
                    router.push('/');
                } else {
                    toast.error("Invalid username or password");
                }
            }
        } catch(err) {
            console.error(err)
            toast.error("An error occurred during login");
        }
    }

    const onLogout = () => {
        logout();
        setIsLoggedIn(false);
        router.push('/login');
    }

    return(
        isLoggedIn ? 
        <button onClick={onLogout} className="md:w-[370px] w-full px-6 py-4 rounded-2xl bg-red-500 text-white font-bold text-sm">Đăng xuất</button>
        :
        <button onClick={onLogin} className="md:w-[370px] w-full px-6 py-4 rounded-2xl bg-black text-white font-bold text-sm">Đăng nhập</button>
    )
}

export default ButtonLogin