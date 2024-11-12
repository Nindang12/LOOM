"use client"

import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";
import Following from "@/components/Following";
import Article from "@/components/Article";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/contants";
import { getUserId } from "@/utils/auth";

export default function LikedPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(10);
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='));
      if (!token) {
        router.push('/login');
      } else {
        const currentUserId = getUserId();
        setUserId(currentUserId);
      }
    };
    checkLoginStatus();
  }, [router]);

  const query = {
    actionLikePost: {
      $: {
        where: {
          userId: userId
        }
      }
    }
  };

  const { data: likedPostsData } = db.useQuery(query);

  const queryPosts = {
    posts: {
      $: {
        where: {
          postId: likedPostsData?.actionLikePost?.map((like: any) => like.postId)
        }
      }
    }
  };
  const { data: postsData } = db.useQuery(queryPosts);

  useEffect(() => {
    if (postsData?.posts && likedPostsData?.actionLikePost) {
      const likedPostsWithDetails = postsData.posts.filter((post: any) =>
        likedPostsData.actionLikePost.some((like: any) => like.postId === post.postId)
      );
      setLikedPosts(likedPostsWithDetails);
    }
  }, [postsData, likedPostsData]);

  return ( 
    <div className="flex md:flex-row bg-[rgb(250,250,250)] flex-col-reverse overflow-hidden h-screen">
      <div className="md:w-auto w-full">
        <Siderbar/>
      </div>
      <div className="flex flex-col md:flex-row justify-center w-full h-screen overflow-hidden">
        <div className="max-w-screen-sm w-full">
          <div className="hidden md:block">
            <Header />
          </div>
          <div className="flex flex-col border bg-white border-gray-300 rounded-xl h-[calc(100vh-60px)] overflow-y-auto">
            <div className="sticky top-0">
              <div className="hidden md:block bg-white z-20">
                <UploadThread />
              </div>
              <div className="md:hidden">
                <Following />
              </div>
            </div>
            <div className="overflow-y-auto">
              {likedPosts.slice(0, visiblePosts).map((post:any, idx:number) => (
                <div 
                  key={idx}
                  ref={idx === likedPosts.slice(0, visiblePosts).length - 1 ? (node) => {
                    if (node) {
                      const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && visiblePosts < likedPosts.length) {
                          setTimeout(() => {
                            setVisiblePosts(prev => prev + 10);
                          }, 1000); // Delay 1 second before loading more
                        }
                      });
                      observer.observe(node);
                      return () => observer.disconnect();
                    }
                  } : null}
                >
                  <Article 
                    user_id={post.userId} 
                    postId={post.postId} 
                    content={post.content} 
                    images={post.images} 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
