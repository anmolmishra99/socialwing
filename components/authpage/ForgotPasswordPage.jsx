/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import Image from "next/image";
// import logo from "@/assets/circle.svg";
import { CgGoogle } from "react-icons/cg";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/app/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
// import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import { useUserStore } from "@/store/userStore";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const uiuid = uuidv4();
  const {
    user,
    googleSignIn,
    logOut,
    // signInwithEmailAndPassword,
    error,
    // loading,
  } = UserAuth();

  const setUser = useUserStore((store) => store.setUser);
  const c_user = useUserStore((store) => store.user);

  const router = useRouter();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (email.length === 0) {
      toast.error("Please enter your email address.");
      return;
    }
    setisLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent!");
    } catch (error) {
      console.error("Error sending password reset email:", error);
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setisLoading(false);
    }
  };

  return (
    <section className='bg-white '>
      <div className='grid lg:h-screen lg:grid-cols-2'>
        <div className='flex items-center justify-center px-4 py-6 lg:py-0 sm:px-0'>
          <form
            className='w-full max-w-md pt-12 px-8 space-y-4 md:space-y-6 xl:max-w-xl'
            action='#'
          >
            <h1 className='text-3xl font-bold text-gray-900 '>
              Forgot Password!
            </h1>

            <div>
              <label
                htmlFor='email'
                className='block mb-2 text-sm font-medium text-gray-900 '
              >
                Email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 '
                placeholder='Enter your email'
                required=''
              />
            </div>

            {isLoading ? (
              <div className='flex w-full h-[40px] rounded-lg items-center pb-2 justify-center bg-primary'>
                <div>
                  <PropagateLoader className='flex' color='#ffffff' size={10} />
                </div>
              </div>
            ) : (
              <button
                type='submit'
                onClick={handleForgotPassword}
                className='w-full text-white bg-primary hover:bg-info focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center '
              >
                Forget Email
              </button>
            )}
          </form>
        </div>

        {/* Left Section */}
        <div className='flex text-white justify-center items-center py-6 px-4 bg-gradient-to-r from-primary to-[#1fcfee] lg:py-0 sm:px-0'>
          <div className='max-w-md xl:max-w-xl'>
            <a
              href='#'
              className='flex space-x-2 items-center mb-4 text-2xl font-semibold '
            >
              <Image src={logo} className='h-8 w-8' alt='' />
              <div>Testimonify</div>
            </a>
            <h1 className='mb-4 text-3xl font-extrabold tracking-tight leading-none  xl:text-5xl'>
              Get Your Account Back
            </h1>
            <p className='mb-4 font-light text-primary-200 lg:mb-8'>
              Enter your email and click forget password.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
