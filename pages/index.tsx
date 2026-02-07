"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { loginUser } from "@/redux/slices/authSlice";
import {
  selectAuthLoading,
  selectAuthError,
  selectAuthToken,
} from "@/redux/slices/authSlice";

import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const token = useAppSelector(selectAuthToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token) router.push("/dashboard");
  }, [token, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-[var(--color-accent)]/20 blur-[120px] rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-[var(--color-base)]/20 blur-[120px] rounded-full bottom-0 right-0" />

      {/* Card */}
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-10 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white tracking-wide drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]">
            Admin Login
          </h1>
          <p className="text-gray-300 text-sm mt-2">
            Sign in to access dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 animate-fadeIn">
          {/* Email */}
          <div className="flex items-center bg-black/40 rounded-lg border border-white/20 px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-[var(--color-accent)] transition-all">
            <Mail className="w-5 h-5 text-gray-300 flex-shrink-0" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="bg-transparent w-full text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="flex items-center bg-black/40 rounded-lg border border-white/20 px-4 py-3 gap-3 focus-within:ring-2 focus-within:ring-[var(--color-accent)] transition-all">
            <Lock className="w-5 h-5 text-gray-300 flex-shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="bg-transparent w-full text-white placeholder-gray-400 focus:outline-none"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-accent-dark)] text-white font-medium transition-all duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              "Signing in..."
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
