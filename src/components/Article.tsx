"use client"
import Link from "next/link"
import { use, useEffect, useState } from "react";
import { Buffer } from "buffer"
import LexicalEditor from "./LexicalEditor";
import { getUserId } from "@/utils/auth";
import { db } from "@/utils/contants"
import { tx, id } from "@instantdb/react"
import { toast } from "react-toastify";

export default function Article({ user_id, content, postId, images }: ArticleProps) {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserId(userId as string);
        }
    }, [])

    const [isShow, setIsShow] = useState<boolean>(false);
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState(false);
    const [commentContent, setCommentContent] = useState<string>('');
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);
    const [image, setImage] = useState<string | null>(null);
    const [shareCount, setShareCount] = useState<number>(0);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const query = { actionLikePost: {} }
    const { isLoading, error, data } = db.useQuery(query)

    const queryCheckIsLiked = {
        actionLikePost: {
            $: {
                where: {
                    postId: postId,
                    userId: userId
                }
            }
        }
    };
    const { data: dataCheckIsLiked } = db.useQuery(queryCheckIsLiked);

    const queryComments = { comments: {} }
    const { data: dataComments } = db.useQuery(queryComments)

    const queryShares = { shares: {} }
    const { data: dataShares } = db.useQuery(queryShares)

    const queryPosts = { posts: {} }
    const { data: dataPosts } = db.useQuery(queryPosts)

    const queryFriendships = {
        friendships: {
            $: {
                where: {
                    friendId: userId,
                    isFriend: true,
                    userId: user_id
                },
            },
        },
    }

    const { data: dataFriendships } = db.useQuery(queryFriendships)

    //console.log(dataFriendships)
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
            else {
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


    return (
        <div className="w-full overflow-x-hidden">
            <div className="border-b border-gray-200 w-full py-2 px-5">
                {/* <header> */}
                <div className="flex flex-row gap-3 w-full">
                    <div className="relative flex-row w-8 h-8 justify-center flex-shrink-0">
                        <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                        {userId && user_id && userId !== user_id && !dataFriendships?.friendships.length && (
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
                        <div className="flex flex-row max-w-[300px] min-w-[299px] md:max-w-[540px] justify-between items-center">
                            <Link href={`/@${user_id}`}>
                                <span className="text-sm font-semibold hover:underline">{user_id ? user_id : ""}</span>
                            </Link>
                            <div className="flex relative">
                                <button onClick={() => setIssShow((prv) => !prv)} className="z-0 hover:bg-slate-100 p-2 rounded-full">
                                    <img width={10} src="/assets/optiononarticle.svg" alt="icon" />
                                </button>
                                {
                                    issShow && (
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
                        <Link href={`/@${user_id}/post/${postId}`} className="flex flex-col gap-3 overflow-x-hidden">
                            <span className="w-[300px] md:min-w-[535px] md:max-w-[540px] break-words whitespace-pre-wrap">{content}</span>
                            <div className="w-[300px] md:min-w-[545px] flex p-5 overflow-x-auto overflow-y-hidden gap-2">
                                {images && images.length > 0 && (
                                    <div className="flex overflow-x-auto overflow-y-hidden w-auto gap-2 pb-2">
                                        {images.map((image: string, index) => (
                                            <div key={index} className="rounded-lg min-w-[208px] h-52 bg-gray-200 flex-shrink-0">
                                                <img src={image} alt={`image-${index}`} className="object-cover w-full h-full rounded-lg" />
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                    <button onClick={() => setIsShow((prv) => !prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
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
                                <div onClick={(e) => { e.stopPropagation(); toggleModal(); }} className="w-[120px] md:hidden pl-[20px]">Huỷ</div>
                                <span className=" w-[120px]text-black md:text-white font-bold">Thread trả lời</span>
                                <div className="w-[120px] md:hidden"></div>
                            </div>
                            <div onClick={(e) => e.stopPropagation()} className={`md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg min-w-[540px] max-w-[550px] h-full md:h-auto`}>
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 items-start">
                                        <div className="flex h-full">
                                            <div className="w-8 flex-shrink-0">
                                                <img className="rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />
                                                <div className="h-full w-[2px] bg-slate-500 mx-auto mt-2"></div>
                                            </div>
                                            <div className="flex-grow ml-2">
                                                <div className="flex flex-row gap-3">
                                                    <Link href={`/${user_id}`} className="font-bold text-sm">
                                                        <span>{user_id}</span>
                                                    </Link>
                                                    <span className="text-sm text-gray-400">20 giờ</span>
                                                </div>
                                                <div className="text-sm">
                                                    <pre className="max-w-[480px] break-words font-bold whitespace-pre-wrap">{content}</pre>
                                                </div>
                                                <div className="flex overflow-x-auto max-w-[500px] gap-2 mt-1">
                                                    {images &&
                                                        images.map((image: string, index) => {
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

                                <div className="flex flex-row items-center mt-1">
                                    <img width={30} className="mr-2 rounded-full w-8 h-8 bg-cover " src="/assets/avt.png" alt="" />
                                    <div className="w-full">
                                        <div className="font-semibold text-sm">{userId}</div>
                                        <LexicalEditor setOnchange={setCommentContent} />
                                        {uploadedImages.length > 0 && (
                                            <div className="flex overflow-x-auto gap-2 mt-1">
                                                {uploadedImages.map((image, index) => (
                                                    <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex-shrink-0 flex items-center justify-center">
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
                                        <img width={30} className="rounded-full w-4 h-4  bg-cover" src="/assets/avt.png" alt="" />
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