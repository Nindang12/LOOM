import Sidebar from "@/components/Sidebar"
import Chat from "@/components/Chat"

const ChatPage = async ({ params }: { params: { user_id: string } }) => {
    return (
        <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Sidebar />
            <div className="flex flex-row justify-center mt-2 w-full">
                <Chat user_id={params.user_id} />
            </div>
        </div>
    )
}

export default ChatPage