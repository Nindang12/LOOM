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
    }
}

export const APP_ID = '5e07a141-e7d9-4273-9cba-877a820f73dd';
export const db = init<Schema>({ appId: APP_ID })