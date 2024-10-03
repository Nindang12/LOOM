import { useEffect, useState } from "react";
import ThreadReply from "./ThreadReply";

export default function Threadsreplied({userId}:{userId:string}){
    const [comments, setComments] = useState<Comment[]>([]);

    const getCommentsForUser = async () => {
        if (!userId) return;

        try {
            const response = await fetch(`/api/comment/commentForUser?userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setComments(result.comments);
                //console.log(result.comments);
            } else {
                console.error('Failed to fetch comments for user');
            }
        } catch (error) {
            console.error('Error fetching comments for user:', error);
        }
    }

    

    useEffect(() => {
        getCommentsForUser();
    }, [userId]);

    return(
        <div className="flex flex-col gap-2 mt-4">
            {comments.map((comment) => (
                <ThreadReply key={comment.commentId} postId={comment.postId as string} comment={comment} />
            ))}
        </div>
    )
}