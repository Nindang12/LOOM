import Link from "next/link"

export default function Siderbar(){
    return(
        <div className="    ">
            <div className="flex justify-center md:w-20 md:h-screen items-center bg-zinc-50 w-screen h-20">
            <div className="flex md:flex-col  md:gap-16 gap-10 flex-row ">
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
        </div>
    )
}