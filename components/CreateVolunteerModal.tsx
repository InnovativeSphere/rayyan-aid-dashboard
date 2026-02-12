"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPerson } from "../redux/slices/peopleSlice";
import { uploadImage } from "@/pages/lib/api";
import { Upload, X } from "lucide-react";
import Loader from "./Loader";

interface CreateVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateVolunteerModal({ isOpen, onClose }: CreateVolunteerModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "V";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImgError(false);
      setPhotoUrl(""); // clear URL if file selected
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoUrl = photoUrl;

      if (file) {
        const res = await uploadImage(file, "avatar");
        finalPhotoUrl = res.url;
      }

      await dispatch(
        createPerson({
          first_name: firstName,
          last_name: lastName,
          bio,
          photo_url: finalPhotoUrl || undefined,
          type: "volunteer",
        })
      );

      setFirstName("");
      setLastName("");
      setBio("");
      setPhotoUrl("");
      setFile(null);
      setImgError(false);
      onClose();
    } catch (err) {
      console.error("Volunteer creation failed:", err);
      setImgError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 animate-fadeIn flex flex-col items-center">

        {/* Header */}
        <div className="w-full flex justify-between items-center mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Add Volunteer
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-3">
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">

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

          {/* Photo URL and Upload */}
          <div className="w-full flex flex-col gap-1">
            <input
              type="text"
              placeholder="Photo URL (optional)"
              value={photoUrl}
              onChange={(e) => {
                setPhotoUrl(e.target.value);
                setFile(null);
                setImgError(false);
              }}
              className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none text-sm"
            />

            <label className="flex items-center justify-center gap-2 border border-dashed rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition">
              <Upload size={16} />
              <span className="text-sm">Upload Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {file && loading && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Loader  /> Uploading...
              </p>
            )}
          </div>

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none resize-none h-16 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[var(--color-accent)] text-white p-2 rounded-lg hover:bg-[var(--color-base)] transition font-medium text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? "Uploading..." : "Add Volunteer"}
          </button>
        </form>
      </div>
    </div>
  );
}
