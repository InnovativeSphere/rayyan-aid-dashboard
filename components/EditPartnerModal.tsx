"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  updatePartner,
  deletePartner,
  Partner,
} from "../redux/slices/partnersSlice";
import { uploadImage } from "@/pages/lib/api";
import { X, Tag, ImageIcon, Link } from "lucide-react";
import Loader from "./Loader";

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
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (partner) {
      setName(partner.name || "");
      setLogoUrl(partner.logo_url || "");
      setWebsiteUrl(partner.website_url || "");
      setImgError(false);
    }
  }, [partner]);

  if (!isOpen || !partner) return null;

  const initials = name
    ? name
        .split(" ")
        .map((n) => n.charAt(0))
        .join("")
        .toUpperCase()
    : "P";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUploading(true);
    try {
      const res = await uploadImage(selectedFile, "partner");
      setLogoUrl(res.url);
      setImgError(false);
    } catch (err) {
      console.error("Logo upload failed:", err);
      setImgError(true);
    } finally {
      setUploading(false);
    }
  };

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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md p-5 flex flex-col animate-fadeIn space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Edit Partner
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Name */}
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <Tag size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Partner Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 outline-none text-sm sm:text-base"
          />
        </div>

        {/* Logo Upload */}
        <div className="flex items-center gap-3">
          {logoUrl && !imgError ? (
            <img
              src={logoUrl}
              alt="Logo preview"
              onError={() => setImgError(true)}
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[var(--color-base)] text-white flex items-center justify-center text-lg font-bold">
              {initials}
            </div>
          )}

          <label className="flex items-center gap-2 border border-dashed rounded-lg p-2 cursor-pointer hover:bg-gray-50 transition flex-1 justify-center">
            <ImageIcon size={16} />
            <span className="text-sm">Upload Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
        {uploading && (
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Loader /> Uploading...
          </p>
        )}

        {/* Logo URL */}
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <ImageIcon size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Logo URL (optional)"
            value={logoUrl}
            onChange={(e) => {
              setLogoUrl(e.target.value);
              setImgError(false);
            }}
            className="flex-1 outline-none text-sm sm:text-base"
          />
        </div>

        {/* Website URL */}
        <div className="flex items-center gap-2 border rounded-lg p-2">
          <Link size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Website URL (optional)"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className="flex-1 outline-none text-sm sm:text-base"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={handleDelete}
            className="px-3 py-2 rounded-lg bg-red-600 text-white hover:brightness-110 transition-all duration-300 text-sm sm:text-base"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-2 rounded-lg border hover:bg-gray-100 text-sm sm:text-base transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={uploading}
              className={`px-3 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300 text-sm sm:text-base ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
