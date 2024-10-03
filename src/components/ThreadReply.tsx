import { useState, useEffect } from "react";
import ReplyContent from "./ReplyContent";
const ThreadReply = ({postId, comment}: {postId: string, comment: Comment}) => {
    const [post, setPost] = useState<Post[]>([]);
    const getPostForPostId = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/post/postForPostId?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setPost(result.posts);
                //console.log(result.posts);
            } else {
                console.error('Failed to fetch post for post ID');
            }
        } catch (error) {
            console.error('Error fetching post for post ID:', error);
        }
    }


    useEffect(() => {
        getPostForPostId();
    }, [postId]);

    return(
        <div>
            {post.map((post) => (
                <ReplyContent post={post} comment={comment} />
            ))}
        </div>
    )
}

export default ThreadReply;