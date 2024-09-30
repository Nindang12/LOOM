"use client"

import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/Article";
import React, { useEffect, useState } from "react";
import Foryou from "@/components/Foryou";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Home() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([]);
  
  useEffect(() => {
    const checkLogin = () => {
      if (!sessionStorage.getItem("isLogin")) {
        router.push("/login")
      }
    }

    checkLogin()
  }, [router])

  const getAllPosts = async () => {
      try {
          const response = await axios.get("/api/postListAll");
          if (response.status === 200) {
              setPosts(response.data.posts);
          }
      } catch (error) {
          console.error("Error fetching posts:", error);
      }
  };

  useEffect(() => {
      getAllPosts();
  }, []);

  //console.log(posts)



  return (
    <div className=" flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
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
              <div className="w-full md:hidden  h-[80px] ">
                <Foryou/>
              </div>
              <div className="w-full  ">
                {
                  posts.map((post,idx)=>(
                    <Article key={idx} user_id={post.user_id} postId={post.post_id} content={post.post_content}/>
                  ))
                }
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
