"use client";
import { UserAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { BarLoader } from "react-spinners";
// import logo from "@/assets/circle.svg";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CreateAccountPage from "@/components/authpage/CreateAccountPage";
// import Loadingpage from "../shared/Loadingpage";
import AuthShimmer from "./AuthShimmer";

export const metadata = {
  title: "Create Account",
};

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserAuth();
  const route = useRouter();

  // useEffect(() => {
  //   const checkUser = setTimeout(() => {
  //     if (user) {
  //       // console.log("User:", user.uid);
  //       route.push("/dashboard");
  //       setIsLoading(false);
  //     } else {
  //       setIsLoading(false);

  //       // console.log("No User");
  //     }
  //   }, 5000); // Adjust the delay as needed

  //   return () => clearTimeout(checkUser); // Cleanup timeout if the component unmounts
  // }, [user, route]);

  useEffect(() => {
    // Log user immediately if available
    if (user) {
      // console.log("User:", user.uid);
      route.push("/");
      setIsLoading(false);
      return; // Exit effect if user is found
    }

    // Set timeout to check user after 5 seconds
    const checkUser = setTimeout(() => {
      if (user) {
        // console.log("User:", user.uid);
        setIsLoading(false);
        route.push("/");
      } else {
        setIsLoading(false);
        // console.log("No User");
      }
    }, 5000); // 5-second delay

    return () => clearTimeout(checkUser); // Cleanup timeout if the component unmounts or user changes
  }, [user, route]);

  return <div>{isLoading ? <AuthShimmer /> : <CreateAccountPage />}</div>;
};

export default CreateAccount;
