import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../service/api";
import Comments from "../components/Comments";

function Profile() {
  const [myNews, setMyNews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: "", bio: "", avatar: null });
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [newsRes, userRes] = await Promise.all([
          API.get("/news/my-news"),
          API.get("/auth/me")
        ]);
        setMyNews(newsRes.data);
        setUser(userRes.data);
        setEditData({ name: userRes.data.name, bio: userRes.data.bio || "", avatar: null });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      await API.delete(`/news/${id}`);
      setMyNews(myNews.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete article");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("bio", editData.bio);
    if (editData.avatar) formData.append("avatar", editData.avatar);

    try {
      const res = await API.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setUser(res.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const backendURL = "http://localhost:5000";

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-10 space-y-10">
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-3xl animate-shimmer"></div>
        <div className="space-y-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-32 bg-slate-900 border border-slate-800 rounded-2xl animate-shimmer"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 scale-up-center">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 mb-10 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full"></div>

        {!isEditing ? (
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar Display */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/30 overflow-hidden">
                  {user?.avatar ? (
                    <img src={`${backendURL}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h1 className="text-4xl font-bold text-white mb-2">{user?.name || "My Profile"}</h1>
                    <p className="text-blue-400 font-medium tracking-wide uppercase text-xs">{user?.role || "Reader"}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold transition-all border border-slate-700 active:scale-95"
                  >
                    Edit Profile
                  </button>
                </div>
                
                <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-6">
                  {user?.bio || "No bio added yet. Tell us about yourself!"}
                </p>

                <div className="flex items-center justify-center md:justify-start gap-6 text-slate-500 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold">{myNews.length}</span> Published Stories
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  <div className="flex items-center gap-2">
                    Joined {user?.createdAt ? new Date(user.createdAt).getFullYear() : "Recently"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Profile Mode */
          <form onSubmit={handleUpdateProfile} className="relative z-10 space-y-6">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-slate-400 mb-4 ml-1">Profile Image</label>
                <div className="relative group cursor-pointer">
                  <input 
                    type="file" 
                    className="hidden" 
                    id="avatar-input" 
                    accept="image/*"
                    onChange={(e) => setEditData({...editData, avatar: e.target.files[0]})}
                  />
                  <label htmlFor="avatar-input" className="cursor-pointer block">
                    <div className="w-full aspect-square rounded-3xl bg-slate-950 border-2 border-dashed border-slate-800 flex flex-col items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all">
                       {editData.avatar ? (
                         <span className="text-blue-400 text-xs font-bold text-center px-4 truncate w-full">{editData.avatar.name}</span>
                       ) : user?.avatar ? (
                        <img src={`${backendURL}${user.avatar}`} alt="Avatar" className="w-full h-full object-cover rounded-2xl opacity-50" />
                       ) : (
                        <svg className="w-10 h-10 text-slate-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                       )}
                       <span className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-wider">Change Photo</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Bio</label>
                  <textarea 
                    rows={4}
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    placeholder="Tell your story..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none font-medium leading-relaxed"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="flex-[2] px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-xl shadow-blue-500/20 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {updating ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Published Articles */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">My Published Articles</h2>
        <button
          onClick={() => navigate("/admin")}
          className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Write New Article
        </button>
      </div>

      {myNews.length > 0 ? (
        <div className="space-y-4">
          {myNews.map((item) => (
            <article
              key={item._id}
              className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all hover:shadow-xl hover:shadow-blue-500/5"
            >
              <div className="flex flex-col md:flex-row">
                {/* Media Preview (Smaller in list view) */}
                {(item.image || item.video) && (
                  <div className="w-full md:w-48 h-32 bg-slate-950 flex-shrink-0">
                    {item.image ? (
                      <img 
                        src={`${backendURL}${item.image}`} 
                        className="w-full h-full object-cover"
                        alt={item.title}
                      />
                    ) : (
                      <video 
                        src={`${backendURL}${item.video}`}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                  </div>
                )}
                
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
                          {item.category || "General"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </span>
                      </div>
                      <Link to={`/news/${item._id}`} className="group/title">
                        <h3 className="text-lg font-bold text-white mb-2 group-hover/title:text-blue-400 transition-colors line-clamp-1">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                        {item.content}
                      </p>
                    </div>

                    <div className="flex gap-2">
                       <button
                        onClick={() => setActiveComments(activeComments === item._id ? null : item._id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
                        title="View comments"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => navigate(`/edit/${item._id}`)}
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                        title="Edit article"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Delete article"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {activeComments === item._id && (
                <div className="px-6 pb-6 border-t border-slate-800/50 bg-slate-900/50">
                   <Comments newsId={item._id} />
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
          <svg className="w-12 h-12 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-xl text-slate-400">No articles yet</h3>
          <p className="text-slate-500 mt-2 mb-6">Start publishing to see your articles here.</p>
          <button
            onClick={() => navigate("/admin")}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
          >
            Publish Your First Article
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;
