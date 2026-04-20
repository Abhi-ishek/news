import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../service/api";

function Admin() {
  const [news, setNews] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [files, setFiles] = useState({
    image: null,
    video: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    
    API.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", news.title);
    formData.append("content", news.content);
    formData.append("category", news.category);
    if (files.image) formData.append("image", files.image);
    if (files.video) formData.append("video", files.video);

    try {
      await API.post("/news", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(true);
      setNews({ title: "", content: "", category: "" });
      setFiles({ image: null, video: null });
      setTimeout(() => navigate("/profile"), 1500);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to publish news");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 scale-up-center">
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Decorative corner element */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>
        
        <header className="mb-10 text-center relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Publisher Studio</h2>
          <p className="text-slate-400">Create and distribute breaking news stories</p>
        </header>

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl mb-8 flex items-center gap-3 animate-pulse">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Story published successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Article Title</label>
              <input 
                required
                placeholder="The next big thing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                value={news.title}
                onChange={e => setNews({ ...news, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Category</label>
              <select 
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                value={news.category}
                onChange={e => setNews({ ...news, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Article Content</label>
            <textarea 
              required
              rows={8}
              placeholder="Write your story here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
              value={news.content}
              onChange={e => setNews({ ...news, content: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Header Image</label>
              <div className="relative group/file">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={e => setFiles({ ...files, image: e.target.files[0] })}
                  className="hidden"
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload"
                  className="w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-slate-400 group-hover/file:text-blue-400"
                >
                  {files.image ? (
                    <div className="flex flex-col items-center text-center">
                      <svg className="w-8 h-8 mb-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-emerald-400 max-w-37.5 truncate">{files.image.name}</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Click to select image</span>
                      <span className="text-xs opacity-50 mt-1">PNG, JPG, WebP</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Video Story (Optional)</label>
              <div className="relative group/file">
                <input 
                  type="file"
                  accept="video/*"
                  onChange={e => setFiles({ ...files, video: e.target.files[0] })}
                  className="hidden"
                  id="video-upload"
                />
                <label 
                  htmlFor="video-upload"
                  className="w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-slate-400 group-hover/file:text-emerald-400"
                >
                  {files.video ? (
                    <div className="flex flex-col items-center text-center">
                      <svg className="w-8 h-8 mb-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-emerald-400 max-w-37.5 truncate">{files.video.name}</span>
                    </div>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium">Click to select video</span>
                      <span className="text-xs opacity-50 mt-1">MP4, WebM (Max 50MB)</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2 group"
          >
            {loading ? (
               <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Confirm and Publish
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Admin;