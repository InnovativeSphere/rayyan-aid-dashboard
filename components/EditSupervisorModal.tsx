"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updatePerson, deletePerson, Person } from "../redux/slices/peopleSlice";

interface EditSupervisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  supervisor: Person | null;
}

export default function EditSupervisorModal({
  isOpen,
  onClose,
  supervisor,
}: EditSupervisorModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (supervisor) {
      setFirstName(supervisor.first_name);
      setLastName(supervisor.last_name);
      setBio(supervisor.bio || "");
      setPhotoUrl(supervisor.photo_url || "");
      setImgError(false);
    }
  }, [supervisor]);

  if (!isOpen || !supervisor) return null;

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      updatePerson({
        id: supervisor.id,
        updates: {
          first_name: firstName,
          last_name: lastName,
          bio,
          photo_url: photoUrl || undefined,
        },
      })
    );
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this supervisor?")) {
      await dispatch(deletePerson(supervisor.id));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="
        bg-white rounded-xl shadow-xl p-6
        w-full max-w-xs
        sm:max-w-sm
        md:max-w-md
        lg:max-w-lg
        my-8 sm:my-12
        animate-fadeIn
      ">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-base)]">
            Edit Supervisor
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-lg sm:text-xl"
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
              className="
                w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                rounded-full object-cover border
              "
            />
          ) : (
            <div className="
              w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
              rounded-full bg-[var(--color-base)] text-white
              flex items-center justify-center
              text-lg sm:text-xl md:text-2xl font-bold
            ">
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

          <input
            type="text"
            placeholder="Photo URL (optional)"
            value={photoUrl}
            onChange={(e) => {
              setPhotoUrl(e.target.value);
              setImgError(false);
            }}
            className="w-full border p-2 sm:p-3 rounded-lg focus:border-[var(--color-base)] outline-none text-sm sm:text-base"
          />

          <textarea
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border p-2 sm:p-3 rounded-lg focus:border-[var(--color-base)] outline-none resize-none h-20 sm:h-24 text-sm sm:text-base"
          />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white p-2 sm:p-3 rounded-lg hover:bg-green-700 transition font-medium text-sm sm:text-base"
            >
              Update
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white p-2 sm:p-3 rounded-lg hover:bg-red-700 transition font-medium text-sm sm:text-base"
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
