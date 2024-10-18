/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        JWT_SECRET: process.env.JWT_SECRET,
        NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL
    }
};

export default nextConfig;
