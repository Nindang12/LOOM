"use client"

import Siderbar from "@/components/Sidebar";
import { usePathname } from "next/navigation";

export default function Profile(){
    const router = usePathname();
    const username = router.replace("/","")
    console.log(router.replace("/",""))
    return(
        <div className="flex flex-row">
            <Siderbar/>
        </div>
    )
}   