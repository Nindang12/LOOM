import Siderbar from "@/components/Sidebar"
import Chat from "@/components/Chat"

const Messages = () => {
    return(
        <div className="flex md:flex-row flex-col-reverse w-full overflow-hidden h-screen">
            <Siderbar/>
            <div className="flex flex-row justify-center mt-2 w-full">
                <Chat/>
            </div>
        </div>
    )
}

export default Messages