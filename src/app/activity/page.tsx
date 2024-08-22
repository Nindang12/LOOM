import Siderbar from "@/components/Sidebar"

export default function Activity(){
    return(
        <div className="flex flex-row">
            <Siderbar/>
            <div className="flex flex-col">
            <h1>Activity</h1>
            <p>Welcome to your activity page!</p>
            </div>
        </div>
    )
}