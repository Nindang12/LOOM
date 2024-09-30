import Sidebar from "@/components/Sidebar"
import ChatList from "@/components/ChatList"

const Messages = async () => {

    return (
        <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Sidebar />
            <div className="flex flex-row justify-center mt-2 w-full">
                <ChatList />
            </div>
        </div>
    )
}

export default Messages