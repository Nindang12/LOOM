"use client"
import Siderbar from "@/components/Sidebar";
import HeaderProfile from "@/components/HeaderProfile";
import NameProfile from "@/components/NameProfile";
import EditProfile from "@/components/EditProfile";
import React, { useEffect, useState } from "react";
import { getUserId } from "@/utils/auth";
import { db } from "@/utils/contants";
import Link from "next/link";

interface ProfileLayoutProps {
  username: string;
  fullname: string;
  children: React.ReactNode;
  image: string;
  bio?: string;
  link?: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ username, fullname, children,image,bio,link }) => {

  const [currentUserId, setCurrentUserId] = useState<string|null>(null)

  useEffect(() => {
    if(typeof window !== 'undefined'){
      setCurrentUserId(getUserId())
    }
  }, []);

  const queryFollowedOfUser = {
    friendships: {
        $: {
            where: {
                userId: username,
                isFollowing: true,
            }
        }
    }
  }
  const { data: dataFollowedOfUser } = db.useQuery(queryFollowedOfUser)

  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar />
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderProfile />
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-[90vh] overflow-y-scroll">
            <div className="w-max-[630px] ml-[15px] mr-[15px] flex flex-col gap-4">
              <NameProfile username={username} fullname={fullname} image={image} />
              {
                bio && (
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-400">{bio}</span>
                  </div>
                )
              }
              {
                link && (
                  <Link target="_blank" href={link} className="text-sm text-gray-400 hover:underline">{link}</Link>
                )
              }
            </div>
            <div className="w-max-[630px] ml-[15px] mr-[20px]">
              <div className="flex items-center justify-between mt-[40px]">
                <span className="text-sm text-gray-400">{dataFollowedOfUser?.friendships?.length} người theo dõi</span>
                <button>
                  <img width={30} src="/assets/insta.svg" alt="" />
                </button>
              </div>
            </div>

            
              {
                currentUserId === username && (
                  <div className="w-max-[630px]">
                    <EditProfile />
                  </div>
                )
              }
            {/* Vùng nội dung đặc biệt */}
            <div className="w-max-[630px] h-full t-0 mr-[20px] mt-5">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
