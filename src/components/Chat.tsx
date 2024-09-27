'use client'
import { getUserId } from "@/utils/auth";

const Chat = () => {

    const userId = getUserId();

    return(
        <div className="flex h-screen w-full">
            <div className="w-[20%] border-r border-gray-300">
                <div className="flex items-center justify-between p-4 border-b border-gray-300">
                    <div className="flex items-center">
                        <img src="https://placehold.co/40x40" alt="User profile" className="rounded-full" />
                        <span className="ml-2">{userId}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img src="/assets/pen.svg" alt="pencil" width={20}/>
                        <img src="/assets/info.svg" alt="info" width={22}/>
                    </div>
                </div>
                <div className="flex justify-between p-4">
                    <button className="font-bold">PRIMARY</button>
                    <button className="text-gray-500">GENERAL</button>
                </div>
                <div className="p-4">
                    <div className="flex items-center p-2 bg-gray-100 rounded-lg mb-2">
                        <img src="https://placehold.co/40x40" alt="Contact profile" className="rounded-full" />
                        <div className="ml-2">
                            <div className="font-bold">Contact Name</div>
                            <div className="text-sm text-green-500">Active now</div>
                        </div>
                    </div>
                    <div className="flex items-center p-2 mb-2">
                        <img src="https://placehold.co/40x40" alt="Contact profile" className="rounded-full" />
                        <div className="ml-2">
                            <div className="font-bold">ContactName</div>
                            <div className="text-sm text-gray-500">Active 1h ago</div>
                        </div>
                    </div>
                    <div className="flex items-center p-2 mb-2">
                        <img src="https://placehold.co/40x40" alt="Contact profile" className="rounded-full" />
                        <div className="ml-2">
                            <div className="font-bold">alphr101</div>
                            <div className="text-sm text-gray-500">test · 5d</div>
                        </div>
                    </div>
                    <div className="flex items-center p-2 mb-2">
                        <img src="https://placehold.co/40x40" alt="Contact profile" className="rounded-full" />
                        <div className="ml-2">
                            <div className="font-bold">Contact Name</div>
                            <div className="text-sm text-gray-500">Sent you a message · 1w</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full flex flex-col">
                <div className="flex items-center justify-between p-[14px] border-b border-gray-300">
                    <div className="flex items-center">
                        <img src="https://placehold.co/40x40" alt="User profile" className="rounded-full" />
                        <div className="ml-2">
                            <div className="font-bold">Contact Name</div>
                            <div className="text-sm text-green-500">Active now</div>
                        </div>
                    </div>
                    <i className="fas fa-info-circle"></i>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="flex justify-start mb-4">
                        <img src="https://placehold.co/40x40" alt="User profile" className="rounded-full" />
                        <div className="ml-2 p-2 bg-gray-100 rounded-lg">Thanks</div>
                        <div className="ml-2 text-xs text-gray-500 self-end">3:01 AM</div>
                    </div>
                    <div className="flex justify-start mb-4">
                        <img src="https://placehold.co/40x40" alt="User profile" className="rounded-full" />
                        <div className="ml-2 p-2 bg-gray-100 rounded-lg">How are you?</div>
                        <div className="ml-2 text-xs text-gray-500 self-end">4:07 AM</div>
                    </div>
                </div>
                <div className="p-4 gap-5 border-t border-gray-300 flex items-center">
                    <button>
                        <img src="/assets/smile.svg" alt="smile" width={27}/>
                    </button>
                    <input type="text" placeholder="Message..." className="flex-1 p-2 px-3 font-thin border border-gray-300 rounded-lg outline-none" />
                    <button>
                        <img src="/assets/image.svg" alt="image" width={22}/>
                    </button>
                    <button>
                        <img src="/assets/heart.svg" alt="heart" width={30}/>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Chat