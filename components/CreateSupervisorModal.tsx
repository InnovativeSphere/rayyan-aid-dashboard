"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPerson } from "../redux/slices/peopleSlice";
import { uploadImage } from "../pages/lib/api";
import { Upload, X } from "lucide-react";
import Loader from "./Loader";

interface CreateSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSupervisorModal({ isOpen, onClose }: CreateSupervisorModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleFileUpload = async (file?: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const res = await uploadImage(file, "avatar");
      setPhotoUrl(res.url);
      setImgError(false);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      await dispatch(createPerson({
        first_name: firstName,
        last_name: lastName,
        bio,
        photo_url: photoUrl || undefined,
        type: "supervisor",
      }));

      setFirstName("");
      setLastName("");
      setBio("");
      setPhotoUrl("");
      setFile(null);
      setImgError(false);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md p-5 animate-fadeIn flex flex-col items-center">

        {/* Header */}
        <div className="w-full flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">Add Supervisor</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Avatar + Upload Row */}
        <div className="flex items-center w-full gap-3 mb-3">
          <div className="flex-shrink-0">
            {photoUrl && !imgError ? (
              <img
                src={photoUrl}
                onError={() => setImgError(true)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--color-base)] text-white flex items-center justify-center text-lg sm:text-xl font-bold">
                {initials}
              </div>
            )}
          </div>

          <label className="flex-1 flex items-center justify-center gap-2 border border-dashed rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition">
            {uploading ? <Loader  /> : <Upload size={16} />}
            <span className="text-sm">{uploading ? "Uploading..." : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(e) => handleFileUpload(e.target.files?.[0])}
              className="hidden"
            />
          </label>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border p-2 sm:p-3 rounded-lg focus:border-[var(--color-base)] outline-none text-sm sm:text-base"
          />

          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border p-2 sm:p-3 rounded-lg focus:border-[var(--color-base)] outline-none text-sm sm:text-base"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded-lg focus:border-[var(--color-base)] outline-none resize-none h-16 sm:h-20 text-sm sm:text-base"
          />

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-[var(--color-accent)] text-white p-2 sm:p-3 rounded-lg hover:bg-[var(--color-base)] transition font-medium text-sm sm:text-base disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Add Supervisor"}
          </button>
        </form>
      </div>
    </div>
  );
}
