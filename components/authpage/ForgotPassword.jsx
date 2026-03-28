"use client";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
// import logo from "@/assets/circle.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import LoginPage from "@/components/authpage/LoginPage";
import { UserAuth } from "@/app/context/AuthContext";
import ForgotPasswordPage from "./ForgotPasswordPage";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserAuth();
  const route = useRouter();

  useEffect(() => {
    // Log user immediately if available
    if (user) {
      // console.log("User:", user.uid);
      route.push("/dashboard");
      setIsLoading(false);
      return; // Exit effect if user is found
    }

    // Set timeout to check user after 5 seconds
    const checkUser = setTimeout(() => {
      if (user) {
        // console.log("User:", user.uid);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        // console.log("No User");
      }
    }, 5000); // 5-second delay

    return () => clearTimeout(checkUser); // Cleanup timeout if the component unmounts or user changes
  }, [user, route]);

  return (
    <div>
      {isLoading ? (
        <div className='flex flex-col w-full h-screen items-center justify-center'>
          <div className='flex space-x-2 items-center mb-4 text-2xl font-semibold text-black'>
            <Image src={logo} className='h-16 w-16' alt='' />
            {/* <div>FeedBack Wala</div> */}
          </div>
          <div className=''>
            <BarLoader className='flex' color='#007bff' width={100} />
          </div>
        </div>
      ) : (
        <ForgotPasswordPage />
      )}
    </div>
  );
};

export default ForgotPassword;
