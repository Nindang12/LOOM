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

export default function FollowingPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [followingPosts, setFollowingPosts] = useState<any[]>([]);
  const [visiblePosts, setVisiblePosts] = useState(10);


  const queryFollowing = {
    friendships: {
      $: {
        where: {
          userId: userId,
          isFollowing: true
        }
      }
    }
  };
  const { data: followingData } = db.useQuery(queryFollowing);

  const queryPosts = {
    posts: {
      $: {
        where: {
          userId: followingData?.friendships?.map((friendship: any) => friendship.friendId)
        }
      }
    }
  };
  const { data: postsData } = db.useQuery(queryPosts);

  useEffect(() => {
    if (postsData?.posts && followingData?.friendships) {
      const followingUserIds = new Set(followingData.friendships.map((friendship: any) => friendship.friendId));
      const filteredPosts = postsData.posts.filter((post: any) => followingUserIds.has(post.userId));
      setFollowingPosts(filteredPosts);
    }
  }, [postsData, followingData]);

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
            <div className="sticky top-0 z-20">
              <div className="hidden md:block">
                <UploadThread />
              </div>
              <div className="md:hidden">
                <Following />
              </div>
            </div>
            <div className="w-full overflow-y-auto">
              {followingPosts.slice(0, visiblePosts).map((post:any, idx:number) => (
                <div 
                  key={idx}
                  ref={idx === followingPosts.slice(0, visiblePosts).length - 1 ? (node) => {
                    if (node) {
                      const observer = new IntersectionObserver((entries) => {
                        if (entries[0].isIntersecting && visiblePosts < followingPosts.length) {
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
