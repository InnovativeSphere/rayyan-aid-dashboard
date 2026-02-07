"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createPartner } from "../redux/slices/partnersSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePartnerModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await dispatch(
      createPartner({
        name: name.trim(),
        logo_url: logoUrl || undefined,
        website_url: websiteUrl || undefined,
      })
    );

    setName("");
    setLogoUrl("");
    setWebsiteUrl("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold mb-4 text-[var(--color-base)] font-figtree">
          Create Partner
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Partner Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
        />

        <input
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="Logo URL (optional)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
        />

        <input
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          placeholder="Website URL (optional)"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition"
        />

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
