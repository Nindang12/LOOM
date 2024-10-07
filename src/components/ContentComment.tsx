"use client"
import { getUserId } from "@/utils/auth";
import Link from "next/link"
import { useEffect, useState } from "react"
import { db } from "@/utils/contants";
import { tx,id } from "@instantdb/react";

export default function ContentComment({
    content,
    commentId,
    createdAt,
    userId,
    postId
}: Comment) {
    const [isShow, setIsShow] = useState<boolean>(false);
    const [replyContent, setReplyContent] = useState<string|null>(null);
    const [issShow, setIssShow] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [localLikeCount, setLocalLikeCount] = useState<number>(0);
    const [totalReplies, setTotalReplies] = useState(0);
    const [timeAgo, setTimeAgo] = useState<string>('');
    const [isReposted, setIsReposted] = useState<boolean>(false);
    const [repostCount, setRepostCount] = useState<number>(0);

    const [userAccountId, setUserAccountId] = useState<string | null>(null);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserAccountId(userId as string);
        }
    }, [])

    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }


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

    const handleLikeComment = async () => {
        if (!commentId || !userAccountId) return; // Ensure user is logged in and commentId exists

        try {
            if (existingLike?.actionLikeComment) {
                // Unlike the comment
                await db.transact([
                    tx.actionLikeComment[existingLike.actionLikeComment[0].id].delete()
                ]);
                setIsLiked(false);
                setLocalLikeCount(prevCount => prevCount - 1);
            } else {
                // Like the comment
                await db.transact([
                    tx.actionLikeComment[id()].update({
                        commentId: commentId,
                        userId: userAccountId,
                        createdAt: new Date().getTime()
                    })
                ]);
                setIsLiked(true);
                setLocalLikeCount(prevCount => prevCount + 1);
            }
        } catch (error) {
            console.error('Error liking/unliking comment:', error);
        }
    };


    const handleReplyComment = async () => {
        if (!commentId || !userAccountId || !replyContent) return;

        try {
            const replyId = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            await db.transact([
                tx.comments[id()].update({
                    commentId: replyId,
                    userId: userAccountId,
                    content: replyContent,
                    images: [],
                    createdAt: new Date().getTime(),
                    postId: postId,
                    replyTo: commentId
                })
            ]);

            console.log('Reply posted successfully');
            setReplyContent('');
            setIsShow(false);
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    const checkIsLiked = async () => {
        if (!userAccountId || !commentId) return;
    
        try {
            
            setIsLiked(Boolean(existingLike?.actionLikeComment?.length));
        } catch (error) {
            console.error('Error checking if comment is liked:', error);
        }
    };
    
    const handleReReplyComment = async () => {
        if (!userAccountId || !postId || !content) return;

        try {
            const repostId = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            await db.transact([
                tx.posts[id()].update({
                    id: repostId,
                    userId: userAccountId,
                    content: content,
                    images: [],
                    createdAt: new Date().getTime(),
                    repost: commentId
                })
            ]);

            console.log('Comment successfully reposted');
            setIsReposted(true);
            setRepostCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error('Error reposting comment:', error);
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

    

    return(
        <div>
            <div className="border-b border-gray-200">
                {/* <header> */}
                <div className="flex flex-row items-start justify-between">
                    <div className="h-auto flex flex-row gap-2 mt-2 ml-5 min-h-[97px]">
                        <div className="flex flex-col h-full min-h-3 justify-center items-center gap-2">
                            <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avt" />              
                            <div className="flex-grow bg-slate-400 w-[1px]"></div>          
                        </div>
                        <div className="h-full">
                            <div className="flex gap-2">
                                <Link href={`/@${userId}`} className="font-bold text-sm">
                                    <span className="">{userId}</span>
                                </Link>
                                <span className="text-sm text-gray-400">{timeAgo}</span>
                            </div>
                            <div className="text-sm">
                                <p>{content}</p>
                            </div>
                            <div className="flex justify-center md:justify-start items-center text-sm font-thin gap-3 mb-3 ">
                                <button onClick={handleLikeComment} className="flex hover:bg-slate-100 p-2 rounded-3xl">
                                    <img
                                        width={20}
                                        src={isLiked ? "/assets/redheart.svg" : "/assets/heartonarticle.svg"}
                                        alt={isLiked ? "redheart" : "heart"}
                                    />
                                    <span>{localLikeCount}</span>
                                </button>
                                <button onClick={()=>setIsShow((prv)=>!prv)} className="flex hover:bg-slate-100 p-2 rounded-3xl">
                                    <img className="" width={20} src="/assets/comment.svg" alt="" />
                                    <span>{totalReplies}</span>
                                </button>
                                <button className="flex hover:bg-slate-100 p-2 rounded-3xl">
                                    <img className="" width={20} src="/assets/replay.svg" alt="" />
                                    <span>100</span>
                                </button>
                                <button className="flex hover:bg-slate-100 p-1 rounded-3xl">
                                    <img className="" width={30} src="/assets/share.svg" alt="" />
                                    <span>100</span>
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
                                                <Link href={`/@${userId}`} className="font-bold text-sm">
                                                    <span>{userId}</span>
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