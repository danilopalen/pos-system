"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebase";

export default function Login() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) return;
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, credentials.username, credentials.password)
      .then((userCredential) => {
        console.log("🚀 ~ .then ~ userCredential:", userCredential);
        // Signed in
        localStorage.setItem(
          "user",
          JSON.stringify({ uid: userCredential.user.uid })
        );
        router.push("/pos");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleLogin}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-purple-100"
        >
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            POS Login
          </h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              onChange={(e) =>
                setCredentials({ ...credentials, username: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-purple-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              onChange={(e) =>
                setCredentials({ ...credentials, password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
