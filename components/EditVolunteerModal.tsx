"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updatePerson, deletePerson, Person } from "../redux/slices/peopleSlice";

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

  useEffect(() => {
    if (volunteer) {
      setFirstName(volunteer.first_name);
      setLastName(volunteer.last_name);
      setBio(volunteer.bio || "");
      setPhotoUrl(volunteer.photo_url || "");
      setImgError(false);
    }
  }, [volunteer]);

  if (!isOpen || !volunteer) return null;

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "V";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updatePerson({
        id: volunteer.id,
        updates: { first_name: firstName, last_name: lastName, bio, photo_url: photoUrl || undefined },
      })
    );
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this volunteer?")) {
      await dispatch(deletePerson(volunteer.id));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xs sm:max-w-sm md:max-w-md animate-fadeIn my-12 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Edit Volunteer
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
        <form onSubmit={handleUpdate} className="space-y-3">
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

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              className="flex-1 bg-[var(--color-accent)] text-white p-2 rounded-lg hover:bg-[var(--color-base)] transition font-medium text-sm"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
