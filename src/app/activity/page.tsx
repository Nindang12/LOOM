"use client"
import ListActives from "@/components/ListActives";
import HeaderActivity from "@/components/HeaderActivity";
import Option_active from "@/components/OptionActive";
import Siderbar from "@/components/Sidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Home() {


  return (
    <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <HeaderActivity/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll f">
            <div className="w-full h-auto">
              <Option_active/> 
            </div>
            <div className="w-full h-full">
              <ListActives/>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}