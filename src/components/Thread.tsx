export default function Thread(){
    return(
        <div>
            <div className="flex flex-row justify-between text-sm mb-[4px]">
                <div className="w-[200px] h-[30px]">
                    <span className="font-bold">Hoàn tất trang cá nhân</span>
                </div>
                <div>
                    <span>Còn 4</span>
                </div>
            </div>
            
            <div className="max-h-[230px] w-full flex items-center">
                {/* blocktr */}
                <div className="w-[195px] h-full flex flex-col justify-center rounded-xl items-center bg-gray-100">
                    <div className="mt-1 mb-3 flex items-center justify-center rounded-full bg-white w-[50px] h-[50px]">
                        <img width={25} src="/assets/camera.svg" alt="" />
                    </div>
                    <span className="text-sm mb-2 font-semibold whitespace-pre-line">Thêm ảnh đại diện</span>
                    <p className="px-3 mb-4 text-center text-xs text-gray-400">
                    Giúp mọi người giúp mọi người dễ dàng
                    nhận ra bạn hơn
                    </p>
                    <div className="mb-3 w-[170px] h-[30px] flex rounded-lg items-center bg-black justify-center ">
                        <span className="text-sm font-bold text-white ">Thêm</span>
                    </div>
                </div>

            </div>
        </div>
        
    )
}