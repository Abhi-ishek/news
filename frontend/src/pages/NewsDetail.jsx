import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../service/api";
import Comments from "../components/Comments";

function NewsDetail() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const backendURL = "http://localhost:5000";

  useEffect(() => {
    API.get(`/news/${id}`)
      .then(res => {
        setNews(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-10 px-4 space-y-12">
        <div className="space-y-6">
          <div className="h-6 w-32 bg-slate-800 rounded-full animate-pulse"></div>
          <div className="h-20 w-full bg-slate-900 border border-slate-800 rounded-2xl animate-shimmer"></div>
          <div className="flex gap-4">
             <div className="w-12 h-12 rounded-full bg-slate-800 animate-pulse"></div>
             <div className="space-y-2">
                <div className="h-4 w-32 bg-slate-800 rounded-full animate-pulse"></div>
                <div className="h-3 w-24 bg-slate-800 rounded-full animate-pulse"></div>
             </div>
          </div>
        </div>
        <div className="h-[400px] w-full bg-slate-900 border border-slate-800 rounded-3xl animate-shimmer"></div>
        <div className="space-y-4">
           {[1,2,3,4].map(i => (
             <div key={i} className="h-6 w-full bg-slate-800/50 rounded-lg animate-pulse"></div>
           ))}
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Article Not Found</h2>
        <Link to="/" className="text-blue-400 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 scale-up-center">
      {/* Hero Section */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
             </svg>
             Back to Feed
          </Link>
          <span className="w-1 h-1 rounded-full bg-slate-800"></span>
          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest leading-none">
            {news.category || "General"}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
          {news.title}
        </h1>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {news.author?.name ? news.author.name[0].toUpperCase() : "A"}
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none mb-1">
              By {news.author?.name || "Anonymous"}
            </p>
            <p className="text-slate-500 text-sm">
              Published on {new Date(news.createdAt).toLocaleDateString('en-US', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-12">
        {/* Media Block */}
        {(news.image || news.video) && (
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/5 bg-slate-900 border border-slate-800">
            {news.image ? (
              <img 
                src={`${backendURL}${news.image}`} 
                alt={news.title}
                className="w-full object-cover max-h-[600px]"
              />
            ) : (
              <video 
                src={`${backendURL}${news.video}`}
                controls
                className="w-full max-h-[600px]"
              />
            )}
          </div>
        )}

        {/* Article Text */}
        <div className="prose prose-invert prose-xl max-w-none">
          <p className="text-slate-300 leading-relaxed whitespace-pre-wrap text-xl md:text-2xl font-medium">
             {news.content}
          </p>
        </div>

        {/* Engagement Section */}
        <div className="pt-12 border-t border-slate-800">
          <div className="flex items-center justify-between mb-10">
             <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Discussion
             </h3>
             <div className="flex items-center gap-3">
                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest mr-2">Share story</span>
                <button 
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-blue-400/50 transition-all flex items-center justify-center group"
                  title="Share on X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button 
                  onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(news.title + ' ' + window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-400 hover:border-emerald-400/50 transition-all flex items-center justify-center"
                  title="Share on WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </button>
                <button 
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                  className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-600 hover:border-blue-600/50 transition-all flex items-center justify-center"
                  title="Share on Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
             </div>
          </div>
          
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-8">
             <Comments newsId={news._id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
