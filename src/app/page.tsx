"use client"

import Siderbar from "@/components/Sidebar";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/Article";
import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { checkLogin, getUserId } from "@/utils/auth";
import { db } from "@/utils/contants";
import Link from "next/link";
import { tx } from "@instantdb/react";
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [currentUser, setCurrentUser] = useState<string|null>(null)
  const [isShow, setIsShow] = useState<boolean>(false);
  const router = useRouter()


  useEffect(() => {
    if(typeof window !== 'undefined'){
      const userId = getUserId()
      setCurrentUser(userId)
    }
  }, [currentUser]);

  const queryUser = {
    userDetails: {
      $: {
        where: { userId: currentUser },
      }
    }
  }


  const { data: dataUser } = db.useQuery(queryUser)

  //console.log(dataUser)

  // const updateStatus =useCallback( async (status: 'online' | 'offline') => {
  //   if (dataUser) {
  //     try {
  //       await db.transact([tx.userDetails[dataUser?.userDetails[0].id].update({ 
  //         status: status
  //       })]);
  //       console.log('Status updated to', status);
  //     } catch (error) {
  //       console.error('Failed to update status:', error);
  //     }
  //   } else {
  //     console.warn('No user details found to update status');
  //   }
  // }, [dataUser]);

  // useEffect(() => {
  //   updateStatus('online');
  // }, [updateStatus]);

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
          setIsLoggedIn(loggedIn)
          if (!loggedIn) {
              router.push('/login');
          }
      };
      verifyLogin();
  }, [router]);


  const handleLogout = () => {
    setIsLoggedIn(false)
    router.push('/login')
  }

  if (!isLoggedIn) {
    return null
  }



  return (
    <div className="flex md:flex-row flex-col-reverse w-full bg-[rgb(250,250,250)] h-screen overflow-hidden">
        <Siderbar/>
      <div className="flex flex-row justify-center h-auto w-full overflow-hidden">
        <div className="max-w-screen-sm w-full h-screen overflow-hidden">
          <div className="hidden md:block">
              <Header/>
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
          <div className="flex flex-col bg-white border md:border md:border-gray-300 w-full rounded-2xl h-[calc(100vh-190px)] md:h-[calc(100vh-60px)] overflow-hidden">
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
