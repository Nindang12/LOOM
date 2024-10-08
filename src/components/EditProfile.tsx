import { getUserId, logout } from "@/utils/auth";
import { db } from "@/utils/contants";
import { useState, useEffect } from "react";
import {tx,id} from "@instantdb/react"
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EditProfile(){
    const [isEditProfile, setIsEditProfile] = useState<boolean>(false);
    const [userId, setUserId] = useState<string|null>(null);
    const [image, setImage] = useState<string|null>(null);
    const [bio, setBio] = useState<string|null>(null)
    const [link,setLink] = useState<string|null>(null)
    const [username, setUsername] = useState<string>("")
    const [fullname,setFullname] = useState<string>("")
    const [isEditFullname,setIsEditFullname] = useState<boolean>(false)
    const [isEditUsername,setIsEditUsername] = useState<boolean>(false)

    const router = useRouter()
    
    
    useEffect(() => {
        if(typeof window !== 'undefined'){
            const userId = getUserId();
            setUserId(userId);
        }
    }, []);

    const queryUserDetails = {
        userDetails:{
            $:{
                where:{
                    userId: userId
                }
            }
        }
    }

    const {data, error} = db.useQuery(queryUserDetails);

    const queryUser = {
        users:{
            $:{
                where:{
                    userId: userId
                }
            }
        }
    }
    const {data:dataUser, error:errorUser} = db.useQuery(queryUser);

    const onClose = () => {
        setIsEditProfile(false);
        setIsEditFullname(false)
        setIsEditUsername(false)
    }


    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditProfile = () =>{
        try{
            if(data&&dataUser){
                db.transact(
                    [tx.userDetails[data?.userDetails[0]?.id].update(
                        {
                            fullname: fullname || data?.userDetails[0]?.fullname,
                            avatar: image || data?.userDetails[0]?.avatar,
                            bio: bio || data?.userDetails[0]?.bio,
                            link: link || data?.userDetails[0]?.link,
                        }
                    )]
                );
                setImage(null);
                setIsEditProfile(false);
                setIsEditFullname(false)
                toast.success("Cập nhật thành công");  
            }
        }catch(err){
            console.log(err)
        }
    }


    const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsEditFullname(true)
        setFullname(event.target.value);
    };

    return(
        <div className="relative">
            <div className="flex items-center justify-center mt-[20px]">
                <button className="w-11/12 h-[38px] text-sm font-bold border-solid border rounded-lg" onClick={() => setIsEditProfile(true)}>
                    <span>Chỉnh sửa trang cá nhân</span>
                </button>
            </div>
            {
                isEditProfile && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
                        <div className="bg-white rounded-lg p-6 w-[28rem]">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold">Chỉnh sửa trang cá nhân</h2>
                                <button onClick={onClose} className="text-gray-500 hover:text-black">
                                    &times;
                                </button>
                            </div>
                            <div className="mb-4 flex flex-row items-center justify-between gap-3">
                                <div className="w-full">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và Tên</label>
                                    <input
                                        value={fullname?.length >= 0 && isEditFullname ? fullname : data && data?.userDetails[0]?.fullname}
                                        onChange={handleFullnameChange}
                                        type="text"
                                        id="name"
                                        className="mt-1 block w-full border-b border-gray-300 py-1 focus:outline-none focus:border-b focus:border-black"
                                    />
                                </div>
                                {
                                    image || data?.userDetails[0]?.avatar ? (
                                        <img className="w-16 h-16 rounded-full border border-gray" src={image || data?.userDetails[0]?.avatar as string} alt="avatar" />
                                    ):(
                                        <div className="w-16 flex justify-end">
                                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="upload-image" />
                                            <label htmlFor="upload-image" className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer">
                                                <img className="w-5 h-5" src={"/assets/addpeople.svg"} alt="avatar" />
                                            </label>
                                        </div>
                                    )
                                }
                            </div>
                            <div className="mb-4">
                                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Tên người dùng</label>
                                <input
                                    value={data && data?.userDetails[0]?.userId}
                                    disabled
                                    type="text"
                                    id="userId"
                                    className="mt-1 block w-full border-b border-gray-300 py-1 focus:outline-none focus:border-b focus:border-black"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Tiểu sử</label>
                                <textarea value={bio as string} onChange={(e) => setBio(e.target.value)} className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-b focus:border-black"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Các liên kết</label>
                                <input value={link as string} onChange={(e) => setLink(e.target.value)} type="text" className="mt-1 block w-full border-b border-gray-300 focus:outline-none focus:border-b focus:border-black" />
                            </div>
                            <div className="flex items-center mb-4">
                                <label className="block text-sm font-medium text-gray-700 mr-2">Ẩn trang cá nhân</label>
                                <input type="checkbox" className="form-checkbox" />
                            </div>
                            <button onClick={handleEditProfile} className="w-full bg-black text-white py-2 rounded-md focus:outline-none">Hoàn tất</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}