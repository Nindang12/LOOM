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
            src={!data?.userDetails[0].avatar ? "/assets/avt.png" : data?.userDetails[0].avatar} 
            alt={altText} 
            className={style}
            style={{ width: width, height: height, borderRadius: '50%' }} 
        />
    );
};

export default Avatar;