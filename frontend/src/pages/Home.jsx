import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import API from "../service/api";
import Comments from "../components/Comments";

function Home() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState(null); // stores newsId
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");
  const search = queryParams.get("search");

  useEffect(() => {
    setLoading(true);
    let url = "/news?";
    if (category) url += `category=${category}&`;
    if (search) url += `search=${search}&`;
    
    API.get(url)
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [category, search]);

  const backendURL = "http://localhost:5000";

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden h-[400px]">
            <div className="h-48 animate-shimmer"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 w-20 bg-slate-800 rounded-full animate-pulse"></div>
              <div className="h-8 w-full bg-slate-800 rounded-xl animate-pulse"></div>
              <div className="h-4 w-full bg-slate-800 rounded-lg animate-pulse"></div>
              <div className="h-4 w-2/3 bg-slate-800 rounded-lg animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4 text-white">
          Latest Feed
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Stay updated with the most recent news curated for you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.length > 0 ? (
          news.map((item) => (
            <article 
              key={item._id} 
              className="group relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col"
            >
              {/* Media Section */}
              <div className="relative h-48 overflow-hidden bg-slate-950">
                {item.image ? (
                  <img 
                    src={`${backendURL}${item.image}`} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : item.video ? (
                  <video 
                    src={`${backendURL}${item.video}`}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseOver={e => e.target.play()}
                    onMouseOut={e => e.target.pause()}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-700">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                {item.video && !item.image && (
                  <div className="absolute top-2 right-2 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-6 flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                    {item.category || "General"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                  {item.title}
                </h3>
                <p className="text-slate-400 line-clamp-3 mb-6 text-sm leading-relaxed">
                  {item.content}
                </p>
              </div>
              <div className="p-6 pt-0 mt-auto border-t border-slate-800/50 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  By {item.author?.name || "Anonymous"}
                </span>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveComments(activeComments === item._id ? null : item._id)}
                    className="text-slate-400 text-sm font-medium hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Comments
                  </button>
                  <Link 
                    to={`/news/${item._id}`}
                    className="text-blue-400 text-sm font-medium hover:underline flex items-center gap-1 group/btn"
                  >
                    Read more
                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
              {activeComments === item._id && (
                <div className="px-6 pb-6 border-t border-slate-800/50 bg-slate-900/50">
                   <Comments newsId={item._id} />
                </div>
              )}
            </article>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <h3 className="text-xl text-slate-400">No news found</h3>
            <p className="text-slate-500 mt-2">Check back later for fresh updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;