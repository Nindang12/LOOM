"use client"
import { getUserId } from "@/utils/auth";
import Link from "next/link"
import { useEffect, useState } from "react"
import { db } from "@/utils/contants";
import { tx,id } from "@instantdb/react";
import LexicalEditor from "./LexicalEditor";

export default function ContentComment({
    content,
    commentId,
    createdAt,
    userId,
    images,
    className,
    commentParentId
}: any) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [commentReply, setCommentReply] = useState<string>('');
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [localLikeCount, setLocalLikeCount] = useState<number>(0);
    const [totalReplies, setTotalReplies] = useState(0);
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [userAccountId, setUserAccountId] = useState<string | null>(null);
    const [isShowReply, setIsShowReply] = useState<boolean>(false);
    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserAccountId(userId as string);
        }
    }, [])

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    const queryCommentChild = {
        comments:{
            $:{
                where:{
                    replyTo: commentId
                }
            }
        }
        
    }

    const {data: commentChild} = db.useQuery(queryCommentChild)

    //console.log("commentchild",commentChild)

    const {data:existingLike} = db.useQuery({
        actionLikeComment: {
            $: {
                where: {
                    commentId: commentId,
                    userId: userAccountId
                }
            }
        }
    });
    const { data:replies } = db.useQuery({
        comments: {
            $: {
                where: {
                    userId: userAccountId,
                    replyTo: commentId
                }
            }
        }
    });

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(createdAt)) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgo(`${diffInSeconds} giây`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgo(`${minutes} phút`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgo(`${hours} giờ`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setTimeAgo(`${days} ngày`);
            }
        };

        calculateTimeAgo();
        const timer = setInterval(calculateTimeAgo, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [createdAt]);
    
    const query = { actionLikeComment: {
    } }
    const { data } = db.useQuery(query)

    const filterData = data?.actionLikeComment?.filter((item:any)=>item.commentId&&item.commentId==commentId)

    const handleLike = async () => {
        if (!userAccountId || !commentId) return; // Ensure user is logged in and commentId exists

        try {
            const isUserLiked = filterData?.some(
                (like: any) => like.commentId === commentId && like.userId === userAccountId
            );
            const actionLikeCommentId = filterData?.find(
                (like: any) => like.commentId === commentId && like.userId === userAccountId
            )?.id;

            if (isUserLiked && actionLikeCommentId) {
                setIsLiked(false);
                db.transact([tx.actionLikeComment[actionLikeCommentId].delete()]);
            } else {
                db.transact([tx.actionLikeComment[id()].update(
                    {
                        commentId: commentId,
                        userId: userAccountId,
                        createdAt: new Date().getTime()
                    }
                )]);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error liking/unliking comment:', error);
        }
    };
    const queryCheckIsLiked = {
        actionLikeComment: {
            $: {
                where: {
                    userId: userAccountId,
                    commentId: commentId,
                }
            }
        }
    };
    const queryPosts = { posts: {} }
    const { data: dataPosts } = db.useQuery(queryPosts)
    const handleRepost = async () => {
        if (!userId || !commentId || !content) return;

        try {
            const existingRepost = dataPosts?.posts.find(
                (comment: any) => comment.repost === commentId && comment.userId === userAccountId
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
            const comment_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact(
                [tx.posts[id()].update(
                    {
                        userId: userAccountId,
                        commentId: comment_id,
                        content: content,
                        images: images,  // Change this line
                        createdAt: new Date().getTime(),
                        repost: commentId
                    }
                )]
            );
            setIsReposted(true);
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    const queryShares = { shares: {} }
    const { data: dataShares } = db.useQuery(queryShares)
    const [shareCount, setShareCount] = useState<number>(0);
    const handleShare = () => {
        if (!userId || !commentId) return;

        try {
            // Check if the post is already shared by the user
            const isShared = dataShares?.shares.some(
                (share: any) => share.commentId === commentId && share.userId === userId
            );

            if (isShared) {
                // If already shared, remove the share
                const shareToRemove = dataShares?.shares.find(
                    (share: any) => share.commentId === commentId && share.userId === userId
                );
                if (shareToRemove) {
                    db.transact([tx.shares[shareToRemove.id].delete()]);
                    setShareCount(shareCount - 1);
                    return; // Exit the function early
                }
            }
            else {
                db.transact(
                    [tx.shares[id()].update(
                        {
                            userId: userAccountId,
                            commentId: commentId,
                            createdAt: new Date().getTime(),
                        }
                    )]
                );
                setShareCount(shareCount + 1);
            }
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };
    const queryComments = { comments: {} }
    const { data: dataComments } = db.useQuery(queryComments)
    //console.log(dataComments)
    const { data: dataCheckIsLiked } = db.useQuery(queryCheckIsLiked);
    const totalLikes = filterData?.filter(
        (like: any) => like.commentId === commentId
    ).length || 0;

    const totalShares = dataShares?.shares.filter(
        (share: any) => share.commentId === commentId
    ).length || 0;

    const totalComments = dataComments?.comments.filter(
        (comment: any) => comment.replyTo === commentId
    ).length || 0;

    const totalReposts = dataPosts?.posts.filter(
        (post: any) => post.repost === commentId
    ).length || 0;
    const queryReposts = {
        posts: {
            $: {
                where: {
                    repost: commentId,
                    userId: userAccountId
                }
            }
        }
    }

    const { data: dataReposts } = db.useQuery(queryReposts)

    
    const checkIsLiked = async () => {
        if (!userAccountId || !commentId) return;
    
        try {
            
            setIsLiked(Boolean(existingLike?.actionLikeComment?.length));
        } catch (error) {
            console.error('Error checking if comment is liked:', error);
        }
    };
    
    
    const checkIsReposted = async () => {
        if (!userAccountId || !commentId) return;
    
        try {
            setIsReposted(Boolean(replies?.comments?.length));
            setRepostCount(replies?.comments?.length || 0);
        } catch (error) {
            console.error('Error checking if comment is re-replied:', error);
        }
    };
    

    useEffect(() => {
        checkIsLiked();
        checkIsReposted();
    }, [commentId, userId]);
    
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
    const createCommentReply = async () => {
        if (!commentId || !userAccountId || !commentReply) return;

        try {
            const replyId = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact([tx.comments[id()].update(
                {
                    commentId: replyId,
                    replyTo: commentId,
                    userId: userAccountId,
                    content: commentReply,
                    createdAt: new Date().getTime(),
                    images: uploadedImages
                }
            )]);
            // toast.success('Reply created successfully');
            setCommentReply('');
            toggleModal();
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    };
    const queryUserDetails = {
        userDetails: {
            $: {
                where: {
                    userId: userId
                }
            }
        }
    }
    const { data: dataUserDetails } = db.useQuery(queryUserDetails)

    const queryCurrentUserDetails = {
        userDetails: {
            $: {
                where: {
                    userId: userAccountId
                }
            }
        }
    }
    const { data: dataCurrentUserDetails } = db.useQuery(queryCurrentUserDetails)

    const queryIsFollowing = {
        friendships: {
            $: {
                where: {
                    userId: userId,
                    isFollowing: true,
                    friendId: userId
                }
            }
        }
    }
    const { data: dataIsFollowing } = db.useQuery(queryIsFollowing)
    const queryFriendships = {
        friendships: {
            $: {
                where: {
                    friendId: userId,
                    isFriend: true,
                    userId: userAccountId
                },
            },
        },
    }
    const [isFriendAdded, setIsFriendAdded] = useState(false);

    const addFriend = async (userId: string, friendId: string) => {
        if (!userId || !friendId || isFriendAdded) return;

        try {
            db.transact([tx.friendships[id()].update(
                {
                    userId: userId,
                    friendId: friendId,
                    isFriend: false,
                    isPendingRequest: true,
                    isFollowing: true,
                    createdAt: Date.now()
                }
            )]);
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend');
        }
    };
    
    const handleAddFriend = (userId: string, friendId: string) => {
        if (!userId || !friendId || isFriendAdded) return;
        addFriend(userId, friendId);
        setIsFriendAdded(true);
    }

    const { data: dataFriendships } = db.useQuery(queryFriendships)
    return(
        <div>
            <div className={`${className}`}>
                {/* <header> */}
                <div className="flex flex-row items-start justify-between">
                    <div className="h-auto flex flex-row gap-2 mt-2 ml-5 min-h-[97px]">
                    <div className="relative flex-row w-8 h-8 justify-center flex-shrink-0">
                        {
                            dataUserDetails && dataUserDetails?.userDetails?.[0]?.avatar ? (
                                <img className="rounded-full w-8 h-8 bg-cover" src={dataUserDetails?.userDetails?.[0]?.avatar} alt="avatar" />
                            ) : (
                                <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                            )
                        }
                        {!isFriendAdded && userId !== userId && 
                            !dataFriendships?.friendships.length && 
                            !dataIsFollowing?.friendships?.length && (
                            <button
                                onClick={() => handleAddFriend(userId as string, userId as string)}
                                className="absolute top-5 right-[-1px] bg-white rounded-full shadow-md hover:bg-gray-100 p-1"
                            >
                                <img width={12} src="/assets/addfriend.svg" alt="Add friend" />
                            </button>
                        )}
                    </div>
                        <div className="h-full">
                            <div className="flex gap-2">
                                <Link href={`/@${userId}`} className="flex flex-row gap-2 font-bold text-sm">
                                    <span>{userId}</span>
                                    {
                                        commentParentId && (
                                            <div className="flex flex-row gap-2">
                                                <img width={10} src="/assets/arrow-right.svg" alt="arrow-right" />
                                                <span>{commentParentId}</span>
                                            </div>
                                        )
                                    }
                                </Link>
                                <span className="text-sm text-gray-400">{timeAgo}</span>
                            </div>
                            <div className="text-sm">
                                <p>{content}</p>
                            </div>
                            <div className="flex justify-center md:justify-start items-center text-sm font-thin gap-3   ">
                                <div className="flex gap-1">
                                    <button onClick={handleLike} className="hover:bg-slate-100 rounded-3xl">
                                        <img
                                            width={20}
                                            src={dataCheckIsLiked && dataCheckIsLiked?.actionLikeComment?.length > 0 ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                            alt={dataCheckIsLiked && dataCheckIsLiked?.actionLikeComment?.length > 0 ? "redheart" : "heart"}
                                        />
                                    </button>
                                    <small className={`${dataCheckIsLiked && dataCheckIsLiked?.actionLikeComment?.length > 0 ? "text-red-600" : ""}`}>{totalLikes}</small>
                                </div>
                                <button onClick={() => setIsShow((prv) => !prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
                                    <img width={20} src="/assets/comment.svg" alt="" />
                                    <small>{totalComments}</small>
                                </button>
                                <button onClick={handleRepost} className={`flex gap-1 hover:bg-slate-100 p-2 rounded-3xl ${dataReposts && dataReposts?.posts?.length > 0 ? "bg-opacity-50 hover:bg-green-100" : ""}`}>
                                    <img width={20} src={dataReposts && dataReposts?.posts?.length > 0 ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="" />
                                    <small className={`${dataReposts && dataReposts?.posts?.length > 0 ? "text-green-600" : ""}`}>{totalReposts}</small>
                                </button>
                                <button onClick={handleShare} className="flex gap-1 hover:bg-slate-100 p-1 rounded-3xl">
                                    <img width={30} src="/assets/share.svg" alt="" />
                                    <small>{totalShares}</small>
                                </button>
                            </div>
                            {commentChild?.comments && commentChild.comments.length > 0 && (
                                <div className="mb-2">
                                    <button 
                                        onClick={() => setIsShowReply(!isShowReply)}
                                        className="text-sm hover:underline"
                                    >
                                        {isShowReply ? 'Thu gọn' : 'Xem tất cả'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* reply comment */}
                {isShowReply && commentChild?.comments && (
                    commentChild.comments.map((comment: any, index: number) => (
                        <div className="flex flex-col gap-2 pl-5" key={index}>
                            <ContentComment 
                                commentId={comment.commentId} 
                                userId={comment.userId} 
                                content={comment.content} 
                                images={comment.images} 
                                createdAt={comment.createdAt} 
                                commentParentId={userId}
                            />
                        </div>
                    ))
                )}
            </div>
            {
                isShow && (
                    <div className="z-20 fixed top-0 left-0 w-full h-full bg-white md:bg-black md:bg-opacity-60" onClick={toggleModal}>
                        <div className="absolute md:left-16 md:right-0 h-full flex flex-col items-center md:justify-center">
                            <div className="py-5 flex flex-row ">
                                <div onClick={(e) => { e.stopPropagation(); toggleModal(); }} className="w-[120px] md:hidden pl-[20px]">Huỷ</div>
                                <span className=" w-[120px]text-black md:text-white font-bold">Thread trả lời</span>
                                <div className="w-[120px] md:hidden"></div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className={`md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg min-w-[540px] max-w-[550px] h-full md:h-auto`}>
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 items-start">
                                        <div className="flex h-full">
                                            <div className="w-8 flex-shrink-0">
                                                {
                                                    dataUserDetails && dataUserDetails?.userDetails?.[0]?.avatar ? (
                                                        <img className="rounded-full w-8 h-8 bg-cover" src={dataUserDetails?.userDetails?.[0]?.avatar} alt="avatar" />
                                                    ) : (
                                                        <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                                                    )
                                                }
                                            </div>
                                            <div className="flex-grow ml-2">
                                                <div className="flex flex-row gap-3">
                                                    <Link href={`/${userId}`} className="font-bold text-sm">
                                                        <span>{userId}</span>
                                                    </Link>
                                                    <span className="text-sm text-gray-400">{timeAgo}</span>
                                                </div>
                                                <div className="text-sm">
                                                    <pre className="max-w-[480px] break-words font-bold whitespace-pre-wrap">{content}</pre>
                                                </div>
                                                <div className="flex overflow-x-auto max-w-[500px] gap-2 mt-1">
                                                    {images &&
                                                        images.map((image: string, index: number) => {
                                                            return (
                                                                <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                                                    <img src={image} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                                                </div>
                                                            )
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* body  */}

                                <div className="flex items-start mt-1 gap-2">
                                {
                                    dataCurrentUserDetails && dataCurrentUserDetails?.userDetails?.[0]?.avatar ? (
                                        <img className="rounded-full w-8 h-8 bg-cover" src={dataCurrentUserDetails?.userDetails?.[0]?.avatar} alt="avatar" />
                                    ) : (
                                        <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                                    )}
                                    <div className="flex-grow">
                                        <div className="font-semibold text-sm mb-2">{userAccountId}</div>
                                        <LexicalEditor setOnchange={setCommentReply} />
                                        {uploadedImages.length > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mt-3">
                                                {uploadedImages.map((image, index) => (
                                                    <div key={index} className="aspect-square rounded-lg bg-gray-200 overflow-hidden">
                                                        <img src={image} alt={`uploaded-${index}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                    <div className="flex flex-row">
                                    <div className="h-[50px] w-[2px] bg-slate-500 mx-4"></div>
                                    <div className="flex flex-row items-center mb-2">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            id="image-upload"
                                        />
                                        <label htmlFor="image-upload" className="p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                                            <img width={20} src="/assets/album.svg" className="" alt="icon" />
                                        </label>
                                        <button className="p-2 hover:bg-gray-100 rounded-full">
                                            <img width={15} src="/assets/gif.svg" alt="" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-full">
                                            <img width={15} src="/assets/number.svg" alt="" />
                                        </button>
                                        <button className="p-2 hover:bg-gray-100 rounded-full">
                                            <img width={20} src="/assets/bargraph.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="px-2">
                                        {
                                            dataCurrentUserDetails && dataCurrentUserDetails?.userDetails?.[0]?.avatar ? (
                                                <img className="rounded-full w-4 h-4 bg-cover" src={dataCurrentUserDetails?.userDetails?.[0]?.avatar} alt="avatar" />
                                            ) : (
                                                <img className="rounded-full w-4 h-4 bg-cover" src="/assets/avt.png" alt="avatar" />
                                            )
                                        }
                                    </div>
                                    <div className="text-slate-500 text-sm font-light">
                                        <button>Thêm vào threads</button>
                                    </div>
                                </div>
                                <div className="pt-10 flex flex-row  items-center justify-between translate-y-[200px] gap-5 md:translate-y-0">
                                    <div className="text-slate-400 text-sm font-light">
                                        <button>Bất kỳ ai cũng có thể trả lời và trích dẫn</button>
                                    </div>
                                    <div>
                                        <button onClick={createCommentReply} className="w-20 h-10 flex justify-center items-center bg-gray-400  md:mr-[40px] border border-gray-4 00 rounded-full md:rounded-lg md:bg-white">
                                            <span className="font-semibold text-white md:text-gray-400">Đăng</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }     
        </div>  
    )
}