import Siderbar from "@/components/Sidebar";
import Header from "@/components/Header";
import UploadThread from "@/components/UploadThread";
import Article from "@/components/ArticleHeader";
import ArticleHeader from "@/components/ArticleHeader";
import ArticleBody from "@/components/ArticleBody";
import ArticleFooter from "@/components/ArticleFooter";

export default function Home() {
  return (
    <div className="flex flex-row overflow-hidden h-screen">
      <Siderbar/>
      <div className="flex flex-row justify-center mt-2 w-full">
        <div className="max-w-screen-sm w-full h-screen">
          <Header/>
          <div className="flex flex-col border border-gray-300 w-full rounded-xl mt-10 h-screen overflow-y-scroll f">
              <div className="w-full h-[80px]">
                  <UploadThread/>
              </div>
              <div className="w-full h-full">
                <div >
                  <ArticleHeader/>
                  <ArticleBody/>
                  <ArticleFooter/>
                </div>
                <div>
                  <ArticleHeader/>
                  <ArticleBody/>
                  <ArticleFooter/>
                </div>
              </div>
              <div>
                  <ArticleHeader/>
                  <ArticleBody/>
                  <ArticleFooter/>
                </div>
                <div>
                  <ArticleHeader/>
                  <ArticleBody/>
                  <ArticleFooter/>
                </div>
          </div>
        </div>
      </div>
    </div>
  );
}
