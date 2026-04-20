import { useState, useEffect } from "react";
import API from "../service/api";

function Comments({ newsId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchComments();
  }, [newsId]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${newsId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await API.post(`/comments/${newsId}`, { text });
      // The backend returns the comment, but we need the user name for display.
      // Since it's the current user, we can optimisticially add it if we had the user info, 
      // but simpler to just re-fetch or assume the backend populated it if we modify the controller.
      // Actually, let's just re-fetch for simplicity and reliability.
      fetchComments();
      setText("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    }
  };

  return (
    <div className="mt-6 border-t border-slate-800 pt-6 animate-fade-in">
      <h4 className="text-white font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        Discussion ({comments.length})
      </h4>

      {token ? (
        <form onSubmit={handlePost} className="mb-8 group">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea 
                placeholder="Share your thoughts..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none min-h-[60px]"
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all h-fit self-end"
            >
              Post
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center mb-8">
          <p className="text-slate-400 text-sm">Please <a href="/login" className="text-blue-400 hover:underline">login</a> to participate in the discussion.</p>
        </div>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="w-6 h-6 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          comments.map(c => (
            <div key={c._id} className="flex gap-4 group/comment">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                {c.user?.name?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-semibold text-sm">{c.user?.name || "Anonymous User"}</span>
                  <span className="text-slate-500 text-[10px] uppercase tracking-wider">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-slate-600 italic text-sm py-4">No comments yet. Be the first to start the conversation!</p>
        )}
      </div>
    </div>
  );
}

export default Comments;
