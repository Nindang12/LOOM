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
}