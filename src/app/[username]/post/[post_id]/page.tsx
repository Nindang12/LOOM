"use client"

import Siderbar from "@/components/Sidebar";
import React, { useEffect,useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ArticleViewPost from "@/components/ArticleViewPost";
import ContentComment from "@/components/ContentComment";
import HeaderViewPost from "@/components/HeaderViewPost";
export default function ViewPost(){
  
    const router = useRouter()
  
    useEffect(()=>{
      if(!sessionStorage.getItem("isLogin")){
        router.push("/login")
      }
    },[])

    const {post_id,username} = useParams()

    const [post, setPost] = useState<Post>();

    useEffect(() => {
        const fetchPost = async () => {
            if (post_id && username) {
                try {
                    const response = await fetch(`/api/post?postId=${post_id}&userId=${username.toString().replace("%40","")}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.posts && data.posts.length > 0) {
                            setPost(data.posts[0]);
                        }
                    } else {
                        console.error('Failed to fetch post');
                    }
                } catch (error) {
                    console.error('Error fetching post:', error);
                }
            }
        };

        fetchPost();
    }, [post_id, username]);

    
    const [comments, setComments] = useState<Comment[]>([]);

    const fetchComments = async () => {
        if (post_id) {
            try {
                const response = await fetch(`/api/comment?postId=${post_id}`);
                if (response.ok) {
                    const data = await response.json();
                    setComments(data.comments);
                } else {
                    console.error('Failed to fetch comments');
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        }
    };

    useEffect(() => {
        fetchComments();
    }, [post_id]);

    //console.log(comments)
    return (
        <div className=" flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
        <div className="">
            <Siderbar/>
        </div>
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
                                comments.map((comment)=>(
                                    <ContentComment  key={comment.comment_id} {...comment} post_id={post_id as string}/>
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