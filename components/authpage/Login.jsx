"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import LoginPage from "@/components/authpage/LoginPage";
import { UserAuth } from "@/app/context/AuthContext";
import AuthShimmer from "./AuthShimmer";
// import Loadingpage from "../shared/Loadingpage";

const Login = () => {
  // Add mounted state to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserAuth();
  const route = useRouter();

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user) {
      route.replace("/");
      setIsLoading(false);
      return;
    }

    const checkUser = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(checkUser);
  }, [user, route, mounted]);

  // Don't render anything until mounted
  if (!mounted) return null;

  return <div>{isLoading ? <AuthShimmer /> : <LoginPage />}</div>;
};

export default Login;
