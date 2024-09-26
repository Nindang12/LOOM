import Link from "next/link"
import Article from "./Article"
import { useEffect, useState } from "react";
export default function Thread({userId}:{userId:string}){
    const [posts, setPosts] = useState<Post[]>([]);

    const getPostsForUser = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/post/postForUser?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                //console.log(result.posts);
                setPosts(result.posts);
            } else {
                console.error('Failed to fetch posts for user');
            }
        } catch (error) {
            console.error('Error fetching posts for user:', error);
            return [];
        }
    }

    useEffect(() => {
        getPostsForUser();
    }, [userId]);

    return(
        // header
        <div className="flex flex-col gap-2 mt-4">
        {/* header2 */}
            {
                posts.length == 0 && (
                    <div className="mr-[20px] ml-[20px]">
                        <div className="flex flex-row justify-between text-sm mb-[4px]">
                            <div className="w-[200px] h-[30px]">
                                <span className="font-bold">Hoàn tất trang cá nhân</span>
                            </div>
                            <div>
                                <span>Còn 4</span>
                            </div>
                        </div>
                        
                        <div className="max-h-[220px] w-full flex items-start overflow-x-scroll overflow-y-hidden gap-2">
                            <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                                <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                                    <img width={25} src="/assets/camera.svg" alt="" />
                                </div>
                                <span className="text-sm mb-2 font-semibold whitespace-pre-line">Thêm ảnh đại diện</span>
                                <p className="px-2 mb-4 text-center text-xs text-gray-400">
                                Giúp mọi người dễ dàng nhận ra bạn hơn.
                                </p>
                                <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                                    <span className="text-sm font-bold text-white ">Thêm</span>
                                </div>
                            </div>
                            <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                                <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                                    <img width={25} src="/assets/pen.svg" alt="" />
                                </div>
                                <span className="text-sm mb-2 font-semibold whitespace-pre-line">Thêm tiểu sử</span>
                                <p className="px-2 mb-4 text-center text-xs text-gray-400">
                                Hãy giới thiệu về bản thân và cho mọi người biết bạn thích gì.
                                </p>
                                <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                                    <span className="text-sm font-bold text-white ">Thêm</span>
                                </div>
                            </div>
                            <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                                <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                                    <img width={25} src="/assets/addfriends.svg" alt="" />
                                </div>
                                <span className="text-sm mb-2 px-3 text-center font-semibold whitespace-pre-line">Theo dõi 5 trang cá nhân</span>
                                <p className="px-2 mb-4 text-center text-xs text-gray-400">
                                Tạo điều kiện để bảng feed của bạn hiển thị những thread bạn quan tâm.  
                                </p>
                                <Link href={'/search'}>
                                <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                                    <span className="text-sm font-bold text-white ">Xem trang cá nhân</span>
                                </div>
                                </Link>
                            </div>
                            <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                                <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                                    <img width={25} src="/assets/write.svg" alt="" />
                                </div>
                                <span className="text-sm mb-2 font-semibold whitespace-pre-line">Tạo thread</span>
                                <p className="px-2 mb-4 text-center text-xs text-gray-400">
                                Cho mọi người biết bạn đang nghĩ gì hoặc chia sẻ về một hoạt động nổi bật mới đây.
                                </p>
                                <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                                    <span className="text-sm font-bold text-white ">Thêm</span>
                                </div>
                            </div>

                        </div>
                    </div>
                )
            }
            {posts.map((post) => (
                <Article key={post.post_id} user_id={post.user_id} content={post.post_content} postId={post.post_id} />
            ))}
        </div>
        
    )
}