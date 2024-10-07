import {db} from "@/utils/contants";
import { tx,id } from "@instantdb/react";

const Active = ({request,currentUserId}: {request: any,currentUserId: string}) => {

    const queryUserDetails = {
        userDetails: {
            $: {
                where: {
                    userId: request.userId
                }
            }
        }
    }
    const { data: dataUserDetails } = db.useQuery(queryUserDetails)

    const queryFriendships = {
        friendships: {
            $: {
                where: {
                    and: [
                        {isFriend: true},
                        { friendId: currentUserId },
                        { userId: request.userId }
                    ]
                }
            }
        }
    }
    const { data: dataFriendships } = db.useQuery(queryFriendships)

    //console.log(dataFriendships)

    const acceptFriend = async (userId: string, friendId: string,idRequest: string) => {
        if (!userId || !friendId) return;

        try {
            await db.transact([
                tx.friendships[id()].update({
                    userId: friendId,
                    friendId: userId,
                    isFriend: true,
                    isFollowing: true,
                    isPendingRequest: false,
                    createdAt: Date.now()
                })
            ]);
            await db.transact([
                tx.friendships[idRequest].update({
                    userId: userId,
                    friendId: friendId,
                    isFriend: true, 
                    isPendingRequest: false,
                    createdAt: Date.now()
                })
            ]);
            console.log('Friend request accepted successfully');
        } catch (error) {
            console.error('Error accepting friend request:', error);
            alert('Error accepting friend request. Please try again.');
        }
    };

    const calculateTimeAgo = (timestamp: number) => {
        const now = new Date();
        const past = new Date(timestamp);
        const secondsPast = (now.getTime() - past.getTime()) / 1000;

        if (secondsPast < 60) {
            return `${Math.floor(secondsPast)} giây trước`;
        }
        if (secondsPast < 3600) {
            return `${Math.floor(secondsPast / 60)} phút trước`;
        }
        if (secondsPast <= 86400) {
            return `${Math.floor(secondsPast / 3600)} giờ trước`;
        }
        if (secondsPast <= 2592000) {
            return `${Math.floor(secondsPast / 86400)} ngày trước`;
        }
        if (secondsPast <= 31536000) {
            return `${Math.floor(secondsPast / 2592000)} tháng trước`;
        }
        return `${Math.floor(secondsPast / 31536000)} năm trước`;
    };
    
    const isFollowing = dataFriendships?.friendships.some((friendship: any) => friendship.isFollowing);
    // console.log(dataFriendships)
    return (
        <div key={request.id} className="flex items-center mt-2 ml-5 p-2">
            <div className="flex flex-row gap-2">
                {
                    dataUserDetails && dataUserDetails?.userDetails?.[0]?.avatar ? (
                        <img src={dataUserDetails?.userDetails?.[0]?.avatar} alt="Profile picture of the user" className="w-10 h-10 rounded-full" />
                    ) : (
                        <img src="https://placehold.co/40x40" alt="Profile picture of the user" className="w-10 h-10 rounded-full" />
                    )
                }
                <div className="flex flex-col">
                    <span className="font-bold text-sm">{request.userId}</span>
                    <span className="text-sm text-gray-400">đã bắt đầu theo dõi bạn. {calculateTimeAgo(request.createdAt)}</span>
                </div>
            </div>
            {
                isFollowing ? (
                    <span className="ml-auto text-sm text-gray-400">Đã theo dõi</span>
                ) : (
                    <button onClick={() => acceptFriend(currentUserId as string, request.userId as string,request.id as string)} className="ml-auto bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
                        Follow
                    </button>
                )
            }
        </div>
    )
}

export default Active