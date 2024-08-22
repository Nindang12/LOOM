import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";

export default function Home() {
  return (
    <div className="flex flex-row overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <Header/>
          <div className="border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll">
              <div className="w-full h-[120vh]">
                  <UploadThread/>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
