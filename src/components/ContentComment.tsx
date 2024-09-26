"use client"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function ContentComment({
    comment_content,
    comment_id,
    create_at,
    user_id,
    post_id
}: Comment) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState<string|null>(null);
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [localLikeCount, setLocalLikeCount] = useState<number>(0);
    const [totalReplies, setTotalReplies] = useState(0);
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);

    useEffect(() => {
        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(create_at)) / 1000);

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
    }, [create_at]);

    const handleLikeComment = async () => {
        if (!comment_id) return; // Ensure user is logged in

        try {
            const response = await fetch('/api/like/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment_id: comment_id, user_id: user_id }),
            });

            if (response.ok) {
                const result = await response.json();
                if (result.message === "Comment liked successfully") {
                    setIsLiked(true);
                    setLocalLikeCount(prevCount => prevCount + 1);
                } else if (result.message === "Like removed successfully") {
                    setIsLiked(false);
                    setLocalLikeCount(prevCount => prevCount - 1);
                }
            } else {
                console.error('Failed to like/unlike post');
            }
        } catch (error) {
            console.error('Error liking/unliking post:', error);
        }
    };

    const getTotalLikeComment = async () => {
        if (!comment_id) return;

        try {
            const response = await fetch(`/api/like/comment?commentId=${comment_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setLocalLikeCount(result.total_likes);
            } else {
                console.error('Failed to fetch total likes for comment');
            }
        } catch (error) {
            console.error('Error fetching total likes for comment:', error);
        }
    };

    useEffect(() => {
        getTotalLikeComment();
    }, [comment_id]);


    const handleReplyComment = async () => {
        if (!comment_id || !user_id) return;

        try {
            const response = await fetch('/api/comment/reply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: comment_id,
                    user_id: user_id,
                    reply_content: replyContent,
                    post_id: post_id
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Reply posted successfully:', result);
                setReplyContent(''); 
                getTotalCommentReplies();
                setIsShow(false)
            } else {
                console.error('Failed to post reply');
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const getTotalCommentReplies = async () => {
        if (!comment_id) return;

        try {
            const response = await fetch(`/api/comment/reply?commentId=${comment_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setTotalReplies(result.total_replies);
            } else {
                console.error('Failed to fetch total replies for comment');
            }
        } catch (error) {
            console.error('Error fetching total replies for comment:', error);
        }
    };

    useEffect(() => {
        getTotalCommentReplies();
    }, [comment_id]);


    const checkIsLiked = async () => {
        if (!userId || !comment_id) return;
    
        try {
            const response = await fetch(`/api/like/comment/isLiked?commentId=${comment_id}&userId=${userId}`, {
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
    
    const handleRecomment = async () => {
        if (!userId || !comment_id || !replyContent) return;

        try {
            const response = await fetch(`/api/comment/recomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: userId, comment_id: comment_id, reply_content: replyContent }),
            });

            if (response.ok) {
                console.log('Comment successfully recommented');
                window.location.reload();
            } else {
                console.error('Failed to repost');
            }
        } catch (error) {
            console.error('Error reposting:', error);
        }
    };
    
    const checkIsReposted = async () => {
        if (!userId || !post_id) return;
    
        try {
            const response = await fetch(`/api/comment/recomment/isReComment?commentId=${comment_id}&userId=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.ok) {
                const result = await response.json();
                setIsReposted(result.isReposted);
            } else {
                console.error('Failed to check if comment is recommented');
            }
        } catch (error) {
            console.error('Error checking if comment is recommented:', error);
        }
    };
    
    const getTotalReposts = async () => {
        if (!post_id) return;

        try {
            const response = await fetch(`/api/comment/recomment?commentId=${comment_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setRepostCount(result.repostCount);
            } else {
                console.error('Failed to get total recomment');
            }
        } catch (error) {
            console.error('Error getting total recomment:', error);
        }
    };


    useEffect(() => {
        checkIsLiked();
        checkIsReposted();
        getTotalReposts()
    }, [comment_id, userId]);

    

    return(
        <div>
            <div className="border-b border-gray-200">
                {/* <header> */}
                <div className="flex flex-row items-start justify-between">
                    <div className="h-auto flex flex-row gap-2 mt-2 ml-5 min-h-[97px]">
                        <div className="flex flex-col h-100% justify-staet items-start gap-2">
                            <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avt" />              
                            {/* <div className="flex-grow bg-slate-400 w-[1px]"></div>           */}
                        </div>
                        <div className="h-full">
                            <div className="flex gap-2">
                                <Link href={`/@${user_id}`} className="font-bold text-sm">
                                    <span className="">{user_id}</span>
                                </Link>
                                <span className="text-sm text-gray-400">{timeAgo}</span>
                            </div>
                            <div className="text-sm">
                                <p>{comment_content}</p>
                            </div>
                            <div className="flex justify-center md:justify-start items-center text-sm font-thin gap-3 mb-3 ">
                                <div className="flex gap-1 p-2">
                                    <button onClick={handleLikeComment} className="hover:bg-slate-100 rounded-3xl">
                                        <img
                                            width={20}
                                            src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                            alt={isLiked ? "redheart" : "heart"}
                                        />
                                    </button>
                                    <small className={`${isLiked ? "text-red-600" : ""}`}>{localLikeCount}</small>
                                </div>
                                <button onClick={()=>setIsShow((prv)=>!prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
                                    <img width={20} src="/assets/comment.svg" alt="" />
                                    <small>{totalReplies}</small>
                                </button>
                                <button onClick={handleRecomment} className={`flex gap-1 hover:bg-slate-100 p-2 rounded-3xl ${isReposted ? "bg-opacity-50 hover:bg-green-100" : ""}`}>
                                    <img width={20} src={isReposted ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="" />
                                    <small className={`${isReposted ? "text-green-600" : ""}`}>{repostCount}</small>
                                </button>
                                <button className="flex gap-1 hover:bg-slate-100 p-1 rounded-3xl">
                                    <img width={30} src="/assets/share.svg" alt="" />
                                    <small>100</small>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={()=>setIssShow((prv)=>!prv)} className="z-0 mr-5 hover:bg-slate-100  p-3 rounded-full">
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
                {/* reply comment */}
                {/* <div className="flex flex-row items-start justify-between">
                    <div className="h-auto flex flex-row gap-2 mt-2 ml-5 min-h-[97px]">
                        <div className="flex flex-col h-100% justify-start items-start gap-2">
                            <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avt" />                       
                        </div>
                        <div className="h-full">
                            <div className="flex gap-2">
                                <Link href={`/@${user_id}`} className="font-bold text-sm">
                                    <span className="">{user_id}</span>
                                </Link>
                                <span className="text-sm text-gray-400">{timeAgo}</span>
                            </div>
                            <div className="text-sm">
                                <p>{comment_content}</p>
                            </div>
                            <div className="flex justify-center md:justify-start items-center text-sm font-thin gap-3 mb-3 ">
                                <div className="flex gap-1 p-2">
                                    <button className="hover:bg-slate-100 rounded-3xl">
                                        <img
                                            width={20}
                                            src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                            alt={isLiked ? "redheart" : "heart"}
                                        />
                                    </button>
                                    <small className={`${isLiked ? "text-red-600" : ""}`}>{localLikeCount}</small>
                                </div>
                                <button onClick={()=>setIsShow((prv)=>!prv)} className="flex gap-1 hover:bg-slate-100 p-2 rounded-3xl">
                                    <img width={20} src="/assets/comment.svg" alt="" />
                                    <small>{totalReplies}</small>
                                </button>
                                <button onClick={handleRecomment} className={`flex gap-1 hover:bg-slate-100 p-2 rounded-3xl ${isReposted ? "bg-opacity-50 hover:bg-green-100" : ""}`}>
                                    <img width={20} src={isReposted ? "/assets/replay-green.svg" : "/assets/replay.svg"} alt="" />
                                    <small className={`${isReposted ? "text-green-600" : ""}`}>{repostCount}</small>
                                </button>
                                <button className="flex gap-1 hover:bg-slate-100 p-1 rounded-3xl">
                                    <img width={30} src="/assets/share.svg" alt="" />
                                    <small>100</small>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={()=>setIssShow((prv)=>!prv)} className="z-0 mr-5 hover:bg-slate-100  p-3 rounded-full">
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
                </div> */}
                {/* footer */}
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
                                            <img className=" rounded-full z-0 w-8 h-8 bg-cover" src="/assets/avt.png" alt="avt" />                                                
                                        </div>
                                        <div>
                                            <div className="flex flex-row gap-3">
                                                <Link href={`/@${user_id}`} className="font-bold text-sm">
                                                    <span>{user_id}</span>
                                                </Link>
                                                <span className="text-sm text-gray-400">20 giờ</span>
                                            </div>
                                            <div className="text-sm">
                                                <p>{comment_content}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* body  */}
                                <div className="flex flex-row">
                                    <div className="h-[img] w-[4px] bg-slate-500 mx-4"></div>
                                    {/* <div className="ml-[40px] mr-[60px] flex overflow-x-scroll gap-2 ">
                                        <img className="rounded-lg " src="                                    </div> */}
                                </div>
                                <div className="flex flex-row items-center">
                                    <img width={30} className="mr-2 rounded-full w-8 h-8 bg-cover " src="/assets/avt.png" alt="" />
                                    <div className="flex flex-col ">
                                        <span className="text-sm">{userId}</span>
                                        <input onChange={(e)=>setReplyContent(e.target.value)} className="focus outline-none text-sm font-light w-full" type="text" placeholder={`Trả lời ${userId} ...`} />
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
                                        <img width={30} className="rounded-full w-4 h-4  bg-cover" src="/assets/avt.png" alt=""/>
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
                                        <button onClick={handleReplyComment} className="w-20 h-10 flex justify-center items-center bg-gray-400  md:mr-[40px] border border-gray-4 00 rounded-full md:rounded-lg md:bg-white">
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