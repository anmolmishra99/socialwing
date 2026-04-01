"use client";
import { createContext, useContext, useEffect, useState } from "react";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";
import { createUserDocument } from "@/lib/firestore/users";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState('marathi');

 const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    // Create/update user doc in Firestore
    if (result.user) {
      await createUserDocument(result.user);
    }
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};


  const createAccountWithemailandpass = async (email, pass) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      // Create user doc in Firestore on signup
      if (result.user) {
        await createUserDocument(result.user);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const signInwithEmailAndPassword = async (email, password) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Update last login in Firestore
      if (result.user) {
        await createUserDocument(result.user);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser({
          ...currentUser,
          language: language
        });
        // Ensure user document exists in Firestore on every auth state restoration
        try {
          await createUserDocument(currentUser);
        } catch (err) {
          console.error("Failed to sync user document:", err);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [language]);


  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        language,
        googleSignIn,
        logOut,
        createAccountWithemailandpass,
        signInwithEmailAndPassword,
        switchLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
