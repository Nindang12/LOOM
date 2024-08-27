export default function Follower(){
    return(
            <div className="flex items-center justify-between mt-[40px]">
                <button>
                    <span className="text-sm text-gray-400">0 người theo dõi</span>

                </button>
                <button>
                <img width={30} src="/assets/insta.svg" alt="" />
                </button>
            </div>
    )

}