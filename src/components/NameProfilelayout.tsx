import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, {  useEffect, useState } from "react";
import NameProfile from "./NameProfile";
export default function NameProfilelayout(){
    const router = useRouter()
    const pathName = usePathname();
    const username = pathName.replace("/@","")
    const [dataAccounts,setDataAccounts] = useState<any>([])
    const loadProfile = async()=>{
        try {
            const res = await axios.post("/api/account/",{
                username
            },{
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.data
            //console.log(data)
            setDataAccounts(data[0])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(()=>{
      loadProfile()
    },[])
    return(
        
        <div className="w-max-[630px] h-[80px] ml-[15px] mr-[15px]">
                    {
                      dataAccounts&&(
                            <NameProfile username={dataAccounts.user_id} fullname={dataAccounts.fullname}/>
                        )
                    }
                </div>
    )
}