"use client"
import Link from "next/link"
import { use, useEffect, useState } from "react";
import {Buffer} from "buffer" 
import LexicalEditor from "./LexicalEditor";
import { getUserId } from "@/utils/auth";
import {db} from "@/utils/contants"
import {tx,id} from "@instantdb/react"
import { toast } from "react-toastify";

export default function Article({ user_id, content,postId,images }: ArticleProps) {
    const userId = getUserId();
    const [isShow, setIsShow] = useState<boolean>(false);
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState(false);
    const [commentContent, setCommentContent] = useState<string>('');
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);
    const [image, setImage] = useState<string|null>(null);
    const [shareCount, setShareCount] = useState<number>(0);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const query = { actionLikePost: {} }
    const { isLoading, error, data } = db.useQuery(query)

    const queryCheckIsLiked = { actionLikePost:{
        $:{
            where:{
                postId:postId,
                userId:userId
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
        (like: any) => like.postId === postId
    ).length || 0;

    const totalShares = dataShares?.shares.filter(
        (share: any) => share.postId === postId
    ).length || 0;

    const totalComments = dataComments?.comments.filter(
                (comment: any) => comment.postId === postId
            ).length || 0;

    const totalReposts = dataPosts?.posts.filter(
        (post: any) => post.repost === postId
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
            (like: any) => like.postId === postId && like.userId === userId
        );
        const actionLikePostId = data?.actionLikePost.find(
            (like: any) => like.postId === postId && like.userId === userId 
        )?.id;
        try {
            if (isUserLiked) {
                setIsLiked(false);
                db.transact([tx.actionLikePost[actionLikePostId as string].delete()]);
            } else {
                db.transact([tx.actionLikePost[id()].update(
                    { 
                        postId: postId,
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
        if (!postId || !userId || !commentContent) return;

        try {
            const commentId = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact([tx.comments[id()].update(
                { 
                    commentId: commentId,
                    postId: postId,
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
        if (!userId || !postId) return;
    
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
        if (!userId || !postId || !content) return;

        try {
            const existingRepost = dataPosts?.posts.find(
                (post: any) => post.repost === postId && post.userId === userId
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
                        content: content,
                        images: images,  // Change this line
                        createdAt: new Date().getTime(),
                        repost: postId
                    }
                )]
            );
            setIsReposted(true);
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    
    const checkIsReposted = () => {
        if (!userId || !postId) return;
    
        try {
            // Check if the post is already reposted by the user
            
            const userRepost = dataPosts?.posts.find(
                (post: any) => post.repost === postId && post.userId === userId
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
        if (!userId || !postId) return;

        try {
            // Check if the post is already shared by the user
            const isShared = dataShares?.shares.some(
                (share: any) => share.postId === postId && share.userId === userId
            );

            if (isShared) {
                // If already shared, remove the share
                const shareToRemove = dataShares?.shares.find(
                    (share: any) => share.postId === postId && share.userId === userId
                );
                if (shareToRemove) {
                    db.transact([tx.shares[shareToRemove.id].delete()]);
                    setShareCount(shareCount - 1);
                    return; // Exit the function early
                }
            }
            else{
                db.transact(
                    [tx.shares[id()].update(
                        { 
                            userId: userId,
                            postId: postId,
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

    useEffect(() => {
        checkIsReposted();
        checkIsLiked();
    }, [postId, userId]);
    const [isFriendAdded, setIsFriendAdded] = useState(false);

    const addFriend = async (userId: string, friendId: string) => {
        if (!userId || !friendId || isFriendAdded) return;

        try {
            const response = await fetch('/api/addFriend', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, friendId }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    console.log('Friend added successfully');
                    setIsFriendAdded(true);
                    // You might want to update the UI or state here
                } else {
                    console.error('Failed to add friend:', result.message);
                }
            } else {
                console.error('Failed to add friend');
            }
        } catch (error) {
            console.error('Error adding friend:', error);
            alert('Error adding friend');
        }
    };

    const checkFriendStatus = async (userId: string, friendId: string) => {
        try {
            const response = await fetch(`/api/checkFriendStatus?userId=${userId}&friendId=${friendId}`);
            if (response.ok) {
                const result = await response.json();
                setIsFriendAdded(result.isFriend);
            } else {
                console.error('Failed to check friend status');
            }
        } catch (error) {
            console.error('Error checking friend status:', error);
        }
    };

    useEffect(() => {
        if (userId && user_id && userId !== user_id) {
            checkFriendStatus(userId, user_id);
        }
    }, [userId, user_id]);
    

    return(
        <div className="max-w-full">
            <div className="border-b border-gray-200 max-w-full py-2 px-5">
                {/* <header> */}
                <div className="flex flex-row gap-3 max-w-full">
                    <div className="relative flex-row w-8 h-8 justify-center">
                        <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                        {userId && user_id && userId !== user_id && !isFriendAdded && (
                            <button 
                                onClick={() => {
                                    addFriend(userId, user_id);
                                    setIsFriendAdded(true);
                                }}
                                className="absolute top-5 right-[-1px] bg-white rounded-full shadow-md hover:bg-gray-100 p-1"
                            >
                                <img width={12} src="/assets/addfriend.svg" alt="Add friend" />
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between w-full items-center">
                            <Link href={`/@${user_id}`}>
                                <span className="text-sm font-semibold hover:underline">{user_id?user_id:""}</span>
                            </Link>
                            <div className="flex relative">
                                <button onClick={()=>setIssShow((prv)=>!prv)} className="z-0 hover:bg-slate-100 p-2 rounded-full">
                                    <img width={10} src="/assets/optiononarticle.svg" alt="icon" />
                                </button>
                                {
                                    issShow&&(
                                        <div className="absolute top-7 translate-x-[-230px] flex flex-col gap-1 shadow-md p-4 px-2 w-64 h-auto rounded-lg bg-white border border-gray-200">
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
                        <Link href={`/@${user_id}/post/${postId}`} className="flex flex-col gap-3">
                            <span className="min-w-[535px] max-w-[540px] break-words whitespace-pre-wrap">{content}</span>
                            <div className="flex overflow-x-scroll gap-2 ">
                                {images &&
                                    images.map((image:string,index) => {
                                    return(
                                        <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                            <img src={image} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                        </div>
                                    )
                                })}
                            </div>
                        </Link>
                    </div>
                </div>
                {/* footer */}
                <div className="flex mt-5 md:ml-[60px] justify-center md:justify-start items-center text-sm font-thin gap-5 mb-3 ">
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
            </div>
            {
                isShow && (
                    <div className="z-20 fixed top-0 left-0 w-full h-full bg-white md:bg-black md:bg-opacity-60" onClick={toggleModal}>
                        <div className="absolute md:left-16 md:right-0 h-full flex flex-col items-center md:justify-center">
                            <div className="py-5 flex flex-row ">
                                <div onClick={(e) => {e.stopPropagation();toggleModal();}}  className="w-[120px] md:hidden pl-[20px]">Huỷ</div>
                                <span className=" w-[120px]text-black md:text-white font-bold">Thread trả lời</span>
                                <div className="w-[120px] md:hidden"></div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className={`md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg w-[340px] h-full md:h-[500px]`}>
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 items-start">
                                        <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />
                                        <div>
                                            <div className="flex flex-row gap-3">
                                                <Link href={`/${user_id}`} className="font-bold text-sm">
                                                    <span>{user_id}</span>
                                                </Link>
                                                <span className="text-sm text-gray-400">20 giờ</span>
                                            </div>
                                            <div className="text-sm">
                                                <p>{content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* body  */}
                                <div className="flex flex-row">
                                    <div className="h-[img] w-[1px] bg-slate-500 mx-4"></div>
                                    <div className="flex overflow-x-scroll gap-2 mt-1">
                                        {images && 
                                            images.map((image:string,index) => {
                                            return(
                                                <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                                    <img src={image} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="flex flex-row items-center mt-1">
                                    <img width={30} className="mr-2 rounded-full w-8 h-8 bg-cover " src="data:image/jpeg;base64,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" alt="" />
                                    <div className="w-full">
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
                                <div className="flex flex-row">
                                    <div className="h-[25px] w-[2px] bg-slate-500 mx-4"></div>
                                    <div className="flex flex-row items-center mb-2">
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
                                <div className="flex flex-row">
                                    <div className="px-2">
                                        <img width={30} className="rounded-full w-4 h-4  bg-cover" src="data:image/jpeg;base64,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" alt="" />
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