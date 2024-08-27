export default function NameProfile(){
    return(
        <div className="">
            {/* name */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col ">
                    <div>
                        <button className="w-max-[100px] font-bold text-2xl">Đặng Nin</button>
                    </div>
                    <span className="text-sm">nindang84</span>
                </div>
                <button>
                    <img className="mt-[20px] rounded-full w-[85px] h-[85px] bg-cover" src="/assets/avt.png" alt="" />
                </button>
            </div>
            
        </div>
    )
}