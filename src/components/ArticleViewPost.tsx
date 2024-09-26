"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import LexicalEditor from "./LexicalEditor";


export default function ArticleViewPost({ post }: { post: Post }) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [image, setImage] = useState<string | null>(null);
    const [content, setContent] = useState<string>('');
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [userId, setUserId] = useState<string | null>(null);
    const [commentContent, setCommentContent] = useState<string|null>(null);
    const [commentCount, setCommentCount] = useState<number>(0);
    const [timeAgo, setTimeAgo] = useState<string>("");
    const [images, setImages] = useState([]);
    const [isReposted, setIsReposted] = useState(false);
    const [repostCount, setRepostCount] = useState(0);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    const getImagesForPost = async () => {
        if (!post.post_id) return;

        try {
            const response = await fetch(`/api/photo?postId=${post.post_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
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
    }, [post.post_id]);

    const handleLike = async () => {
        if (!userId) return; // Ensure user is logged in

        try {
            const response = await fetch('/api/like/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: post.post_id, user_id: userId }),
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
        if (!post.post_id) return;

        try {
            const response = await fetch(`/api/like/post?postId=${post.post_id}`, {
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
    }, [post.post_id]);

    const createComment = async () => {
        if (!post.post_id || !userId) return;

        try {
            const response = await fetch('/api/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: post.post_id,
                    user_id: userId,
                    comment_content: commentContent
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Comment created successfully:', result);
                setCommentContent('');
                toggleModal()
                // You might want to update the UI here, e.g., add the new comment to a list of comments
            } else {
                console.error('Failed to create comment');
            }
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const getTotalComments = async () => {
        if (!post.post_id) return;

        try {
            const response = await fetch(`/api/comment?postId=${post.post_id}`, {
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
    }, [post.post_id]);

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(post.create_at)) / 1000);

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
    }, [post.create_at]);

    const checkIsLiked = async () => {
        if (!userId || !post.post_id) return;
    
        try {
            const response = await fetch(`/api/like/post/isLiked?postId=${post.post_id}&userId=${userId}`, {
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
    
    const handleRepost = async () => {
        if (!userId || !post.post_id || !content) return;

        try {
            const response = await fetch(`/api/post/repost`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, post_id: post.post_id,post_content:content }),
            });

            if (response.ok) {
                console.log('Post successfully reposted');
                window.location.reload();
            } else {
                console.error('Failed to repost');
            }
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };

    const checkIsReposted = async () => {
        if (!userId || !post.post_id) return;
    
        try {
            const response = await fetch(`/api/post/repost/isReposted?postId=${post.post_id}&userId=${userId}`, {
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
        if (!post.post_id) return;

        try {
            const response = await fetch(`/api/post/repost?postId=${post.post_id}`, {
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
        checkIsLiked();
        checkIsReposted();
        getTotalReposts();
    }, [post.post_id, userId]);

    

    return(
        <div>
            <div className="">
                {/* <header> */}
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-row justify-center gap-2 mt-2 ml-5 ">
                        <div>
                            <img className=" rounded-full w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />
                            <div className=" translate-x-4 translate-y-[-15px]  ">
                                <img width={20} src="/assets/addfriend.svg" alt="" />
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-2 ">
                            <Link href={`/${post.user_id}`} className="font-bold text-sm">
                                <span className="">{post.user_id}</span>
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
                        <p>{JSON.parse(post.post_content)}</p>
                    </div>
                    {images.map((image:Image,index) => {
                        return(
                            <div key={index} className="rounded-lg w-52 h-52 bg-gray-200 flex items-center justify-center">
                                <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                            </div>
                        )
                    })}
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
                        <small className={`${isLiked ? "text-red-600" : ""}`}>{likeCount}</small>
                    </div>
                    <button onClick={()=>setIsShow((prv)=>!prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
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
                            <div onClick={(e) => e.stopPropagation()} className={`md:bg-white px-4 md:p-3 md:rounded-lg md:shadow-lg w-[540px] h-full ${image?"md:max-h-[500px]":"md:h-[350px]"}`}>
                                <div className="flex flex-row items-center justify-between">
                                    <div className="flex flex-row gap-2 mt-2 ml-0 ">
                                        <div>
                                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgFPzdgOy4CJfBOVER-gmHRQJjVfNd3LMf-Q&s" alt="" />                                                
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-3">
                                                <Link href={`/@${post.user_id}`} className="font-bold text-sm">
                                                    <span>{post.user_id}</span>
                                                </Link>
                                                <span className="text-sm text-gray-400">20 giờ</span>
                                            </div>
                                            <div className="text-sm">
                                                <p>{JSON.parse(post.post_content)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* body  */}
                                <div className="flex flex-row">
                                    <div className="h-[img] w-[1px] bg-slate-500 mx-4"></div>
                                    {images.map((image:Image,index) => {
                                        return(
                                            <div key={index} className="rounded-lg w-32 h-32 mt-1 bg-gray-200 flex items-center justify-center">
                                                <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                            </div>
                                        )
                                    })}
                                </div>
                                
                                <div className="flex flex-col mt-3">
                                    <div className="flex items-start mb-4">
                                        <img src="/assets/avt.png" className="w-8 h-8 rounded-full flex items-start justify-center" alt="" />
                                        <div className="ml-2 w-full flex flex-col">
                                            <div className="font-semibold text-sm">{userId}</div>
                                                <LexicalEditor setOnchange={setContent}/>
                                                {
                                                    image && (
                                                        <img src={image} className="w-32 h-32 mt-4 object-cover" alt="image" />
                                                    )
                                                }
                                        </div>
                                    </div>
                                    <div className="flex items-center mb-4">
                                        <div className="flex items-center">
                                            <button className="px-2" onClick={() => document.getElementById('upload-image-input')?.click()}>
                                                <img width={20} src="/assets/album.svg" className="" alt="icon" />
                                            </button>
                                            <input
                                                type="file"
                                                id="upload-image-input"
                                                style={{ display: 'none' }}
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) { 
                                                        const reader = new FileReader();
                                                        reader.readAsDataURL(file);
                                                        reader.onload = () => {
                                                            setImage(reader.result as string);
                                                        };
                                                        
                                                    }
                                                    //console.log(file)
                                                }}
                                            />
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