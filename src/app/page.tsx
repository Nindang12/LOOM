"use client"

import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import Foryou from "@/components/Foryou";
import { useRouter } from "next/navigation";
import axios from "axios";
import { checkLogin } from "@/utils/auth";
import { db } from "@/utils/contants";

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


  //console.log(data)
  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <div className="">
        <Siderbar/>
      </div>
      <div className="flex flex-row justify-center mt-2 w-full ">
        <div className="max-w-screen-sm w-full h-screen">
          <Header/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10  h-[90vh] overflow-y-scroll f">
              <div className="w-full hidden md:block  h-[80px]">
                  <UploadThread/>
              </div>
              <div className="w-full md:hidden h-[180px]">
                <Foryou/>
              </div>
              <div className="w-full relative">
                {filterPost &&
                  (filterPost.map((post:any, idx:number) => (
                    <Article key={idx} user_id={post.userId} postId={post.postId} content={post.content} images={post.images} />
                  )))
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
