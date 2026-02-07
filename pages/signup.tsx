"use client";

import { JSX, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createUser } from "../redux/slices/authSlice";
import { Mail, User, Lock, Key } from "lucide-react";
import Loader from "../components/Loader";

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    role: "admin" as "admin" | "super_admin",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        createUser({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          username: form.username,
          role: form.role,
          password: form.password,
        })
      ).unwrap();

      setSuccess("User created successfully!");
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        role: "admin",
        password: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  const iconMap: Record<string, JSX.Element> = {
    first_name: <User className="w-5 h-5 text-gray-400 flex-shrink-0" />,
    last_name: <User className="w-5 h-5 text-gray-400 flex-shrink-0" />,
    email: <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />,
    username: <User className="w-5 h-5 text-gray-400 flex-shrink-0" />,
    password: <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />,
    confirmPassword: <Key className="w-5 h-5 text-gray-400 flex-shrink-0" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-[var(--color-light)]">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 animate-fadeIn">
        <h1 className="text-3xl font-extrabold text-[var(--color-base)] mb-4 text-center">
          Register New Admin
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Fill in the details to create a new admin account
        </p>

        {/* Error / Success */}
        {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-3 text-center">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "First Name", name: "first_name", type: "text" },
            { label: "Last Name", name: "last_name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Username", name: "username", type: "text" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
          ].map((field) => (
            <div key={field.name} className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[var(--color-base)] transition-all">
              {iconMap[field.name]}
              <input
                type={field.type}
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required={field.type !== "text" || field.name !== "username"}
                placeholder={field.label}
                className="bg-transparent w-full text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
          ))}

          {/* Role */}
          <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 focus-within:ring-2 focus-within:ring-[var(--color-base)] transition-all">
            <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="bg-transparent w-full text-gray-700 focus:outline-none"
            >
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-lg bg-[var(--color-accent)] hover:bg-[var(--color-secondary)] text-white font-medium transition-all duration-300 disabled:opacity-50"
          >
            {loading ? <Loader /> : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}
