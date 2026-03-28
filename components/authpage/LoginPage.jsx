"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/userStore";
import {
  Landmark,
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  ShieldAlert,
  Fingerprint,
} from "lucide-react";
import { PropagateLoader } from "react-spinners"; // Assuming this is installed, otherwise use CSS loader

const LoadingSpinner = ({ color = "#fff" }) => (
  <PropagateLoader color={color} size={10} />
);

const LoginPage = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);

  const setUser = useUserStore((store) => store.setUser);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const login = useUserStore((store) => store.login);

  const clickButton = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      toast.error("Enter Your Email");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be of more than 6 characters");
      return;
    }
    try {
      setisLoading(true);

      // Mock Email Sign In
      setTimeout(() => {
        const role = email.includes("officer") ? "officer" : "admin";
        login(email, role);
        toast.success("Welcome Back, Redirecting to dashboard");
        router.replace("/dashboard");
        setisLoading(false);
      }, 1000);
    } catch (error) {
      setisLoading(false);
      console.error(error);
      toast.error("Invalid credentials.");
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans selection:bg-orange-200">
      {/* LEFT SIDE - BRANDING */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        {/* Abstract Background Design */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-black opacity-90"></div>
          {/* Geometric Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent [background-size:40px_40px]"></div>
          <svg
            className="absolute w-full h-full opacity-10 text-slate-500"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M0 100 Q 50 50 100 100"
              stroke="currentColor"
              fill="none"
            />
            <path d="M0 0 Q 50 50 100 0" stroke="currentColor" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-lg text-white">
          <div className="mb-8 inline-block p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
            <Landmark className="w-12 h-12 text-orange-400" />
          </div>

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            EDAMS :
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
              Election Duty Appointment Management System
            </span>
          </h1>

          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            This system allows authorized election officers to manage
            appointment orders, randomize staff, and generate compliance reports
            efficiently.
          </p>

          <div className="flex gap-4 text-sm text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Restricted Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              <span>Logged & Audited</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 lg:p-12 shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-700">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
            <p className="text-slate-500 mt-2 text-sm">
              Please sign in to your dashboard
            </p>
          </div>

          <form onSubmit={clickButton} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                placeholder="officer@election.gov.in"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                href="#"
                onClick={() => toast("Contact your System Administrator.")}
                className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transform active:scale-[0.98] transition-all duration-200 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm">Authenticating...</span>
                  <LoadingSpinner color="#ffffff" />
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link
                href="/create-account"
                className="text-orange-600 font-semibold hover:text-orange-700"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
            <div className="bg-blue-100 p-1.5 rounded-full flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-blue-700" />
            </div>
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Note:</strong> Unauthorized access to this government
              system is a punishable offense under the IT Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
