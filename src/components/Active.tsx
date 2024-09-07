import Link from "next/link"
export default function Active(){
    return(
        <div className="flex flex-col">
            <div className="flex flex-col mt-2 ml-5 cursor-pointer">
            <div className="flex flex-row    gap-2   ">
                <Link href={'/search'}>
                    <img className=" rounded-full mt-2 z-0 w-8 h-8 bg-cover " src="/assets/logo.png" alt=""></img>           
                </Link>
                <div className="flex flex-col ">
                   <div className="flex gap-2 items-center">
                   <p className="space-x-1">
                    <Link href={`/chien_ha`} className="font-bold text-sm">
                        <span className="">chien_ha</span>
                    </Link>
                    , 
                    <Link href={`/nhan_vo`} className="font-bold text-sm pr-1">
                        <span className="">nhan_vo</span>
                    </Link>
                    và
                    <Link href={`/chien_ha`} className="font-bold text-sm">
                        <span className="">chien_ha</span>
                    </Link>
                    </p>
                    <span className="text-sm text-gray-400">20 giờ</span>
                   </div>
                    <Link href={'/search'} className="text-sm text-gray-400 mb-5        ">
                        <p>Xem thêm gợi ý theo dõi</p>
                    </Link>
                </div>
            </div>
            <div className="w-[568px] h-[1px] bg-gray-300 ml-[40px] mb-5"></div>

        </div>
        {/* blockkkk */}
         </div>
    )
}