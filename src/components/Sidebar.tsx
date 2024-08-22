import Link from "next/link"

export default function Siderbar(){
    return(
        <div className="flex flex-col justify-center w-20 h-screen items-center">
            <div className="flex flex-col gap-10 ">
                <Link href={"/"} className="hover:bg-slate-200 p-3 rounded-lg">
                    <img width={20} src="/assets/home.svg" alt="home" />
                </Link>
                <Link href={"/search"} className="hover:bg-slate-200 p-3 rounded-lg">
                    <img width={20} src="/assets/search.svg" alt="search" />
                </Link>
                <Link href={"/activity"}className="hover:bg-slate-200 p-3 rounded-lg">
                    <img width={20} src="/assets/heart.svg" alt="heart" />
                </Link>
                <Link href={"/profile"} className="hover:bg-slate-200 p-3 rounded-lg">
                <img width={20} src="/assets/profile.svg" alt="profile" />
                </Link>
            </div>
        </div>
    )
}