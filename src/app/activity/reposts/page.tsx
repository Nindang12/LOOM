import Activereporsts from "@/components/ActiveReposts";
import HeaderActivity from "@/components/HeaderActivity";
import Option_active_reposts from "@/components/OptionActivereposts";
import Siderbar from "@/components/Sidebar"

export default function Home() {
    return (
      <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
        <Siderbar/>
        <div className="flex flex-row justify-center mt-2 w-full">
          <div className="max-w-screen-sm w-full h-screen">
            <HeaderActivity/>
            <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll f">
                <div className="w-full h-auto">
                  <Option_active_reposts/> 
                </div>
                <div className="w-full h-full flex flex-col justify-center items-center">
                  <div >
                    <Activereporsts/>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }