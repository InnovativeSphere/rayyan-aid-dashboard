"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updatePerson, deletePerson, Person } from "../redux/slices/peopleSlice";
import { uploadImage } from "@/pages/lib/api";
import { Upload, Trash2, X, Image } from "lucide-react";

interface EditVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  volunteer: Person | null;
}

export default function EditVolunteerModal({
  isOpen,
  onClose,
  volunteer,
}: EditVolunteerModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imgError, setImgError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (volunteer) {
      setFirstName(volunteer.first_name);
      setLastName(volunteer.last_name);
      setBio(volunteer.bio || "");
      setPhotoUrl(volunteer.photo_url || "");
      setImgError(false);
      setFile(null);
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "V";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setImgError(false);
      setPhotoUrl("");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalPhotoUrl = photoUrl;

      if (file) {
        const res = await uploadImage(file, "avatar");
        finalPhotoUrl = res.url;
      }

      await dispatch(
        updatePerson({
          id: volunteer.id,
          updates: {
            first_name: firstName,
            last_name: lastName,
            bio,
            photo_url: finalPhotoUrl || undefined,
          },
        })
      );

      onClose();
    } catch (err) {
      console.error("Volunteer update failed:", err);
      setImgError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this volunteer?")) {
      await dispatch(deletePerson(volunteer.id));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md p-4 sm:p-5 animate-fadeIn flex flex-col items-center">

        {/* Header */}
        <div className="w-full flex justify-between items-center mb-3">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Edit Volunteer
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
        <form onSubmit={handleUpdate} className="w-full flex flex-col gap-2">

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

            <label
              className={`flex items-center justify-center gap-2 border border-dashed rounded-lg p-2 cursor-pointer transition
                ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-50"}`}
            >
              <Upload size={16} />
              <span className="text-sm">
                {file ? file.name : "Upload Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
            </label>

            {file && loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <Image size={14} className="animate-pulse" />
                Uploading image…
              </div>
            )}
          </div>

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 rounded-lg focus:border-[var(--color-base)] outline-none resize-none h-16 text-sm"
          />

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-2 mt-1">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 bg-[var(--color-accent)] text-white p-2 rounded-lg hover:bg-[var(--color-base)] transition font-medium text-sm
                ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
