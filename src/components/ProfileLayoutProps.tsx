"use client"
import Siderbar from "@/components/Sidebar";
import HeaderProfile from "@/components/HeaderProfile";
import NameProfile from "@/components/NameProfile";
import Follower from "@/components/FollowerInProfile";
import EditProfile from "@/components/EditProfile";
import React from "react";

interface ProfileLayoutProps {
  username: string;
  fullname: string;
  children: React.ReactNode;
  image: string;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ username, fullname, children,image }) => {
  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar />
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderProfile />
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-[90vh] overflow-y-scroll">
            <div className="w-max-[630px] h-[80px] ml-[15px] mr-[15px]">
              <NameProfile username={username} fullname={fullname} image={image} />
            </div>
            <div className="w-max-[630px] h-[80px] ml-[15px] mr-[20px]">
              <Follower />
            </div>
            <div className="w-max-[630px] h-[90px] t-0">
              <EditProfile />
            </div>
            {/* Vùng nội dung đặc biệt */}
            <div className="w-max-[630px] h-full t-0 mr-[20px]">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileLayout;
