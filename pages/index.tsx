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
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-5">
        {/* Brand Logo & Name */}
        <div className="text-center">
          <Image
            src="/Rayyan Aid Logo-03.jpg"
            alt="Rayyan Aid Logo"
            width={70}
            height={70}
            className="mx-auto mb-3"
          />
          <h1 className="text-2xl font-bold text-gray-900">Rayyan Aid</h1>
        </div>

        {/* Header */}
        <div className="text-center">
          <p className="text-gray-600 text-sm mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Mail className="w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email address"
              className="bg-transparent w-full text-gray-900 placeholder-gray-400 focus:outline-none ml-2"
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
            <Lock className="w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="bg-transparent w-full text-gray-900 placeholder-gray-400 focus:outline-none ml-2"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-200 disabled:opacity-50"
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

        {/* Footer */}
        <p className="text-gray-500 text-xs text-center mt-3">
          &copy; {new Date().getFullYear()} Rayyan Aid. All rights reserved.
        </p>
      </div>
    </div>
  );
}
