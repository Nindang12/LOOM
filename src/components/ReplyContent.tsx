import { useEffect, useState } from "react";

const ReplyContent = ({post, comment}: {post: Post, comment: Comment}) => {
    const [images, setImages] = useState([]);
    const [timeAgoPost, setTimeAgoPost] = useState('');
    const [timeAgoComment, setTimeAgoComment] = useState('');
    const getImagesForPost = async () => {
        if (!post.post_id) return;

        try {
            const response = await fetch(`/api/photo?postId=${post.post_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                setImages(result.photos);
            } else {
                console.error('Failed to fetch images for post');
            }
        } catch (error) {
            console.error('Error fetching images for post:', error);
        }
    };

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(post.create_at)) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgoPost(`${diffInSeconds} giây`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgoPost(`${minutes} phút`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgoPost(`${hours} giờ`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setTimeAgoPost(`${days} ngày`);
            }
        };

        calculateTimeAgo();
        const timer = setInterval(calculateTimeAgo, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [post.create_at]);

    useEffect(() => {
        const calculateTimeAgo = () => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((now - Number(comment.create_at)) / 1000);

            if (diffInSeconds < 60) {
                setTimeAgoComment(`${diffInSeconds} giây`);
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                setTimeAgoComment(`${minutes} phút`);
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                setTimeAgoComment(`${hours} giờ`);
            } else {
                const days = Math.floor(diffInSeconds / 86400);
                setTimeAgoComment(`${days} ngày`);
            }
        };

        calculateTimeAgo();
        const timer = setInterval(calculateTimeAgo, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [comment.create_at]);

    useEffect(() => {
        getImagesForPost();
    }, [post.post_id]);

    return(
        <div className="relative" >
            <div className="flex items-start mb-4">
                <img src="https://placehold.co/40x40" alt="User profile picture" className="rounded-full w-10 h-10 mr-3"/>
                <div>
                    <div className="flex items-center mb-1">
                        <span className="font-bold mr-2">{post.user_id}</span>
                        <span className="text-gray-500 text-sm">{timeAgoPost}</span>
                    </div>
                    <p className="mb-3">{JSON.parse(post.post_content)}</p>
                    <div className="flex overflow-x-scroll gap-2 ">
                        {images.map((image:Image,index) => {
                            return(
                                <div key={index} className="rounded-lg w-64 h-64 bg-gray-200 flex items-center justify-center">
                                    <img src={image.photo_content} alt={`image`} className="object-cover w-full h-full rounded-lg" />
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex flex-row items-center text-gray-500 text-sm">
                        <span className="mr-4  flex gap-2"><img width={20} src="/assets/heartonarticle.svg" alt="" /> 2,7K</span>
                        <span className="mr-4  flex gap-2"><img width={20} src="/assets/comment.svg" alt="" /> 36</span>
                        <span className="mr-4  flex gap-2"><img width={20} src="/assets/replay.svg" alt="" /> 9</span>
                        <span className="mr-4  flex gap-2"><img width={30} src="/assets/share.svg" alt="" /> 53</span>
                    </div>
                </div>
            </div>
            <div className="flex items-start">
                <img src="https://placehold.co/40x40" alt="User profile picture" className="rounded-full w-10 h-10 mr-3"/>
                <div>
                    <div className="flex items-center mb-1">
                        <span className="font-bold mr-2">{comment.user_id}</span>
                        <span className="text-gray-500 text-sm">{timeAgoComment}</span>
                    </div>
                    <p className="mb-3">{comment.comment_content}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-4"><i className="fas fa-heart"></i></span>
                        <span className="mr-4"><i className="fas fa-comment"></i></span>
                        <span className="mr-4"><i className="fas fa-share"></i></span>
                        <span><i className="fas fa-bookmark"></i></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReplyContent;