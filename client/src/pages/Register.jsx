import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, BrainCircuit, Sparkles, CheckCircle2 } from "lucide-react";
import API from "../utils/api";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

function Register({ onAuth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e?.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Account created successfully!");
      onAuth(res.data.token);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await API.post("/api/auth/google", {
        credential: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Account created!");
      onAuth(res.data.token);
      navigate("/");
    } catch (err) {
      toast.error("Google login failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-zinc-950 font-sans">
      {/* Left side: Premium Branding Info */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-900 border-r border-border-subtle relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute -top-40 -left-45 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="rounded-xl bg-primary/10 border border-primary/20 p-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">InterviewAI</span>
        </div>

        {/* Content */}
        <div className="my-auto space-y-8 max-w-lg z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold text-primary">
              <Sparkles size={12} />
              <span>Elevate Your Preparation</span>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white">
              Create your account and start practicing.
            </h1>
            <p className="text-zinc-400 text-base leading-relaxed">
              Design mock sessions for Frontend, Backend, Machine Learning, or input any custom job role. Get real-time AI scoring instantly.
            </p>
          </div>

          <div className="space-y-4 border-t border-border-subtle pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold text-zinc-200">Customized difficulty levels</p>
                <p className="text-xs text-zinc-500">Pick Easy, Medium, or Hard to simulate real pressure.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-primary mt-1 shrink-0" size={18} />
              <div>
                <p className="text-sm font-semibold text-zinc-200">PDF Report Generation</p>
                <p className="text-xs text-zinc-500">Download formatted PDF certificates detailing questions, responses, and ratings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-zinc-600 z-10">
          Powered by Groq AI. Crafted for placement preparation.
        </p>
      </div>

      {/* Right side: Register Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <span className="text-base font-bold text-white">InterviewAI</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-white">Get Started</h2>
            <p className="text-sm text-zinc-400">
              Create your account to unlock technical mock sessions
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-900/30 text-red-400 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <Input
                  className="pl-11"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <Input
                  className="pl-11"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-zinc-500" />
                <Input
                  className="pl-11 pr-11"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300 transition duration-150"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              className="w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </Button>
          </form>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-border-subtle" />
            <span className="flex-shrink mx-4 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Or continue with
            </span>
            <div className="flex-grow border-t border-border-subtle" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Google login failed")}
            />
          </div>

          <p className="text-center text-sm text-zinc-500 pt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-primary hover:text-primary-hover underline underline-offset-4 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
