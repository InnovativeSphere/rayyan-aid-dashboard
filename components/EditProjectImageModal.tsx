"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  addProjectImages,
  removeProjectImage,
  ProjectImage,
} from "../redux/slices/ProjectImagesSlice";
import { fetchProjects } from "../redux/slices/projectsSlice";

import { XMarkIcon, FolderIcon, PhotoIcon, ArrowUpTrayIcon, PencilIcon } from "@heroicons/react/24/outline";

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ProjectImage | null;
}

export default function EditPhotoModal({
  isOpen,
  onClose,
  image,
}: EditPhotoModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [fileLoading, setFileLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());

    if (image) {
      setSelectedProjectId(image.project_id);
      setImageUrl(image.image_url);
      setDescription(image.description || "");
    }
  }, [dispatch, image]);

  const uploadToCloudinary = async (file: File, type: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/cloud", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      return data.url;
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload image");
      return "";
    }
  };

  const handleFileSelect = async (file: File) => {
    if (!file || !image) return;

    setFileLoading(true);
    const uploadedUrl = await uploadToCloudinary(
      file,
      image.type || "project_before"
    );

    if (uploadedUrl) setImageUrl(uploadedUrl);
    setFileLoading(false);
  };

  const handleUpdate = async () => {
    if (!image || !selectedProjectId || !imageUrl.trim())
      return alert("Select a project and provide an image");

    await dispatch(removeProjectImage(image.id)).unwrap();

    await dispatch(
      addProjectImages({
        project_id: selectedProjectId,
        images: [
          {
            image_url: imageUrl.trim(),
            description: description.trim(),
            type: image.type || "project_before",
          },
        ],
      })
    ).unwrap();

    onClose();
  };

  const handleDelete = async () => {
    if (!image) return;
    if (!confirm("Delete this image?")) return;

    await dispatch(removeProjectImage(image.id)).unwrap();
    onClose();
  };

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5 space-y-4 animate-fadeIn relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <h2 className="text-lg font-bold text-[var(--color-base)] flex items-center gap-2">
          <PencilIcon className="w-5 h-5" />
          Edit Image
        </h2>

        {/* Project selector */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <FolderIcon className="w-4 h-4 text-gray-500" /> Project
            <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedProjectId || ""}
            onChange={(e) => setSelectedProjectId(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          >
            <option value="">Select project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Image URL / Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <PhotoIcon className="w-4 h-4 text-gray-500" />
            Image
          </label>

          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste image URL (optional)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          />

          <label className="flex items-center justify-between border border-dashed rounded-lg px-3 py-2 text-sm cursor-pointer hover:bg-gray-50 transition gap-2">
            <ArrowUpTrayIcon className="w-4 h-4 text-gray-500" />
            Upload replacement
            <input
              type="file"
              accept="image/*"
              disabled={fileLoading}
              onChange={(e) => handleFileSelect(e.target.files?.[0]!)}
              className="hidden"
            />
          </label>

          {fileLoading && <p className="text-xs text-gray-500">Uploading image…</p>}
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            <PencilIcon className="w-4 h-4 text-gray-500" />
            Description
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
          <button
            onClick={handleDelete}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm hover:brightness-110 transition"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={fileLoading}
              className="px-3 py-1.5 rounded-lg bg-[var(--color-base)] text-white text-sm hover:brightness-110 transition disabled:opacity-50"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
