interface Profile{
    username?: string,
    fullname?: string
}
interface Post {
    id: string;
    postId: string;
    postContent: string;
    userId: string;
    createdAt: number;
    images: string[];
    repost: string;
}

interface ArticleProps {
    user_id?: string;
    content?: string;
    postId?: string;
    images?: string[];
}

interface Post {
    post_id: string;
    post_content: string;
    user_id: string;
    create_at: number;
    // Add any other properties that might be present in the post object
  }

interface Comment {
    content: string;
    commentId: string;
    createdAt: string;
    userId: string;
    postId?: string;
}

interface AccountData {
    user_id: string;
    username: string;
    fullname: string;
    image: string;
    gender: string;
    email: string; 
    phone_number: string;
    location: string;
    point: number;
}

interface Image {
    photo_id: string;
    photo_content: string;
}