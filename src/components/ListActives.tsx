"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getUserId } from "@/utils/auth"
import { db } from "@/utils/contants"
import { tx, id } from "@instantdb/react"
import Active from "./Active"

export default function ListActives() {
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setCurrentUserId(userId as string);
        }
    }, [])

    const query = {
        friendships: {
            $: {
                where: {
                    and: [
                        { friendId: currentUserId }
                    ]
                }
            }
        }
    }
    const { data } = db.useQuery(query)
    

    return (
        <div className="flex flex-col gap-3">
            {data?.friendships.map((request) => (
                <Active request={request} currentUserId={currentUserId as string}/>
            ))}
        </div>
    )
}