import { useState, useEffect } from "react";
import ReplyContent from "./ReplyContent";
import { db } from "@/utils/contants";
const ThreadReply = ({postId, comment}: {postId: string, comment: Comment}) => {
    
    const query = {
        posts: {
            $: {
                where: {
                    postId: postId
                }
            }
        }
    }
    
    const {data, isLoading} = db.useQuery(query)

    console.log(data)

    return(
        <div>
            {data?.posts.map((post: any) => (
                <ReplyContent post={post} comment={comment} />
            ))}
        </div>
    )
}

export default ThreadReply;