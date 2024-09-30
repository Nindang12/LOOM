export const getUserId = (db: any,userId: string): any | null => {
    const query = { userId: {} }
    const { isLoading, error, data } = db.useQuery(query)

    if (isLoading || error) {
        return null;
    }

    if (data && data.users && data.users.length > 0) {
        return data;
    }
    return null;
}

