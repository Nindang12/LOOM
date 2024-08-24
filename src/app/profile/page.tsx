import HeaderProfile from "@/components/HeaderProfile";
import HeaderSearch from "@/components/HeaderSearch";
import Siderbar from "@/components/Sidebar"

export default function Home() {
    return (
      <div className="flex flex-row overflow-hidden h-screen">
        <Siderbar/>
        <div className="flex flex-row justify-center mt-2 w-full">
          <div className="max-w-screen-sm w-full h-screen">
            <HeaderProfile/>
            <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll f">
                <div className="w-full h-[80px]">
                    {/* <UploadThread/> */}
                </div>
                <div className="w-full h-full">
                  <div >
                    {/* <Article/> */}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }