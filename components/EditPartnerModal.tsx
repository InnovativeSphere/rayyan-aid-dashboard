"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  updatePartner,
  deletePartner,
  Partner,
} from "../redux/slices/partnersSlice";

interface Props {
  isOpen: boolean;
  partner: Partner | null;
  onClose: () => void;
}

export default function EditPartnerModal({ isOpen, partner, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  useEffect(() => {
    if (partner) {
      setName(partner.name || "");
      setLogoUrl(partner.logo_url || "");
      setWebsiteUrl(partner.website_url || "");
    }
  }, [partner]);

  if (!isOpen || !partner) return null;

  const handleUpdate = async () => {
    if (!name.trim()) return;

    await dispatch(
      updatePartner({
        id: partner.id,
        data: {
          name: name.trim(),
          logo_url: logoUrl || undefined,
          website_url: websiteUrl || undefined,
        },
      })
    );

    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    await dispatch(deletePartner(partner.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-5 animate-fadeIn">
        <h2 className="text-2xl font-bold text-[var(--color-base)] font-figtree">
          Edit Partner
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

        <div className="flex justify-between pt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:brightness-110 transition-all duration-300"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
