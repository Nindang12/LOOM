"use client"

import Siderbar from "@/components/Sidebar";
import React, { useEffect,useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleViewPost from "@/components/ArticleViewPost";
import ContentComment from "@/components/ContentComment";
import HeaderViewPost from "@/components/HeaderViewPost";
import { db } from "@/utils/contants";
import Link from "next/link";

export default function ViewPost() {
    const params = useParams();
    const post_id = params?.post_id as string;
    const username = params?.username as string;

    const query = { posts: {
        $:{
            where:{
                postId: post_id
            }
        }
    } }
    const { data } = db.useQuery(query)

    const post = data?.posts[0]
    
    const commentsQuery = {
        comments: {
            $: {
                where: {
                    postId: post_id
                }
            }
        }
    };
    const { data: commentsData } = db.useQuery(commentsQuery);
    
    const filterComment = commentsData?.comments.filter((comment:any)=>!comment.replyTo)

    return (
        <div className=" flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Siderbar/>
            <div className="flex flex-row justify-center mt-2 w-full relative">
                <div className="max-w-screen-sm w-full h-screen">
                <HeaderViewPost/>
                <div className="absolute top-0 right-5">
                    <Link href={'/login'}>
                    <button className="h-full bg-black p-2 px-4 rounded-lg text-white w-26 text-sm">
                        Đăng Nhập
                    </button>
                    </Link>
                </div>
                <div className="flex flex-col border border-gray-300 w-[full] rounded-xl mt-10 gap-10 h-[90vh] overflow-y-scroll f">
                    <div className="w-full  ">
                        <div className="mt-5" >
                            {
                                post&&(
                                    <ArticleViewPost post={post}/>
                                )
                            }
                        </div>
                        <div className="border-b border-solid py-4">
                            <span className="text-sm ml-5 font-bold">Thread trả lời</span>
                        </div>
                            <div className="flex flex-col gap-2">
                                {
                                    filterComment?.map((comment:any)=>(
                                        <ContentComment  key={comment.commentId} {...comment} className="border-b border-gray-200"/>
                                    ))
                                }
                            </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}
