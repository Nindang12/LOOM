"use client"

import Siderbar from "@/components/Sidebar";
import React, { useEffect,useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleViewPost from "@/components/ArticleViewPost";
import ContentComment from "@/components/ContentComment";
import HeaderViewPost from "@/components/HeaderViewPost";
import { db } from "@/utils/contants";

export default function ViewPost(){  
    const {post_id,username} = useParams()

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

    // const commentChild = commentsData?.comments.filter((comment:any)=>comment.replyTo)

    //console.log(commentChild)
    return (
        <div className=" flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Siderbar/>
            <div className="flex flex-row justify-center mt-2 w-full ">
                <div className="max-w-screen-sm w-full h-screen">
                <HeaderViewPost/>
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
                                        <ContentComment  key={comment.commentId} {...comment} post_id={post_id as string}/>
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