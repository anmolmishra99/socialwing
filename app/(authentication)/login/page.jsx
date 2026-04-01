"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { user, googleSignIn } = UserAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await googleSignIn();
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "420px" }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              background: "#5945FE",
              color: "#ffffff",
              border: "2px solid #000",
              padding: "4px 10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "1.2rem",
              borderRadius: "4px",
              boxShadow: "2px 2px 0 #000"
            }}>
              d.
            </div>
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#000", letterSpacing: "-0.04em" }}>
              draft<em style={{ color: "#5945FE", fontStyle: "normal" }}>for</em>.me
            </span>
          </div>
        </Link>

        {/* Heading */}
        <h1 style={{
          fontWeight: 800, fontSize: "1.8rem", textAlign: "center",
          color: "#000", letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}>
          Welcome back
        </h1>
        <p style={{
          textAlign: "center", color: "#555", marginBottom: "32px", fontSize: "0.95rem"
        }}>
          Sign in to access your dashboard.
        </p>

        {/* Card */}
        <div style={{
          background: "#fff",
          border: "2px solid #000",
          boxShadow: "4px 4px 0 #000",
          borderRadius: "6px",
          padding: "40px",
        }}>
          
          {/* Google button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "14px 20px",
              background: "#5945FE",
              color: "#ffffff",
              border: "2px solid #000",
              borderRadius: "4px",
              boxShadow: "4px 4px 0 #000",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "1rem",
              letterSpacing: "0.01em",
              transition: "transform 0.1s, box-shadow 0.1s",
            }}
            onMouseEnter={e => {
              if(!loading) {
                e.currentTarget.style.transform = "translate(2px, 2px)";
                e.currentTarget.style.boxShadow = "2px 2px 0 #000";
              }
            }}
            onMouseLeave={e => {
              if(!loading) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "4px 4px 0 #000";
              }
            }}
          >
            {loading ? (
              <div style={{
                width: "20px", height: "20px", border: "2px solid #ffffff",
                borderTop: "2px solid transparent", borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
            ) : (
              <>
                <svg style={{ width: "20px", height: "20px", flexShrink: 0 }} viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#ffffff" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#ffffff" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#ffffff" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ffffff" />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Bottom note */}
          <p style={{ textAlign: "center", fontSize: "0.80rem", fontWeight: 500, color: "#666", marginTop: "24px" }}>
            By signing in you agree to our{" "}
            <a href="#" style={{ color: "#5945FE", textDecoration: "underline", fontWeight: 700 }}>Terms</a>.
          </p>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <Link href="/" style={{
            color: "#555", fontWeight: 600, fontSize: "0.9rem",
            textDecoration: "underline",
          }}>
            ← Back to home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
