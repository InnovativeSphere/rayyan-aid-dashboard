"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateUser, User } from "../redux/slices/authSlice";
import { X, User as UserIcon, Mail, Key } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function EditProfileModal({ isOpen, onClose, user }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username || "",
        email: user.email,
        password: "",
      });
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    await dispatch(
      updateUser({
        id: user.id,
        updates: {
          first_name: form.first_name,
          last_name: form.last_name,
          username: form.username || undefined,
          email: form.email,
          ...(form.password && { password: form.password }),
        },
      }),
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xs sm:max-w-sm md:max-w-md p-5 rounded-xl shadow-xl flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 border rounded-lg p-2">
            <UserIcon size={16} className="text-gray-400" />
            <input
              placeholder="First Name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              className="flex-1 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2">
            <UserIcon size={16} className="text-gray-400" />
            <input
              placeholder="Last Name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              className="flex-1 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2">
            <UserIcon size={16} className="text-gray-400" />
            <input
              placeholder="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="flex-1 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2">
            <Mail size={16} className="text-gray-400" />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="flex-1 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex items-center gap-2 border rounded-lg p-2">
            <Key size={16} className="text-gray-400" />
            <input
              type="password"
              placeholder="New Password (optional)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="flex-1 outline-none text-sm sm:text-base"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[var(--color-accent)] text-white p-2 sm:p-3 rounded-lg mt-4 hover:bg-[var(--color-base)] transition font-medium text-sm sm:text-base"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
