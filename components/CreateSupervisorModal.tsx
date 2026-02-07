"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPerson } from "../redux/slices/peopleSlice";

interface CreateSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSupervisorModal({
  isOpen,
  onClose,
}: CreateSupervisorModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  if (!isOpen) return null;

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await dispatch(
      createPerson({
        first_name: firstName,
        last_name: lastName,
        bio,
        photo_url: photoUrl || undefined,
        type: "supervisor",
      })
    );

    setFirstName("");
    setLastName("");
    setBio("");
    setPhotoUrl("");
    setImgError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md animate-fadeIn my-12">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Add Supervisor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {photoUrl && !imgError ? (
            <img
              src={photoUrl}
              onError={() => setImgError(true)}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--color-base)] text-white flex items-center justify-center text-xl sm:text-2xl font-bold">
              {initials}
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none text-sm"
          />

          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={photoUrl}
            onChange={(e) => {
              setPhotoUrl(e.target.value);
              setImgError(false);
            }}
            className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none text-sm"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none resize-none h-20 text-sm"
          />

          <button
            type="submit"
            className="w-full bg-[var(--color-accent)] text-white p-2 rounded-lg hover:bg-[var(--color-base)] transition font-medium text-sm"
          >
            Add Supervisor
          </button>

        </form>
      </div>
    </div>
  );
}
