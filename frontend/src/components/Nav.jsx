import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../service/api";

function Nav() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    API.get("/categories")
      .then(res => setCategories(res.data))
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md">
      <nav className="bg-slate-900/90 text-white p-4 shadow-lg flex flex-col md:flex-row justify-between items-center border-b border-white/5 gap-4">
        <Link to="/" className="text-2xl font-bold bg-linear-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent flex-shrink-0">
        Aapna Times News
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full max-w-md group">
          <input 
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-600 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </form>

        <div className="space-x-6 flex items-center flex-shrink-0">
          <Link to="/" className="hover:text-blue-400 transition-colors text-sm font-medium">Home</Link>
          {token ? (
            <>
              <Link to="/admin" className="hover:text-blue-400 transition-colors text-sm font-medium">Admin</Link>
              <Link to="/profile" className="hover:text-blue-400 transition-colors text-sm font-medium">Profile</Link>
              <button 
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 px-4 py-1.5 rounded-full transition-all text-red-400 text-sm font-medium shadow-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-4">
              <Link to="/signup" className="text-slate-400 hover:text-white transition-colors text-sm font-medium mt-1.5">Sign up</Link>
              <Link 
                to="/login" 
                className="bg-blue-600 hover:bg-blue-500 px-6 py-1.5 rounded-full transition-all text-sm font-medium shadow-md shadow-blue-500/20"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
      
      {/* Category Sub-nav */}
      <div className="bg-slate-900/80 border-b border-white/5 overflow-x-auto no-scrollbar">
        <div className="container mx-auto px-4 py-3 flex gap-8 whitespace-nowrap scroll-smooth">
          <button 
            onClick={() => navigate("/")}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-all cursor-pointer"
          >
            All News
          </button>
          {categories.map(cat => (
            <button
              key={cat._id}
              onClick={() => navigate(`/?category=${cat.name}`)}
              className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-400 transition-all cursor-pointer"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Nav;
