"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProjects } from "../redux/slices/projectsSlice";
import { addProjectImages, ProjectImageType } from "../redux/slices/ProjectImagesSlice";

import { XMarkIcon, ArrowUturnLeftIcon, ArrowUturnRightIcon, ArrowUpTrayIcon, FolderIcon } from "@heroicons/react/24/outline";

interface AddPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPhotoModal({ isOpen, onClose }: AddPhotoModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [beforeUrl, setBeforeUrl] = useState("");
  const [afterUrl, setAfterUrl] = useState("");
  const [beforeFileLoading, setBeforeFileLoading] = useState(false);
  const [afterFileLoading, setAfterFileLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const uploadToCloudinary = async (file: File, type: ProjectImageType) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      const res = await fetch("/api/cloud", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok && data.url) return data.url;
      throw new Error(data.message || "Upload failed");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload file");
      return "";
    }
  };

  const handleFileSelect = async (file: File, desc: "before" | "after") => {
    if (!file) return;

    const type: ProjectImageType = desc === "before" ? "project_before" : "project_after";
    desc === "before" ? setBeforeFileLoading(true) : setAfterFileLoading(true);

    const uploadedUrl = await uploadToCloudinary(file, type);

    if (uploadedUrl) {
      desc === "before" ? setBeforeUrl(uploadedUrl) : setAfterUrl(uploadedUrl);
    }

    desc === "before"
      ? setBeforeFileLoading(false)
      : setAfterFileLoading(false);
  };

  const handleSubmit = () => {
    if (!selectedProjectId) return alert("Please select a project");

    const imagesToAdd: { image_url: string; description: "before" | "after"; type: ProjectImageType }[] = [];

    if (beforeUrl.trim()) {
      imagesToAdd.push({ image_url: beforeUrl.trim(), description: "before", type: "project_before" });
    }

    if (afterUrl.trim()) {
      imagesToAdd.push({ image_url: afterUrl.trim(), description: "after", type: "project_after" });
    }

    if (imagesToAdd.length === 0) return alert("Add at least one image");

    dispatch(addProjectImages({ project_id: selectedProjectId, images: imagesToAdd }));

    setBeforeUrl("");
    setAfterUrl("");
    setSelectedProjectId(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl p-5 space-y-4 animate-fadeIn relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold text-[var(--color-base)] flex items-center gap-2">
          <ArrowUpTrayIcon className="w-5 h-5" />
          Add Images
        </h2>

        {/* Project select */}
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

        {/* Before / After Inputs */}
        <div className="grid grid-cols-2 gap-3">
          {/* Before */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <ArrowUturnLeftIcon className="w-4 h-4 text-gray-500" />
              Before
            </p>
            <input
              type="text"
              value={beforeUrl}
              onChange={(e) => setBeforeUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
            />
            <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 transition gap-1">
              <ArrowUpTrayIcon className="w-4 h-4" /> Upload
              <input
                type="file"
                accept="image/*"
                disabled={beforeFileLoading}
                onChange={(e) => handleFileSelect(e.target.files?.[0]!, "before")}
                className="hidden"
              />
            </label>
            {beforeFileLoading && <p className="text-xs text-gray-500">Uploading…</p>}
          </div>

          {/* After */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <ArrowUturnRightIcon className="w-4 h-4 text-gray-500" />
              After
            </p>
            <input
              type="text"
              value={afterUrl}
              onChange={(e) => setAfterUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none"
            />
            <label className="flex items-center justify-center border border-dashed rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-gray-50 transition gap-1">
              <ArrowUpTrayIcon className="w-4 h-4" /> Upload
              <input
                type="file"
                accept="image/*"
                disabled={afterFileLoading}
                onChange={(e) => handleFileSelect(e.target.files?.[0]!, "after")}
                className="hidden"
              />
            </label>
            {afterFileLoading && <p className="text-xs text-gray-500">Uploading…</p>}
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Upload or provide at least one image (before or after).
        </p>

        <button
          onClick={handleSubmit}
          className="w-full py-2.5 rounded-lg bg-[var(--color-base)] text-white text-sm font-semibold hover:brightness-110 transition"
        >
          Add Images
        </button>
      </div>
    </div>
  );
}
