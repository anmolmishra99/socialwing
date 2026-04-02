"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserAuth } from "@/app/context/AuthContext";
import { useAccountsStore } from "@/store/accountsStore";
import Dashboard from "@/components/dashboard/dashboard";
import LoadingScreen from "@/components/dashboard/Shared/LoadingScreen";
import toast from "react-hot-toast";

function DashboardContent() {
  const { user } = UserAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const oauthHandled = useRef(false);
  const { addAccount, fetchAccounts } = useAccountsStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isClient && user === null) {
      router.push("/login");
    }
  }, [user, router, isClient]);


  // Handle OAuth callback data from URL query params
  useEffect(() => {
    if (!user?.uid || oauthHandled.current) return;

    const oauthSuccess = searchParams.get("oauth_success");
    const accountDataEncoded = searchParams.get("account_data");
    const oauthError = searchParams.get("oauth_error");
    const platform = searchParams.get("platform");

    if (oauthError) {
      oauthHandled.current = true;
      toast.error(
        `Failed to connect ${platform || "account"}: ${oauthError}`
      );
      // Clean up URL
      router.replace("/dashboard", { scroll: false });
      return;
    }

    if (oauthSuccess === "true" && accountDataEncoded) {
      oauthHandled.current = true;
      try {
        // Convert base64url to standard base64
        let base64 = accountDataEncoded.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) {
          base64 += "=";
        }
        // Decode base64 to utf-8 using native atob & decodeURIComponent
        const jsonString = decodeURIComponent(escape(atob(base64)));
        const accountData = JSON.parse(jsonString);

        // Save to Firestore via the Zustand store
        addAccount(user.uid, accountData)
          .then(() => {
            toast.success(
              `Connected ${accountData.platform} (${accountData.handle})`
            );
          })
          .catch((err) => {
            console.error("Failed to save account:", err);
            toast.error("Connected but failed to save. Please try again.");
          });
      } catch (err) {
        console.error("Failed to parse OAuth data:", err);
        toast.error("Something went wrong processing the account data.");
      }

      // Clean up URL
      router.replace("/dashboard", { scroll: false });
    }
  }, [user?.uid, searchParams, addAccount, router]);

  // Show loading screen while auth state resolves
  if (!isClient || user === undefined) {
    return <LoadingScreen />;
  }

  // Handle case where user is null but we are still transitioning routes
  if (user === null) {
    return <LoadingScreen />;
  }

  return <Dashboard />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <DashboardContent />
    </Suspense>
  );
}
