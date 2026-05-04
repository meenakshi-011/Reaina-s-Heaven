import { useState, useEffect } from "react";
import { signupUser } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Structured Premium Signup Page
 * Design: Centered multi-pane card matching the Login page
 * Aesthetic: Warm, floral, inviting
 */
function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await signupUser(form);
      if (data.user) {
        navigate("/login", { state: { message: "Successfully signed up! Please log in." } });
      } else {
        toast.error(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const signupImage = "https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1987&auto=format&fit=crop";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8f5f2] p-4 sm:p-6 lg:p-12 font-sans selection:bg-[#a67c52]/30">
      {/* ── BACKGROUND DECORATION ─────────────────────── */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-40">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-[#c8a97e]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-green-900/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      {/* ── MAIN SIGNUP CARD ───────────────────────────── */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] overflow-hidden border border-white">
        
        {/* ── LEFT PANE: VISUAL & QUOTE ───────────────── */}
        <div className="hidden lg:flex lg:w-[55%] relative min-h-[700px] overflow-hidden group">
          <img 
            src={signupImage} 
            alt="Floral Aesthetic" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[20000ms] ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#1a241a]/90 via-[#2d3a2d]/40 to-transparent" />
          
          <div className="absolute top-10 left-10 flex items-center gap-3">
             <div className="w-10 h-[1px] bg-white/40" />
             <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/60">Join The Haven</span>
          </div>

          <div className="relative z-10 p-16 mt-auto">
            <div className="w-16 h-1.5 bg-[#c8a97e] mb-8 rounded-full" />
            <h2 className="text-5xl font-serif leading-[1.2] mb-10 text-white">
              "Every flower is a soul <br />
              <span className="italic text-[#c8a97e]">blossoming in nature</span>, and every <br />
              home needs its sanctuary."
            </h2>
            
            <p className="text-white/70 text-lg font-light tracking-wide max-w-md">
              Start your journey today and become part of our growing community of book lovers and artisans.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANE: SIGNUP FORM ──────────────────── */}
        <div className="w-full lg:w-[45%] p-8 sm:p-12 xl:p-20 flex flex-col">
          <Link to="/" className="inline-flex lg:hidden items-center gap-2 mb-12">
            <span className="text-3xl">🌸</span>
            <span className="text-2xl font-serif text-[#2d3a2d] font-bold">Reaina's Haven</span>
          </Link>

          <div className="mb-8 lg:mt-2">
            <h1 className="text-4xl font-serif text-[#2d3a2d] mb-3">Create Account</h1>
            <div className="flex items-center gap-3">
               <div className="h-[2px] w-8 bg-[#c8a97e]" />
               <p className="text-[#8c8c73] font-medium tracking-wide italic">
                 Join our sanctuary today
               </p>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-5 flex-1">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-[10px] uppercase font-black tracking-widest text-[#8c8c73] ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#a67c52] transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  className="block w-full pl-12 pr-5 py-4 bg-[#fdfbf9] border border-[#e0d8ce] rounded-2xl text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#a67c52]/5 focus:border-[#a67c52] transition-all duration-300"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>

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
                  className="block w-full pl-12 pr-5 py-4 bg-[#fdfbf9] border border-[#e0d8ce] rounded-2xl text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#a67c52]/5 focus:border-[#a67c52] transition-all duration-300"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-[10px] uppercase font-black tracking-widest text-[#8c8c73] ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#a67c52] transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-[#fdfbf9] border border-[#e0d8ce] rounded-2xl text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-[#a67c52]/5 focus:border-[#a67c52] transition-all duration-300"
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

            {/* Terms */}
            <div className="flex items-start gap-3 px-1 pt-2">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 accent-[#a67c52] rounded border-[#e0d8ce]" />
              <label htmlFor="terms" className="text-xs text-gray-500 leading-relaxed">
                I agree to the <button type="button" className="text-[#a67c52] font-bold hover:underline">Terms of Service</button> and <button type="button" className="text-[#a67c52] font-bold hover:underline">Privacy Policy</button>.
              </label>
            </div>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#a67c52] hover:bg-[#2d3a2d] text-white py-4 rounded-2xl font-bold text-lg transition-all duration-500 shadow-xl shadow-[#a67c52]/20 hover:shadow-[#2d3a2d]/30 flex items-center justify-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Create Your Account</span>
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 font-medium text-sm">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-[#a67c52] font-black hover:text-[#2d3a2d] transition-all underline underline-offset-4 decoration-[#c8a97e]/40"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

