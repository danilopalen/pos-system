"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { app } from "./firebase";
import { getAuth } from "firebase/auth";
const auth = getAuth(app);
import { useAuthState } from "react-firebase-hooks/auth";

export default function Home() {
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    router.push(user?.uid ? "/pos" : "/login");
  }, [loading, router, user]);
  return null;
}
