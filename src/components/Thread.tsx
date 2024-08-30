import Link from "next/link"
export default function Thread(){

    return(
        // header
        <div>
            
        {/* header2 */}
            <div className="mr-[20px] ml-[20px]">
            <div className="flex flex-row justify-between text-sm mb-[4px]">
                <div className="w-[200px] h-[30px]">
                    <span className="font-bold">Hoàn tất trang cá nhân</span>
                </div>
                <div>
                    <span>Còn 4</span>
                </div>
            </div>
            
            <div className="max-h-[220px] w-full flex items-start overflow-x-scroll overflow-y-hidden gap-2">
                {/* add ảnh */}
                <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                    <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                        <img width={25} src="/assets/camera.svg" alt="" />
                    </div>
                    <span className="text-sm mb-2 font-semibold whitespace-pre-line">Thêm ảnh đại diện</span>
                    <p className="px-2 mb-4 text-center text-xs text-gray-400">
                    Giúp mọi người dễ dàng nhận ra bạn hơn.
                    </p>
                    <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                        <span className="text-sm font-bold text-white ">Thêm</span>
                    </div>
                </div>
                {/* add tiểu sử */}
                <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                    <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                        <img width={25} src="/assets/pen.svg" alt="" />
                    </div>
                    <span className="text-sm mb-2 font-semibold whitespace-pre-line">Thêm tiểu sử</span>
                    <p className="px-2 mb-4 text-center text-xs text-gray-400">
                    Hãy giới thiệu về bản thân và cho mọi người biết bạn thích gì.
                    </p>
                    <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                        <span className="text-sm font-bold text-white ">Thêm</span>
                    </div>
                </div>
                {/* theo doi trang */}
                <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                    <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                        <img width={25} src="/assets/addfriends.svg" alt="" />
                    </div>
                    <span className="text-sm mb-2 px-3 text-center font-semibold whitespace-pre-line">Theo dõi 5 trang cá nhân</span>
                    <p className="px-2 mb-4 text-center text-xs text-gray-400">
                    Tạo điều kiện để bảng feed của bạn hiển thị những thread bạn quan tâm.  
                    </p>
                    <Link href={'/search'}>
                    <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                        <span className="text-sm font-bold text-white ">Xem trang cá nhân</span>
                    </div>
                    </Link>
                </div>
                {/* tạo thread */}
                <div className="w-[260px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                    <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                        <img width={25} src="/assets/write`.svg" alt="" />
                    </div>
                    <span className="text-sm mb-2 font-semibold whitespace-pre-line">Tạo thread</span>
                    <p className="px-2 mb-4 text-center text-xs text-gray-400">
                    Cho mọi người biết bạn đang nghĩ gì hoặc chia sẻ về một hoạt động nổi bật mới đây.
                    </p>
                    <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                        <span className="text-sm font-bold text-white ">Thêm</span>
                    </div>
                </div>

            </div>
            </div>
        </div>
        
    )
}