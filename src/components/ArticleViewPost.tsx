"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import LexicalEditor from "./LexicalEditor";
import { getUserId } from "@/utils/auth";
import { db } from "@/utils/contants";
import { id, tx } from "@instantdb/react";
import { toast } from "react-toastify";

interface ArticleProps {
    user_id: string;
    content: string;
    postId: string;
    images: string[];
}

export default function ArticleViewPost({ post }: { post: any }) {
    const [userId, setUserId] = useState<string | null>(null);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState(false);
    const [commentContent, setCommentContent] = useState<string>('');
    const [timeAgo, setTimeAgo] = useState<string>("");
    const [isReposted, setIsReposted] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [isFriendAdded, setIsFriendAdded] = useState(false);
    const queryFriendships = {
        friendships: {
            $: {
                where: {
                    friendId: userId,
                    isFriend: true,
                    userId: post.userId
                },
            },
        },
    }
    const { data: dataFriendships } = db.useQuery(queryFriendships)
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserId(userId as string);
        }
    }, [])

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(post.createdAt)) / 1000);

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
    }, [post.createdAt]);

    const query = { actionLikePost: {} }
    const { isLoading, error, data } = db.useQuery(query)

    const queryCheckIsLiked = { actionLikePost:{
        $:{
            where:{
                postId: post.postId,
                userId: userId
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
        (p: any) => p.repost === post.postId
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
        if (!userId) return; // Ensure user is logged in
        // Check if the user has already liked this post
        const isUserLiked = data?.actionLikePost.some(
            (like: any) => like.postId === post.postId && like.userId === userId
        );
        const actionLikePostId = data?.actionLikePost.find(
            (like: any) => like.postId === post.postId && like.userId === userId 
        )?.id;
        try {
            if (isUserLiked) {
                setIsLiked(false);
                db.transact([tx.actionLikePost[actionLikePostId as string].delete()]);
            } else {
                db.transact([tx.actionLikePost[id()].update(
                    { 
                        postId: post.postId,
                        userId: userId,
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
        if (!post.postId || !userId || !commentContent) return;

        try {
            const commentId = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact([tx.comments[id()].update(
                { 
                    commentId: commentId,
                    postId: post.postId,
                    userId: userId,
                    content: commentContent,
                    createdAt: new Date().getTime(),
                    images: uploadedImages
                }
            )]);
            toast.success('Comment created successfully');
            setCommentContent('');
            toggleModal()
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const checkIsLiked = async () => {
        if (!userId || !post.postId) return;
    
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
        if (!userId || !post.postId || !post.content) return;

        try {
            const existingRepost = dataPosts?.posts.find(
                (p: any) => p.repost === post.postId && p.userId === userId
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
                            userId: userId,
                            postId: post_id,
                            content: post.content,
                            images: post.images,
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
        if (!userId || !post.postId) return;
    
        try {
            const userRepost = dataPosts?.posts.find(
                (p: any) => p.repost === post.postId && p.userId === userId
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
        if (!userId || !post.postId) return;

        try {
            const existingShare = dataShares?.shares.find(
                (share: any) => share.postId === post.postId && share.userId === userId
            );

            if (existingShare) {
                // If already shared, remove the share
                db.transact([tx.shares[existingShare.id].delete()]);
                return; // Exit the function early
            }
            db.transact(
                [tx.shares[id()].update(
                    { 
                        userId: userId,
                        postId: post.postId,
                        createdAt: new Date().getTime(),
                    }
                )]
            );
        } catch (error) {
            console.error('Error sharing post:', error);
        }
    };

    useEffect(() => {
        checkIsReposted();
        checkIsLiked();
    }, [post.postId, userId]);

    const addFriend = async (userId: string, friendId: string) => {
        if (!userId || !friendId || isFriendAdded) return;

        try {
            db.transact([tx.friendships[id()].update(
                {
                    userId: userId,
                    friendId: friendId,
                    isFriend: false,
                    isPendingRequest: true,
                    createdAt: Date.now()
                }
            )]);
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend');
        }
    };

    return(
        <div>
            <div className="flex flex-col gap-3 ">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row justify-center gap-2 mt-2 ml-5 ">
                        <div className="relative">
                            <img className="rounded-full w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="User avatar" />
                            {!isFriendAdded && userId !== post.userId && !dataFriendships?.friendships.length && (
                                <button
                                    onClick={() => {
                                        addFriend(userId as string, post.userId as string);
                                        setIsFriendAdded(true);
                                    }}
                                    className="absolute bottom-[-4px] right-[-4px] bg-white rounded-full shadow-md hover:bg-gray-100 p-1"
                                >
                                    <img width={10} src="/assets/addfriend.svg" alt="Add friend" />
                                </button>
                            )}
                        </div>
                        
                        <div className="flex gap-2 mt-2 ">
                            <Link href={`/${post.userId}`} className="font-bold text-sm">
                                <span className="">{post.userId}</span>
                            </Link>
                            <span className="text-sm text-gray-400">{timeAgo}</span>
                        </div>        
                    </div>
                    <div>
                        <button onClick={()=>setIssShow((prv)=>!prv)} className="z-0 mr-5 hover:bg-slate-100 p-3 rounded-full">
                            <img width={15} src="/assets/optiononarticle.svg" alt="" />
                        </button>
                        {
                            issShow&&(
                                <div className="fixed translate-x-[-230px] flex flex-col gap-1 shadow-md p-4 px-2 w-64 h-auto rounded-lg bg-white border border-gray-200">
                                    <div className="flex flex-col border-solid border-b-2 ">
                                        <button className=" flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                            <span className="text-sm font-bold">Lưu</span>
                                            <img width={30} src="/assets/save.svg" alt="" />
                                        </button>
                                        <button className="flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                            <span className="text-sm font-bold">Không quan tâm</span>
                                            <img width={25} src="/assets/eye.svg" alt="" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col border-solid border-b-2 ">
                                        <button className=" flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                            <span className="text-sm font-bold">Tắt thông báo</span>
                                            <img width={30} src="/assets/bell.svg" alt="" />
                                        </button>
                                        <button className="flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                            <span className="text-sm text-red-600 font-bold">Chặn</span>
                                            <img width={25} src="/assets/block.svg" alt="" />
                                        </button>
                                        <button className="flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                            <span className="text-sm font-bold text-red-600">Báo cáo</span>
                                            <img width={25} src="/assets/warning.svg" alt="" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col ">
                                        <button className=" flex justify-between hover:bg-slate-200 px-2 py-3 rounded-lg">
                                            <span className="text-sm font-bold">Sao chép liên kết</span>
                                            <img width={20} src="/assets/link.svg" alt="" />
                                        </button>
                                    </div>
                                </div>
                            )
                        }
            
                    </div>
                </div>
                {/* body  */}
                <div className="flex flex-col gap-2 px-6">
                    <div className="text-sm ">
                        <p className="w-[300px] md:min-w-[535px] md:max-w-[540px] break-words whitespace-pre-wrap">{post.content}</p>
                    </div>
                    <div className="flex overflow-x-scroll gap-2 mt-1">
                        {post.images && 
                            post.images.map((image:string,index:number) => {
                            return(
                                <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                    <img src={image} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {/* footer */}
                <div className="flex mt-5 md:ml-[16px] justify-center md:justify-start items-center text-sm font-thin gap-5 mb-3 ">
                    <div className="flex gap-1 p-2">
                        <button onClick={handleLike} className="hover:bg-slate-100 rounded-3xl">
                            <img
                                width={20}
                                src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                alt={isLiked ? "redheart" : "heart"}
                            />
                        </button>
                        <small className={`${isLiked ? "text-red-600" : ""}`}>{totalLikes}</small>
                    </div>
                    <button onClick={()=>setIsShow((prv)=>!prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
                        <img width={20} src="/assets/comment.svg" alt="" />
                        <small>{totalComments}</small>
                    </button>
                    <button onClick={handleRepost} className={`flex gap-1 hover:bg-slate-100 p-2 rounded-3xl ${isReposted ? "bg-opacity-50 hover:bg-green-100" : ""}`}>
                        <img width={20} src={isReposted ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="" />
                        <small className={`${isReposted ? "text-green-600" : ""}`}>{totalReposts}</small>
                    </button>
                    <button onClick={handleShare} className="flex gap-1 hover:bg-slate-100 p-1 rounded-3xl">
                        <img width={30} src="/assets/share.svg" alt="" />
                        <small>{totalShares}</small>
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="w-[580px] h-[0.5px] bg-slate-200"></div>
                </div>
            </div>
            {
                isShow && (
                    <div className="z-20 fixed top-0 left-0 w-full h-full bg-white md:bg-black md:bg-opacity-60" onClick={toggleModal}>
                        <div className="flex flex-col items-center justify-center h-full md:ml-20">
                            <div className="py-5 flex flex-row ">
                                <div onClick={(e) => {e.stopPropagation();toggleModal();}}  className="w-[120px] md:hidden pl-[20px]">Huỷ</div>
                                <span className=" w-[120px]text-black md:text-white font-bold">Thread trả lời</span>
                                <div className="w-[120px] md:hidden"></div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className={`md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg md:w-1/3 h-full ${post.images? uploadedImages.length > 0 ? "md:max-h-[700px]":"md:max-h-[500px]":"md:h-[350px]"}`}>
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 ">
                                        <div>
                                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />                                                
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-3">
                                                <Link href={`/@${post.userId}`} className="font-bold text-sm">
                                                    <span>{post.userId}</span>
                                                </Link>
                                                <span className="text-sm text-gray-400">{timeAgo}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* body  */}
                                <div className="flex flex-col gap-3 overflow-x-hidden">
                                    <span className="w-full md:max-w-[540px] break-words whitespace-pre-wrap">{post.content}</span>
                                    {post.images && post.images.length > 0 && (
                                        <div className="w-full md:max-w-[545px] overflow-x-auto">
                                            <div className="flex gap-2 pb-2">
                                                {post.images.map((image: string, index: number) => (
                                                    <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex-shrink-0">
                                                        <img src={image} alt={`image-${index}`} className="object-cover w-full h-full rounded-lg" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex flex-col mt-3">
                                    <div className="flex items-start mb-4">
                                        <img src="/assets/avt.png" className="w-8 h-8 rounded-full flex items-start justify-center" alt="" />
                                        <div className="ml-2 w-full flex flex-col">
                                            <div className="font-semibold text-sm">{userId}</div>
                                                <LexicalEditor setOnchange={setCommentContent}/>
                                                {uploadedImages.length > 0 && (
                                                    <div className="flex overflow-x-scroll gap-2 mt-1">
                                                        {uploadedImages.map((image, index) => (
                                                            <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                                                <img src={image} alt={`uploaded-${index}`} className="object-cover w-full h-full rounded-lg" />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                style={{ display: 'none' }}
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="px-2 cursor-pointer">
                                                <img width={20} src="/assets/album.svg" className="" alt="icon" />
                                            </label>  
                                            <button className="px-2">
                                                <img width={15} src="/assets/gif.svg" alt="" />
                                            </button>
                                            <button className="px-2">
                                                <img width={15} src="/assets/number.svg" alt="" />
                                            </button>
                                            <button className="px-2">
                                                <img width={20} src="/assets/bargraph.svg" alt="" />
                                            </button>
                                    </div>
                                </div>

                                </div>
                                <div className="flex flex-row  items-center justify-between">
                                    <div className="text-slate-400 text-sm font-light">
                                        <button>Bất kỳ ai cũng có thể trả lời và trích dẫn</button>
                                    </div>
                                    <div>
                                        <button onClick={createComment} className="w-20 h-10 flex justify-center items-center bg-gray-400  md:mr-[40px] border border-gray-4 00 rounded-full md:rounded-lg md:bg-white">
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