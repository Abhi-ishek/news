import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../service/api";

function EditNews() {
  const { id } = useParams();
  const [news, setNews] = useState({
    title: "",
    content: "",
    category: ""
  });
  const [files, setFiles] = useState({
    image: null,
    video: null
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewsAndCategories();
  }, [id]);

  const fetchNewsAndCategories = async () => {
    try {
      const newsRes = await API.get(`/news/${id}`);
      const catRes = await API.get("/categories");
      
      const { title, content, category } = newsRes.data;
      setNews({ title, content, category });
      setCategories(catRes.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
      navigate("/profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData();
    formData.append("title", news.title);
    formData.append("content", news.content);
    formData.append("category", news.category);
    if (files.image) formData.append("image", files.image);
    if (files.video) formData.append("video", files.video);

    try {
      await API.put(`/news/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("Article updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update article");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 scale-up-center">
      <div className="bg-slate-900 border border-slate-800 p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>
        
        <header className="mb-10 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-2xl mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Edit Article</h2>
          <p className="text-slate-400">Refine your story and keep your readers updated</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Article Title</label>
              <input 
                required
                placeholder="The next big thing..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold"
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
              rows={10}
              placeholder="Update your story here..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none leading-relaxed"
              value={news.content}
              onChange={e => setNews({ ...news, content: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Replace Image (Optional)</label>
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
                  className="w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-slate-400"
                >
                  {files.image ? (
                    <span className="text-sm font-medium text-blue-400 truncate w-full text-center">{files.image.name}</span>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2 opacity-50 font-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Click to change cover image</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Replace Video (Optional)</label>
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
                  className="w-full bg-slate-950 border-2 border-dashed border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-slate-400"
                >
                  {files.video ? (
                    <span className="text-sm font-medium text-emerald-400 truncate w-full text-center">{files.video.name}</span>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs">Click to change video story</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
             <button 
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={updating}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {updating ? (
                 <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditNews;
