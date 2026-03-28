"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { useUserStore } from "@/store/userStore";
import { useUserRoleStore } from "@/store/userRoleStore";
import toast from "react-hot-toast";
import {
  UserPlus,
  ArrowLeft,
  Eye,
  EyeOff,
  Briefcase,
  Shield,
  UserCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { PropagateLoader } from "react-spinners"; // Ensure this matches typical imports or use fallback

const LoadingSpinner = ({ color = "#fff" }) => (
  <PropagateLoader color={color} size={10} />
);

const CreateAccountPage = ({ onBack }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [selectedRole, setSelectedRole] = useState("admin"); // Default to admin
  const router = useRouter();

  const setUser = useUserStore((store) => store.setUser);
  const setUserRole = useUserRoleStore((store) => store.setUserRole);

  const onButtonClick = async (e) => {
    e.preventDefault();
    if (!accepted) return toast.error("Please accept the terms and conditions");
    if (!name) return toast.error("Enter Your Name");
    if (!email) return toast.error("Enter Your Email");
    if (password.length < 6)
      return toast.error("Password must be of more than 6 characters");
    if (!selectedRole) return toast.error("Please select your role");
    try {
      setIsLoading(true);
      // Mock Account Creation
      setTimeout(() => {
        const formData = {
          uid: uuidv4(),
          name,
          email,
          profilepic: "",
          isBusiness: false,
          role: selectedRole,
          status: "active",
          hasAccess: true,
          medium: "email",
          timestamp: new Date(),
        };

        setIsLoading(false);
        toast.success("Welcome to EDAMS");
        setUser(formData);
        setUserRole(selectedRole);

        router.push("/dashboard");
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      toast.error("Error creating account");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-200 flex flex-col items-center justify-center p-4 py-12">
      {/* Header / Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-600 text-white shadow-lg shadow-orange-600/20 mb-4 transform rotate-3">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">
          Create Official Account
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Join the District Election Administration System
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Info */}
        <div className="hidden md:flex w-1/3 bg-slate-900 p-8 flex-col justify-between relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20"></div>

          <div className="relative z-10">
            <button
              onClick={() => router.push("/")}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </div>

          <div className="relative z-10 my-8">
            <h3 className="text-xl font-bold text-white mb-4">
              Why Create an Account?
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-white/10 p-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Access to centralized staff database.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-white/10 p-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Secure role-based permissions.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 bg-white/10 p-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Automated order generation & tracking.
                </p>
              </li>
            </ul>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-700/50">
            <p className="text-xs text-slate-500">
              &copy; 2025 EDAMS. <br /> All rights reserved.
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-2/3 p-8 lg:p-10">
          <form onSubmit={onButtonClick} className="space-y-6">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Select Privilege Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole("admin")}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedRole === "admin"
                      ? "border-orange-500 bg-orange-50 text-orange-900 ring-1 ring-orange-500"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      selectedRole === "admin"
                        ? "bg-orange-200 text-orange-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <UserCheck size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">Administrator</div>
                    <div className="text-[10px] opacity-70">
                      Full System Access
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRole("officer")}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    selectedRole === "officer"
                      ? "border-blue-500 bg-blue-50 text-blue-900 ring-1 ring-blue-500"
                      : "border-slate-200 hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      selectedRole === "officer"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Briefcase size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold">Election Officer</div>
                    <div className="text-[10px] opacity-70">
                      Department Access
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  placeholder="Ex. Rajesh Kumar"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
                  placeholder="name@department.gov.in"
                />
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Secure Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none pr-10"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <input
                id="terms"
                type="checkbox"
                checked={accepted}
                onChange={() => setAccepted(!accepted)}
                className="w-4 h-4 text-orange-600 border-slate-300 rounded focus:ring-orange-500"
              />
              <label
                htmlFor="terms"
                className="text-xs text-slate-600 select-none"
              >
                I confirm that the information provided is accurate and
                official.
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transform active:scale-[0.99] transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="text-sm">Creating Profile...</span>
                </>
              ) : (
                "Create Official Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have access?{" "}
              <Link
                href="/login"
                className="text-orange-600 font-bold hover:text-orange-700"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex items-center gap-2 text-slate-400 text-xs">
        <AlertCircle size={12} />
        <span>
          For official use only. Unauthorized registration is prohibited.
        </span>
      </div>
    </div>
  );
};

export default CreateAccountPage;
