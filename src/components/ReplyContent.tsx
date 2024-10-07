import { useEffect, useState } from "react";
import ContentCommentReply from "./ContentCommentReply";
import { getUserId } from "@/utils/auth";
import { db } from "@/utils/contants";
import { id, tx } from "@instantdb/react";
import { toast } from "react-toastify";

const ReplyContent = ({post, comment}: {post: Post, comment: Comment}) => {
    const [commentContent, setCommentContent] = useState<string|null>(null);
    const [isReposted, setIsReposted] = useState(false);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [shareCount, setShareCount] = useState(0);
    const [timeAgoRepost, setTimeAgoRepost] = useState<string>('');

    const userAccountId = getUserId()

    const query = { actionLikePost: {} }
    const { data } = db.useQuery(query)

    const queryCheckIsLiked = { actionLikePost:{
        $:{
            where:{
                postId:post.postId,
                userId:userAccountId
            }
        }
    }};
    const { data: dataCheckIsLiked } = db.useQuery(queryCheckIsLiked);

    const queryComments = { comments: {} }
    const { data: dataComments } = db.useQuery(queryComments)

    const queryShares = { shares: {} }
    const { data: dataShares } = db.useQuery(queryShares)

    const queryPosts = { posts: {} }
    const { data: dataPosts } = db.useQuery(queryPosts)

    //console.log(dataFriendships)
    const totalLikes = data?.actionLikePost.filter(
        (like: any) => like.postId === post.postId
    ).length || 0;

    const totalShares = dataShares?.shares.filter(
        (share: any) => share.postId === post.postId
    ).length || 0;

    const totalComments = dataComments?.comments.filter(
        (comment: any) => comment.postId === post.postId
    ).length || 0;

    const totalReposts = dataPosts?.posts.filter(
        (post: any) => post.repost === post.postId
    ).length || 0;

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newImages: string[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                newImages.push(reader.result as string);
                if (newImages.length === files.length) {
                    setUploadedImages(prevImages => [...prevImages, ...newImages]);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleLike = async () => {
        if (!userAccountId) return; // Ensure user is logged in
        // Check if the user has already liked this post
        const isUserLiked = data?.actionLikePost.some(
            (like: any) => like.postId === post.postId && like.userId === userAccountId
        );
        const actionLikePostId = data?.actionLikePost.find(
            (like: any) => like.postId === post.postId && like.userId === userAccountId 
        )?.id;
        try {
            if (isUserLiked) {
                setIsLiked(false);
                db.transact([tx.actionLikePost[actionLikePostId as string].delete()]);
            } else {
                db.transact([tx.actionLikePost[id()].update(
                    { 
                        postId: post.postId,
                        userId: userAccountId,
                        createdAt: new Date().getTime()
                    }
                )]);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };


    const createComment = async () => {
        if (!post.postId || !userAccountId || !commentContent) return;

        try {
            const commentId = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact([tx.comments[id()].update(
                { 
                    commentId: commentId,
                    postId: post.postId,
                    userId: userAccountId,
                    content: commentContent,
                    createdAt: new Date().getTime(),
                    images: uploadedImages
                }
            )]);
            toast.success('Comment created successfully');
            setCommentContent('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const checkIsLiked = async () => {
        if (!userAccountId || !post.postId) return;
    
        try {
            if (dataCheckIsLiked && dataCheckIsLiked.actionLikePost && dataCheckIsLiked.actionLikePost.length > 0) {
                setIsLiked(true);
            } else {
                setIsLiked(false);
            }
        } catch (error) {
            console.error('Error checking if post is liked:', error);
        }
    };
    

    const handleRepost = async () => {
        if (!userAccountId || !post.postId || !post.content) return;

        try {
            const existingRepost = dataPosts?.posts.find(
                (post: any) => post.repost === post.postId && post.userId === userAccountId
            );

            if (existingRepost) {
                // If the post is already reposted, remove the repost
                try {
                    db.transact([tx.posts[existingRepost.id].delete()]);
                    setIsReposted(false);
                    return; // Exit the function early
                } catch (error) {
                    console.error('Error removing repost:', error);
                    return; // Exit the function early
                }
            }
            const post_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact(
                [tx.posts[id()].update(
                    { 
                        userId: userAccountId,
                        postId: post_id,
                        content: post.content,
                        images: post.images,  // Change this line
                        createdAt: new Date().getTime(),
                        repost: post.postId
                    }
                )]
            );
            setIsReposted(true);
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    
    const checkIsReposted = () => {
        if (!userAccountId || !post.postId) return;
    
        try {
            // Check if the post is already reposted by the user
            
            const userRepost = dataPosts?.posts.find(
                (post: any) => post.repost === post.postId && post.userId === userAccountId
            );
            
            if (userRepost) {
                setIsReposted(true);
            } else {
                setIsReposted(false);
            }
        } catch (error) {
            console.error('Error checking if post is reposted:', error);
        }
    };
    

    const handleShare = () => {
        if (!userAccountId || !post.postId) return;

        try {
            // Check if the post is already shared by the user
            const isShared = dataShares?.shares.some(
                (share: any) => share.postId === post.postId && share.userId === userAccountId
            );

            if (isShared) {
                // If already shared, remove the share
                const shareToRemove = dataShares?.shares.find(
                    (share: any) => share.postId === post.postId && share.userId === userAccountId
                );
                if (shareToRemove) {
                    db.transact([tx.shares[shareToRemove.id].delete()]);
                    setShareCount(prevCount => prevCount - 1);
                    return; // Exit the function early
                }
            }
            else{
                db.transact(
                    [tx.shares[id()].update(
                        { 
                            userId: userAccountId,
                            postId: post.postId,
                            createdAt: new Date().getTime(),
                        }
                    )]
                );
                setShareCount(prevCount => prevCount + 1);
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    const calculateTimeAgoRepost = (createdAt: number) => {
        const now = new Date().getTime();
        const diffInSeconds = Math.floor((now - createdAt) / 1000);
        
        if (diffInSeconds < 60) return `${diffInSeconds}s`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)}w`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo`;
        return `${Math.floor(diffInSeconds / 31536000)}y`;
    };

    useEffect(() => {
        checkIsReposted();
        checkIsLiked();
        // Initialize shareCount
        const initialShareCount = dataShares?.shares.filter(
            (share: any) => share.postId === post.postId
        ).length || 0;
        setShareCount(initialShareCount);
    }, [post.postId, userAccountId, dataShares, dataPosts]);

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(post.createdAt)) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgoRepost(`${diffInSeconds} giây`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgoRepost(`${minutes} phút`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgoRepost(`${hours} giờ`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setTimeAgoRepost(`${days} ngày`);
            }
        };
        calculateTimeAgo();
        const timer = setInterval(calculateTimeAgo, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [post.createdAt]);

    return(
        <div className="relative w-full border-b border-gray-400 px-4">
            {/* {post.repost && (
                <div className="text-sm text-gray-500 mb-2">
                    You reposted {timeAgoRepost} ago
                </div>
            )} */}
            <div className="flex items-start mb-4">
                <img src="https://placehold.co/40x40" alt="User profile picture" className="rounded-full w-10 h-10 mr-3"/>
                <div className="flex-1 overflow-hidden">
                    <div className="flex items-center mb-1">
                        <span className="font-bold mr-2">{post.userId}</span>
                        <span className="text-gray-500 text-sm">{timeAgoRepost}</span>
                    </div>
                    <p className="w-[300px] md:min-w-[500px] md:max-w-[501px] break-words whitespace-pre-wrap">{post.content}</p>
                    {post.images.length > 0 && (
                        <div className="w-[300px] md:min-w-[500px] h-auto flex p-5 overflow-x-auto overflow-y-hidden gap-2">
                            <div className="flex overflow-x-auto overflow-y-hidden w-auto gap-2 pb-2">
                                {post.images.map((image:string, index:number) => (
                                    <div key={index} className="flex-shrink-0 w-64 h-64">
                                        <img src={image} alt={`image ${index + 1}`} className="object-cover w-full h-full rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex items-center text-sm gap-4">
                        <button onClick={handleLike} className="flex items-center gap-1 hover:bg-slate-100 p-2 rounded-full">
                            <img
                                width={20}
                                src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                alt={isLiked ? "redheart" : "heart"}
                            />
                            <span className={isLiked ? "text-red-600" : ""}>{totalLikes}</span>
                        </button>
                        <button onClick={() => setIsShow(prev => !prev)} className="flex items-center gap-1 hover:bg-slate-100 p-2 rounded-full">
                            <img width={20} src="/assets/comment.svg" alt="comment" />
                            <span>{totalComments}</span>
                        </button>
                        <button onClick={handleRepost} className={`flex items-center gap-1 hover:bg-slate-100 p-2 rounded-full ${isReposted ? "text-green-600" : ""}`}>
                            <img width={20} src={isReposted ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="repost" />
                            <span>{totalReposts}</span>
                        </button>
                        <button onClick={handleShare} className="flex items-center gap-1 hover:bg-slate-100 p-2 rounded-full">
                            <img width={20} src="/assets/share.svg" alt="share" />
                            <span>{shareCount}</span>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                {
                    
                    <ContentCommentReply  key={comment.commentId} {...comment} postId={post.postId as string}/>
                    
                }
            </div>
        </div>
    )
}

export default ReplyContent;