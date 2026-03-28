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

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState('marathi');

 const googleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};


  const createAccountWithemailandpass = (email, pass) => {
    try {
      setLoading(true);
      createUserWithEmailAndPassword(auth, email, pass);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const signInwithEmailAndPassword = (email, password) => {
    try {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password);
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
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          ...currentUser,
          language: language
        });
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
