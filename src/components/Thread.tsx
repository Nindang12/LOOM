import Link from "next/link"
import Article from "./Article"
import { useEffect, useState } from "react";
import { db } from "@/utils/contants";
export default function Thread({userId}:{userId:string}){

    const query = {
        posts:{
            $:{
                where:{
                    userId: userId,
                },
                order: {
                    serverCreatedAt: "desc" as const
                }
            }
        }
    }

    const {data, isLoading} = db.useQuery(query)
    const filterPost = data?.posts.filter((post:any) => !post.repost)

    return(
        // header
        <div className="flex flex-col gap-2 mt-4">
        {/* header2 */}
            {
                filterPost?.length == 0 && (
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
                            <div className="w-[260px] h-[220px] flex flex-col justify-center rounded-xl items-center bg-gray-100">
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
                            <div className="w-[260px] h-[220px] flex flex-col justify-center rounded-xl items-center bg-gray-100">
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
                            <div className="w-[260px] h-[220px] flex flex-col justify-center rounded-xl items-center bg-gray-100">
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
                            <div className="w-[260px] h-[220px] flex flex-col justify-center rounded-xl items-center bg-gray-100">
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
            {filterPost?.map((post) => (
                <Article key={post.id} user_id={post.userId} content={post.content} postId={post.id} images={post.images} />
            ))}
        </div>
        
    )
}