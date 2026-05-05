import { useState, useEffect } from "react";
import { loginUser } from "../services/api";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Structured Premium Login Page
 * Design: Centered multi-pane card with balanced proportions
 * Aesthetic: Warm, cozy, nature-inspired (Books & Cafe)
 */
function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate(redirect);
    }
  }, [navigate, redirect]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(form);
      if (data.token) {
        localStorage.setItem("token", data.token);
        toast.success("Welcome back to Reaina's Haven! ✨", {
          style: {
            background: '#f8f5f2',
            color: '#2d3a2d',
            border: '1px solid #c8a97e',
          },
          iconTheme: {
            primary: '#a67c52',
            secondary: '#f8f5f2',
          },
        });
        navigate(redirect);
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loginImage = "https://images.unsplash.com/photo-1608973917346-25d71e647852?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  return (
    <div className="min-h-100vh w-full flex items-center justify-center bg-[#f8f5f2] p-4 sm:p-6 lg:p-12 font-sans selection:bg-[#a67c52]/30">
      {/* ── BACKGROUND DECORATION ─────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#c8a97e]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-green-900/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* ── MAIN LOGIN CARD ───────────────────────────── */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-white">
        
        {/* ── LEFT PANE: VISUAL & QUOTE ───────────────── */}
        <div className="hidden lg:flex lg:w-[55%] relative min-h-[700px] overflow-hidden group">
          <img 
            src={loginImage} 
            alt="Cozy Library" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20000ms] ease-out group-hover:scale-110"
          />
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1a241a]/90 via-[#2d3a2d]/40 to-transparent" />
          
          {/* Brand Tag */}
          <div className="absolute top-10 left-10 flex items-center gap-3">
             <div className="w-10 h-[1px] bg-white/40" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60">Reaina's Haven</span>
          </div>

          <div className="relative z-10 p-16 mt-auto">
            <div className="w-16 h-1.5 bg-[#c8a97e] mb-8 rounded-full" />
            <h2 className="text-5xl font-serif leading-[1.2] mb-10 text-white">
              "Where every turned page <br />
              <span className="italic text-[#c8a97e]">finds its peace</span>, and every <br />
              brewed cup holds a story."
            </h2>
            
            <div className="flex items-center gap-4 group/founder transition-transform duration-500 hover:translate-x-2">
               <div className="w-14 h-14 rounded-full border-2 border-[#c8a97e]/30 p-1 overflow-hidden transition-all duration-500 group-hover/founder:border-[#c8a97e]">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop" 
                    alt="Reaina" 
                    className="w-full h-full object-cover rounded-full"
                  />
               </div>
               <div>
                  <p className="text-white text-xl font-serif italic tracking-wide">— Reaina</p>
                  <p className="text-[#c8a97e] text-[10px] uppercase tracking-[0.2em] font-black mt-1">Founder, Reaina's Haven</p>
               </div>
            </div>
          </div>
          
          {/* Particle Texture */}
          <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-screen bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>

        {/* ── RIGHT PANE: LOGIN FORM ──────────────────── */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:p-20 flex flex-col">
          {/* Logo (Visible on mobile/tablet) */}
          <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-12">
            <span className="text-3xl">🌿</span>
            <span className="text-2xl font-serif text-[#2d3a2d] font-bold">Reaina's Haven</span>
          </Link>

          <div className="mb-10 lg:mt-6">
            <h1 className="text-4xl font-serif text-[#2d3a2d] mb-4">Welcome Back</h1>
            <div className="flex items-center gap-3">
               <div className="h-[2px] w-8 bg-[#c8a97e]" />
               <p className="text-[#8c8c73] font-medium tracking-wide italic">
                 Continue your sanctuary journey
               </p>
            </div>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-[#f8f5f2] border border-[#c8a97e] text-[#2d3a2d] rounded-2xl flex items-center gap-3 shadow-sm">
              <span className="text-xl">🌸</span>
              <p className="font-medium text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6 flex-1">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] uppercase font-black tracking-widest text-[#8c8c73] ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#a67c52] transition-colors">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-5 py-4.5 bg-[#fdfbf9] border border-[#e0d8ce] rounded-2xl text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#a67c52]/5 focus:border-[#a67c52] transition-all duration-300"
                  placeholder="e.g. raven@haven.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-[#8c8c73]">
                  Password
                </label>
                <button type="button" className="text-[10px] font-bold text-[#a67c52] hover:text-[#2d3a2d] uppercase tracking-widest transition-colors">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#a67c52] transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-4.5 bg-[#fdfbf9] border border-[#e0d8ce] rounded-2xl text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#a67c52]/5 focus:border-[#a67c52] transition-all duration-300"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-[#a67c52] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-3 px-1">
               <div className="relative flex items-center justify-center">
                  <input type="checkbox" id="remember" className="peer appearance-none w-5 h-5 border-2 border-[#e0d8ce] rounded-lg checked:bg-[#a67c52] checked:border-[#a67c52] transition-all cursor-pointer" />
                  <span className="absolute text-white scale-0 peer-checked:scale-100 transition-transform pointer-events-none">✓</span>
               </div>
               <label htmlFor="remember" className="text-sm text-gray-500 cursor-pointer font-medium select-none">Stay signed in</label>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2d3a2d] hover:bg-[#a67c52] text-white py-4.5 rounded-2xl font-bold text-lg transition-all duration-500 shadow-xl shadow-[#2d3a2d]/20 hover:shadow-[#a67c52]/30 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Enter Your Haven</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <p className="text-gray-500 font-medium text-sm">
              New to our story?{" "}
              <Link
                to="/signup"
                className="text-[#a67c52] font-black hover:text-[#2d3a2d] transition-all underline underline-offset-4 decoration-[#c8a97e]/40"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


