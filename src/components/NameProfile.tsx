export default function NameProfile({fullname,username,image}:Profile){
    return(
        <div className="">
            {/* name */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col ">
                    <div>
                        <button className="w-max-[100px] font-bold text-2xl">{fullname?fullname:''}</button>
                    </div>
                    <span className="text-sm">{username?username:""}</span>
                </div>
                <div className="relative">
                    <img className="mt-[20px] rounded-full w-[85px] h-[85px] bg-cover" src={image?image:"/assets/avt.png"} alt="" />
                    <input type="file" id="avatarUpload" className="hidden" accept="image/*" />
                    {/* <label htmlFor="avatarUpload" className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 cursor-pointer">
                        <img width={16} src="/assets/upload-icon.svg" alt="upload icon" />
                    </label> */}
                </div>
            </div>
            
        </div>
    )
}