export default function Login(){
    return(
        <div className="flex flex-col justify-center items-center h-screen gap-2">
             <span className="mb-1 font-bold">
                Đăng nhập
            </span>
            <div className="w-full px-3 flex justify-center">
                <input className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" type="text" id=""placeholder="Tên người dùng, số điện thoại hoặc email" />
            </div>
            <div className="w-full px-3 flex justify-center">
                <input className="md:w-[370px] w-full px-6 py-4 focus outline-none border border-gray-300 border-solid  rounded-2xl bg-gray-100 text-sm" type="password" id=""placeholder="Mật khẩu" />
            </div>
            <div className="w-full px-3 flex justify-center">
                <button className="md:w-[370px] w-full px-6 py-4  rounded-2xl bg-black text-white font-bold text-sm">Đăng nhập</button>
            </div>
            <button className="text-gray-400 text-sm mt-2">Bạn quên mật khẩu ư?</button>

        </div>
    )
}