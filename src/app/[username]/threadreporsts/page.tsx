"use client"
import ProfileLayout from "@/components/ProfileLayoutProps";
import Threadsreporsts from "@/components/threadreporsts";
import RowThreadsreposts from "@/components/RowThreadsreporst";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { checkLogin } from "@/utils/auth";
import { db } from "@/utils/contants";

export default function ThreadReporsts() {
  const router = useRouter();
  const pathName = usePathname();
  const username = pathName.replace("/@", "").replace("/threadreporsts", "");

  useEffect(() => {
    const checkAuthStatus = async () => {
      const loggedInUserId = await checkLogin();
      if (!loggedInUserId) {
        router.push("/login");
      }
    };

    checkAuthStatus();
  }, [router]);

  const query = {
    userDetails: {
      $: {
        where: {
          userId: username
        }
      }
    }
  }

  const {data, isLoading} = db.useQuery(query)

  const queryReposts = {
    posts: {
      $: {
        where: {
          userId: username
        },
        order: {
          serverCreatedAt: "desc" as const
        }
      }
    }
  }
  const { data: dataReposts } = db.useQuery(queryReposts)

  const filterPost = dataReposts?.posts.filter((post:any) => post?.repost)

  console.log(filterPost)

  return (
    <ProfileLayout username={data?.userDetails[0].userId} fullname={data?.userDetails[0].fullname} image={data?.userDetails[0].avatar}>
      <RowThreadsreposts />
      <div className="w-max-[630px] flex justify-center h-auto t-0 ml-[20px] mr-[20px] flex-col gap-2">
        {filterPost?.map((data: any) => (
          <Threadsreporsts
            key={data.repost}
            user_id={data.userId}
            content={data.content}
            postId={data.repost}
            repostedBy={username}
            images={data.images}
          />
        ))}
      </div>
    </ProfileLayout>
  );
}
