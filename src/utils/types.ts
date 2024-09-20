interface Profile{
    username?: string,
    fullname?: string
}
interface Post {
    post_id: string;
    post_content: string;
    user_id: string;
    create_at: number;
}

interface ArticleProps {
    user_id?: string;
    content?: string;
    postId?: string;
}

interface Post {
    post_id: string;
    post_content: string;
    user_id: string;
    create_at: number;
    // Add any other properties that might be present in the post object
  }

interface Comment {
    comment_content: string;
    comment_id: string;
    create_at: string;
    like_count: number;
    user_id: string;
    postId: string;
}