"use client"

import Siderbar from "@/components/Sidebar";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import Foryou from "@/components/Foryou";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/auth";
import { db } from "@/utils/contants";
import Link from "next/link";
export default function Home() {
  const router = useRouter()

  const query = {
    posts: {
      $: {
        order: {
          serverCreatedAt: "desc" as const
        }
      }
    }
  }
  const { data } = db.useQuery(query)

  const filterPost = data?.posts.filter((post:any) => !post?.repost)


  useEffect(() => {
      const verifyLogin = async () => {
          const loggedIn = await checkLogin();
          if (!loggedIn) {
              router.push('/login');
          }
      };
      verifyLogin();
  }, [router]);
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [isShow, setIsShow] = useState<boolean>(false);

  const listButton = ["Dành cho bạn","Đã thích","Đã theo dõi","Đang theo dõi"]

  //console.log(data)
  return (
    <div className="flex md:flex-row flex-col-reverse w-full bg-[rgb(250,250,250)] h-screen overflow-hidden">
        <Siderbar/>
      <div className="flex flex-row justify-center h-auto w-full overflow-hidden">
        <div className="max-w-screen-sm w-full h-screen overflow-hidden">
          <div className="hidden md:block">
              <div className="flex flex-row justify-between w-full my-5 h-8 items-center gap-2 relative">
                  <div className="flex flex-row gap-2 items-center justify-center w-full">
                      <span className="font-medium">{listButton[currentIndex]}</span>
                      <button onClick={() => setIsShow((prev) => !prev)} className="rounded-full h-5 bg-white border border-gray-300 shadow-sm p-1">
                          <img width={10} src="/assets/arrow-down.svg" alt="icon" />
                      </button>
                      {isShow && (
                          <div className="absolute flex flex-col gap-1 shadow-md top-8 p-4 px-2 w-64 h-auto rounded-lg bg-white border border-gray-200 z-50">
                              {listButton.map((item: string, index: number) => (
                                  <button
                                      onClick={() => {
                                          setCurrentIndex(index);
                                          setIsShow(false);
                                      }}
                                      key={index}
                                      className="flex flex-row justify-between hover:bg-slate-200 px-2 py-3 rounded-lg"
                                  >
                                      <span>{item}</span>
                                      {currentIndex === index && (
                                          <img width={18} src="/assets/check.svg" alt="icon" />
                                      )}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>
          <div className="w-full md:hidden top-0 bg-white z-10">
            <div className="flex flex-col items-center">
              <Link href={'/'}>
                <button className="mt-2 mb-4">
                  <img width={60} src="/assets/logowhite.png" alt="" />
                </button>
              </Link>
              <div className="flex w-full border-b border-gray-200">
                <Link href={'/'} className="w-1/2">
                  <button className="w-full text-sm font-bold py-3 border-b-2 border-black">
                    Dành cho bạn
                  </button>
                </Link>
                <Link href={'/following'} className="w-1/2">
                  <button className="w-full text-sm font-bold py-3 text-gray-400 border-b-2 border-transparent">
                    Đang theo dõi
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-white border md:border md:border-gray-300 w-full rounded-2xl md:mt-2 h-[490px] md:h-[calc(100vh-60px)]">
            <div className="w-full hidden md:block sticky top-0 z-20">
              <UploadThread/>
            </div>
            <div className="w-full overflow-y-auto">
              {filterPost && filterPost.map((post:any, idx:number) => (
                <Article key={idx} user_id={post.userId} postId={post.postId} content={post.content} images={post.images} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
