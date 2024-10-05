import { useEffect, useState } from "react";
import ThreadReply from "./ThreadReply";
import { db } from "@/utils/contants";

export default function Threadsreplied({userId}:{userId:string}){
    const query = {
        comments: {
            $: {
                where: {
                    userId: userId
                }
            }
        }
    }
    
    const {data, isLoading} = db.useQuery(query)

    //console.log(data)

    return(
        <div className="flex flex-col gap-2 mt-4">
            {data?.comments.map((comment: any) => (
                <ThreadReply key={comment.id} postId={comment.postId} comment={comment as Comment} />
            ))}
        </div>
    )
}