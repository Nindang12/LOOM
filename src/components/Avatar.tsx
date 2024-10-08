import { db } from "@/utils/contants";


const Avatar = ({ userId, altText, width, height,style }: { userId?: string, altText?: string, width?: number, height?: number,style?: string }) => {
    
    const queryUserDetails = {
        userDetails: {
            $: {
                where: {
                    userId: userId
                }
            }
        }
    }

    const { data } = db.useQuery(queryUserDetails)


    return (
        <img 
            src={data?.userDetails[0].avatar ? data?.userDetails[0].avatar : `https://api.dicebear.com/6.x/initials/svg?seed=${userId}`} 
            alt={altText} 
            className={style}
            style={{ width: width, height: height, borderRadius: '50%' }} 
        />
    );
};

export default Avatar;