"use client"
import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
export default function Suggest({data}:{data: AccountData}){
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        setUserId(storedUserId);
    }, []);

    const toggleFollow = () => {
        if (!userId) {
            console.error('User ID not found in session storage');
            return;
        }
        setIsFollowing(!isFollowing);
        following(data.user_id, userId);
    };

    const following = async (user_id: string, userId: string) => {
        try {
            const response = await fetch('/api/account/following', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, following_id: user_id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Follow/unfollow action successful:', result);
        } catch (error) {
            console.error('Error in follow/unfollow action:', error);
        }
    };
    // console.log(data.user_id)

    const checkUserIds = useCallback(async () => {
        try {
            const response = await fetch(`/api/account/following?userId=${userId}&followingId=${data.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            //console.log(result)
            setIsFollowing(result.isFollowing);
        } catch (error) {
            console.error('Error checking user IDs:', error);
            return false;
        }
    }, [data.user_id, userId]);

    useEffect(() => {
        checkUserIds();
    }, [checkUserIds]);

    return(
        <div className="ml-5 cursor-pointer">
            <div className="mb-5 hidden md:bolck" >
                <span className="text-sm font-bold text-gray-400">Gợi ý theo dõi</span>
            </div>
            <div className="">
                {/* header */}
                <div className="flex flex-row justify-between items-center ">
                    <div className="flex flex-row gap-2 items-center ">
                        <div>
                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt=""></img>           
                        </div>
                        <div className="flex flex-col ">
                            <Link href={`/@${data.user_id}`} className="font-bold text-sm">
                                <span className="">{data.user_id}</span>
                            </Link>
                            <div className="text-sm text-gray-400">
                                <p>{data.fullname}</p>
                            </div>
                        </div>
                    </div>
                    {
                        userId === data.user_id ? null : (
                            <button onClick={toggleFollow} className="flex mr-5 items-center justify-center w-auto h-[35px] border border-gray-400 rounded-xl">
                                <span className={`text-base p-5 font-medium ${isFollowing ? 'text-gray-400' : 'text-black'}`}>{isFollowing ? 'Đang theo dõi' : 'Theo dõi'}</span>
                            </button>
                        )
                    }
                </div>
                
                {/* body */}
                <div>
                    <p className="text-sm font-normal px-[40px] py-2">0 nguoi theo doi</p>
                </div>
                <div className="w-[568px] h-[1px] bg-gray-300 ml-[40px] mb-5"></div>
            </div>

        </div>
    )
}