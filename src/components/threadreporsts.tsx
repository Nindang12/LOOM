"use client"
import Link from "next/link"
import { useEffect, useState } from "react";
import { Buffer } from "buffer"

interface Image {
    photo_content: string;
}

interface ArticleProps {
    user_id: string;
    content: string;
    postId: string;
    repostedBy?: string;  // Add this line
}

export default function Threadsreports({ user_id, content, postId, repostedBy }: ArticleProps) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState<string | null>(null);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);
    const [images, setImages] = useState<Image[]>([]);
        
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);


    const checkRepost = async () => {
        if (!postId || !userId) return;

        try {
            const response = await fetch(`/api/post/repost/isReposted?postId=${postId}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setIsReposted(result.isReposted);
            } else {
                console.error('Failed to check repost status');
            }
        } catch (error) {
            console.error('Error checking repost status:', error);
        }
    };

    useEffect(() => {
        if (postId && userId) {
            checkRepost();
        }
    }, [postId, userId]);

    const getImagesForPost = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/photo?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                console.log("image",result)
                setImages(result.photos);
            } else {
                console.error('Failed to fetch images for post');
            }
        } catch (error) {
            console.error('Error fetching images for post:', error);
        }
    };

    useEffect(() => {
        getImagesForPost();
    }, [postId]);

    const handleLike = async () => {
        if (!userId) return; // Ensure user is logged in

        try {
            const response = await fetch('/api/like/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: postId, user_id: userId }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.message === "Post liked successfully") {
                    setIsLiked(true);
                    setLikeCount(prevCount => prevCount + 1);
                } else if (result.message === "Like removed successfully") {
                    setIsLiked(false);
                    setLikeCount(prevCount => prevCount - 1);
                }
            } else {
                console.error('Failed to like/unlike post');
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const getTotalLikes = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/like/post?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setLikeCount(result.total_likes);
            } else {
                console.error('Failed to fetch total likes');
            }
        } catch (error) {
            console.error('Error fetching total likes:', error);
        }
    };

    useEffect(() => {
        getTotalLikes();
    }, [postId]);

    const createComment = async () => {
        if (!postId || !userId) return;

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postId,
                    user_id: userId,
                    comment_content: commentContent
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Comment created successfully:', result);
                setCommentContent('');
                toggleModal()
                window.location.reload();
                // You might want to update the UI here, e.g., add the new comment to a list of comments
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const getTotalComments = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/comment?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setCommentCount(result.comments.length);
            } else {
                console.error('Failed to fetch total comments');
            }
        } catch (error) {
            console.error('Error fetching total comments:', error);
        }
    };

    useEffect(() => {
        getTotalComments();
    }, [postId]);


    const checkIsLiked = async () => {
        if (!userId || !postId) return;
    
        try {
            const response = await fetch(`/api/like/post/isLiked?postId=${postId}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsLiked(result.isLiked);
            } else {
                console.error('Failed to check if post is liked');
            }
        } catch (error) {
            console.error('Error checking if post is liked:', error);
        }
    };
    
    useEffect(() => {
        checkIsLiked();
    }, [postId, userId]);

    const handleRepost = async () => {
        if (!userId || !postId || !content) return;

        try {
            const response = await fetch(`/api/post/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, post_id: postId, post_content: content }),
            });

            if (response.ok) {
                const result = await response.json();
                setIsReposted(result.isReposted);
                setRepostCount(prevCount => result.isReposted ? prevCount + 1 : prevCount - 1);
            } else {
                console.error('Failed to repost');
            }
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    
    const checkIsReposted = async () => {
        if (!userId || !postId) return;
    
        try {
            const response = await fetch(`/api/post/repost/isReposted?postId=${postId}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsReposted(result.isReposted);
            } else {
                console.error('Failed to check if post is reposted');
            }
        } catch (error) {
            console.error('Error checking if post is reposted:', error);
        }
    };
    
    const getTotalReposts = async () => {
        if (!postId) return;

        try {
            const response = await fetch(`/api/post/repost?postId=${postId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setRepostCount(result.repostCount);
            } else {
                console.error('Failed to get total reposts');
            }
        } catch (error) {
            console.error('Error getting total reposts:', error);
        }
    };

    useEffect(() => {
        checkIsReposted();
        getTotalReposts();
    }, [postId, userId]);

    return(
        <div>
            <div className="border-b border-gray-200 w-full px-4 mt-2">
                {repostedBy && (
                    <div className="text-sm text-gray-500 mb-2">
                        Reposted by {repostedBy}
                    </div>
                )}
                <div className="flex flex-row gap-3 w-full">
                    <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                    <div className="flex flex-col">
                        <div className="flex flex-row justify-between w-full items-center">
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
                        <Link href={`/@${user_id}/post/${postId}`} className="flex flex-col gap-3">
                            <span className="text-gray-700">{content ? JSON.parse(content as string) : ""}</span>
                            <div className="flex overflow-x-scroll gap-2 ">
                                {images.map((image: Image, index) => {
                                    return(
                                        <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                            <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                        </div>
                                    )
                                })}
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="flex mt-5 md:ml-[60px] justify-center md:justify-start items-center text-sm font-thin gap-5 mb-3 ">
                    <div className="flex gap-1 p-2">
                        <button onClick={handleLike} className="hover:bg-slate-100 rounded-3xl">
                            <img
                                width={20}
                                src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                alt={isLiked ? "redheart" : "heart"}
                            />
                        </button>
                        <small className={`${isLiked ? "text-red-600" : ""}`}>{likeCount}</small>
                    </div>
                    <button onClick={() => setIsShow((prv) => !prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
                        <img width={20} src="/assets/comment.svg" alt="" />
                        <small>{commentCount}</small>
                    </button>
                    <button onClick={handleRepost} className={`flex gap-1 hover:bg-slate-100 p-2 rounded-3xl ${isReposted ? "bg-opacity-50 hover:bg-green-100" : ""}`}>
                        <img width={20} src={isReposted ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="" />
                        <small className={`${isReposted ? "text-green-600" : ""}`}>{repostCount}</small>
                    </button>
                    <button className="flex gap-1 hover:bg-slate-100 p-1 rounded-3xl">
                        <img width={30} src="/assets/share.svg" alt="" />
                        <small>100</small>
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
                            <div onClick={(e) => e.stopPropagation()} className=" md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg w-[340px] h-full md:h-[500px] md:w-[600px]">
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 ">
                                        <div>
                                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />                                                
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-3">
                                                <Link href={`/chien_ha`} className="font-bold text-sm">
                                                    <span>{user_id}</span>
                                                </Link>
                                                <span className="text-sm text-gray-400">20 giờ</span>
                                            </div>
                                            <div className="text-sm">
                                                <span className="text-gray-700">{content ? JSON.parse(content as string) : ""}</span>
                                                <div className="flex overflow-x-scroll gap-2 ">
                                                    {images.map((image: Image, index) => {
                                                        return(
                                                            <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                                                <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center">
                                    <img width={30} className="mr-2 rounded-full w-8 h-8 bg-cover " src="/assets/avt.png" alt="" />
                                    <div className="flex flex-col ">
                                        <span className="text-sm">{userId}</span>
                                        <input onChange={(e) => setCommentContent(e.target.value)} className="focus outline-none text-sm font-light w-full" type="text" placeholder={`Trả lời ${userId} ...`} />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    <div className="h-[25px] w-[2px] bg-slate-500 mx-4"></div>
                                    <div>
                                        <button className="px-2">
                                            <img width={20} src="/assets/album.svg" className="" alt="icon" />
                                        </button >   
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