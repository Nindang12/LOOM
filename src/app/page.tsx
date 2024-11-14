"use client"

import Siderbar from "@/components/Sidebar";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { db } from "@/utils/contants";
import Link from "next/link";
import { checkLogin } from "@/utils/auth";

export default function Home() {
  const [visiblePosts, setVisiblePosts] = useState(10);
  const [isLogin, setIsLogin] = useState<boolean>(true);
  
  useEffect(() => {
    const verifyLogin = () => {
      const loggedIn = checkLogin()
      setIsLogin(loggedIn)
    };
    verifyLogin();
  }, []);

  const query = {
    posts: {
      $: {
        order: {
          serverCreatedAt: "desc" as const
        }
      }
    }
  }
  const { data,isLoading } = db.useQuery(query)

  const filterPost = data?.posts.filter((post:any) => !post?.repost)




  return (
    <div className="flex md:flex-row flex-col-reverse w-full bg-[rgb(250,250,250)] h-screen overflow-hidden">
        <Siderbar/>
      <div className="flex flex-row justify-center h-auto w-full overflow-hidden relative">
        <div className="max-w-screen-sm w-full h-screen overflow-hidden">
          <div className="hidden md:block">
              <Header/>
          </div>
          <div className="absolute top-2 right-5">
          {
            !isLogin&&(
              <Link href={'/login'}>
                <button className="h-full bg-black p-2 px-4 rounded-lg text-white w-26 text-sm">
                  Đăng Nhập
                </button>
              </Link>
            )
          }
          </div>
          <div className="w-full md:hidden sticky top-0 bg-white z-10">
            <div className="flex flex-col items-center">
              <div className="flex flex-row justify-between items-center w-full px-4 py-2">
                <div></div>
                <Link href={'/'}>
                  <img width={40} src="/loom.png" alt="logoT" className="h-8" />
                </Link>
                {
                  !isLogin &&(
                    <Link href={'/login'}>
                      <button className="h-full bg-black p-2 px-4 rounded-lg text-white w-26 text-sm">
                        Đăng Nhập
                      </button>
                    </Link>
                  )
                }
              </div>
              <div className="flex w-full border-b border-gray-200">
                <Link href={'/'} className="w-1/2">
                  <button className="w-full text-sm font-semibold py-3 border-b-2 border-black">
                    Dành cho bạn
                  </button>
                </Link>
                <Link href={'/following'} className="w-1/2">
                  <button className="w-full text-sm font-semibold py-3 text-gray-400 border-b-2 border-transparent">
                    Đang theo dõi
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white border md:border md:border-gray-300 w-full rounded-2xl h-[calc(100vh-190px)] md:h-[calc(100vh-60px)] overflow-hidden">
            <div className="w-full hidden md:block sticky top-0 z-20">
              <UploadThread/>
            </div>
            <div className="w-full overflow-y-auto">
              {filterPost && filterPost.slice(0, visiblePosts).map((post:any, idx:number) => (
                <div 
                  key={idx}
                  ref={idx === filterPost.slice(0, visiblePosts).length - 1 ? (node) => {
                    if (node) {
                      const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && visiblePosts < filterPost.length) {
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
