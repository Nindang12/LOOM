"use client"
import { useEffect, useId, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUserId } from "@/utils/auth"
import LexicalEditor from "./LexicalEditor"
import { id, tx } from "@instantdb/react"
import { db } from "@/utils/contants"
import { toast } from "react-toastify"

export default function Siderbar(user_id: ArticleProps){
    const [isShow, setIsShow] = useState<boolean>(false);
    const toggleModal = () => {
        setIsShow((prevState) => !prevState);
    }
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserId(userId as string);
        }
    }, [])

    const handleUploadThread = async () => {
        try {
            if (!userId) {
                toast.error('User ID not found in SessionStorage');
            }
            const post_id = Math.random().toString(36).substring(2, 7) + Math.random().toString(36).substring(2, 7);
            db.transact(
                [tx.posts[id()].update(
                    { 
                        userId: userId,
                        postId: post_id,
                        content: content,
                        images: images,  // Change this line
                        createdAt: new Date().getTime()
                    }
                )]
            );
            setContent("");
            setImages([]);  // Reset images after posting
            toggleModal();
            toast.success("Thread created successfully!");
        } catch (error) {
            console.error('Error uploading thread:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImages: string[] = [];
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        newImages.push(e.target.result as string);
                        if (newImages.length === files.length) {
                            setImages(prevImages => [...prevImages, ...newImages]);
                        }
                    }
                };
                reader.readAsDataURL(file);
            });
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
    return(
        <div className="">
            <div className="flex justify-center md:w-20 md:h-screen items-center bg-zinc-50 w-screen h-20">
                <div className="flex md:flex-col  md:gap-16 gap-5  flex-row ">
                    <Link href={"/"} className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={22} src="/assets/home.svg" alt="home" />
                    </Link>
                    <Link href={"/search"} className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={22} src="/assets/search.svg" alt="search" />
                    </Link>
                    <div onClick={()=>setIsShow((prv)=>!prv)}  className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={23} src="/assets/write.svg" alt="" />
                    </div>
                    <Link href={"/messages"}className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={23} src="/assets/chat.svg" alt="chat" />
                    </Link>
                    <Link href={"/activity"}className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={22} src="/assets/heart.svg" alt="heart" />
                    </Link>
                    <Link href={`/@${userId}`} className="hover:bg-slate-200 p-3 rounded-lg">
                        <img width={20} src="/assets/profile.svg" alt="profile" />
                    </Link>
                </div>
            </div>
            {
                isShow && (
                    <div className="z-50 fixed top-0 left-0 w-full h-full bg-black bg-opacity-60" onClick={toggleModal}>
                        <div className="absolute left-16 right-0 h-full flex flex-col items-center justify-center">
                            <span className="py-5 text-white font-bold">Thread mới</span>
                            <div onClick={(e) => e.stopPropagation()} className=" bg-white p-3 rounded-lg shadow-lg w-[600px]">
                                <div className="flex items-start mb-4">
                                {
                                    dataUserDetails?.userDetails?.[0]?.avatar ? (
                                        <img className="rounded-full w-8 h-8 bg-cover" src={dataUserDetails.userDetails[0].avatar} alt="avatar" />
                                    ) : (
                                        <img className="rounded-full w-8 h-8 bg-cover" src="/assets/avt.png" alt="avatar" />
                                    )
                                }
                                <div className="ml-4 w-full">
                                    <div className="font-semibold">{userId}</div>
                                        <LexicalEditor setOnchange={setContent}/>
                                        {images.length > 0 && (
                                            <div className="flex flex-wrap mt-4">
                                                {images.map((img, index) => (
                                                    <img key={index} src={img} className="w-28 h-28 m-1 object-cover" alt={`image-${index}`} />
                                                ))}
                                            </div>
                                        )}
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
                                            multiple  // Add this line
                                            onChange={handleImageUpload}
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
                                <div className="flex justify-between w-full items-center">
                                    <div className="text-gray-400 mb-4">Bất kỳ ai cũng có thể trả lời và trích dẫn</div>
                                    <button onClick={handleUploadThread} className="border border-gray-400 text-black px-4 py-2 rounded-lg">Đăng</button>
                                </div>
                            </div>
                        </div>
                    </div>                           
                )
            }
        </div>
    )
}