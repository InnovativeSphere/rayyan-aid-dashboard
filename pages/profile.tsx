"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";
import EditProfileModal from "../components/EditProfileModal";
import { Mail, User, Tag, Calendar, CheckCircle, XCircle } from "lucide-react";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const [editOpen, setEditOpen] = useState(false);

  if (!user) return <p className="p-8 text-gray-500">Not logged in</p>;

  return (
    <div className="min-h-screen flex items-center justify-center py-10 bg-[var(--color-light)]">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 animate-fadeIn transition-all hover:shadow-2xl">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-[var(--color-base)] truncate">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-gray-500 truncate">@{user.username || "no-username"}</p>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg shadow hover:bg-[var(--color-secondary)] transition-all duration-300 font-medium"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="truncate">
              <p className="text-gray-400">Email</p>
              <p className="text-gray-700 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tag className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="truncate">
              <p className="text-gray-400">Role</p>
              <p className="capitalize text-gray-700 truncate">{user.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.is_active ? (
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <div className="truncate">
              <p className="text-gray-400">Status</p>
              <p className={`${user.is_active ? "text-green-600" : "text-red-600"} font-semibold`}>
                {user.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
            <div className="truncate">
              <p className="text-gray-400">Member Since</p>
              <p className="text-gray-700">
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}
              </p>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <button
          onClick={() => dispatch(logoutUser())}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:underline transition-all duration-300 font-medium"
        >
          <XCircle className="w-4 h-4" />
          Log Out
        </button>
      </div>

      <EditProfileModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
      />
    </div>
  );
}
