import EditProfile from "@/components/EditProfile";
import Follower from "@/components/FollowerInProfile";
import HeaderProfile from "@/components/HeaderProfile";
import NameProfile from "@/components/NameProfile";
import Siderbar from "@/components/Sidebar"
import RowThreadsreporsts from "@/components/RowThreadsreporst";
import Threadsreporsts from "@/components/threadreporsts";

export default function Home() {
    return (
      <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
        <Siderbar/>
        <div className="flex flex-row justify-center mt-2 w-full">
          <div className="max-w-screen-sm w-full h-screen">
            <HeaderProfile />
            <div className="flex flex-col border border-gray-300 w-full  rounded-xl mt-10 h-screen overflow-y-scroll ">
                <div className="w-max-[630px] h-[80px] ml-[15px] mr-[15px]">
                    <NameProfile/>
                </div>
                <div className="w-max-[630px] h-[80px] ml-[15px] mr-[20px]  ">
                    <Follower/>
                </div>
                <div className="w-max-[630px] h-[90px] t-0">
                  <EditProfile/>
                </div>
                <div className="w-max-[630px] h-[80px] t-0">
                  <RowThreadsreporsts/>
                </div>
                <div className="w-max-[630px] flex items-center justify-center h-full t-0 ml-[20px] mr-[20px]">
                  <Threadsreporsts/>
                </div>

            </div>
          </div>
        </div>
      </div>
    );
  }