import { init } from "@instantdb/react"

type Schema = {
    users: {
        id: string
        userId: string
        createdAt: number
    },
    user_details: {
        id: string
        userId: string
        createdAt: number
        password: string
        fullname: string
        email: string
        phone: string
        address: string
        avatar: string
        status: string
    },
    posts: {
        id: string
        userId: string
        createdAt: number
        content: string
        images: string[],
        repost: string,
    },
    comments: {
        id: string
        userId: string
        createdAt: number
        content: string
        images: string[]
    },
    actionLikeComment: {
        id: string
        userId: string
        createdAt: number
        commentId: string
    },
    actionLikePost: {
        id: string
        userId: string
        createdAt: number
        postId: string
    }
}

export const APP_ID = '5e07a141-e7d9-4273-9cba-877a820f73dd';
export const db = init<Schema>({ appId: APP_ID })