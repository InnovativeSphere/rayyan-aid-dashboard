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

interface EditPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ProjectImage | null;
}

export default function EditPhotoModal({ isOpen, onClose, image }: EditPhotoModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);
  const { loading } = useSelector((state: RootState) => state.projectImages);

  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
    if (image) {
      setSelectedProjectId(image.project_id);
      setImageUrl(image.image_url);
      setDescription(image.description || "");
    }
  }, [dispatch, image]);

  const handleUpdate = async () => {
    if (!image || !selectedProjectId || !imageUrl.trim()) return;

    try {
      await dispatch(removeProjectImage(image.id)).unwrap();
      await dispatch(addProjectImages({
        project_id: selectedProjectId,
        images: [{
          image_url: imageUrl.trim(),
          description: description.trim(),
        }],
      })).unwrap();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update image.");
    }
  };

  const handleDelete = async () => {
    if (!image) return;
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      await dispatch(removeProjectImage(image.id)).unwrap();
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete image.");
    }
  };

  if (!isOpen || !image) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full max-w-md relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-xl font-semibold mb-3">Edit Image</h2>

        <label className="block mb-1 text-sm font-medium">Project</label>
        <select
          value={selectedProjectId || ""}
          onChange={(e) => setSelectedProjectId(Number(e.target.value))}
          className="w-full mb-3 p-2 text-sm border rounded focus:border-[var(--color-accent)] transition-colors"
        >
          <option value="">Select project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        <label className="block mb-1 text-sm font-medium">Image URL</label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full mb-3 p-2 text-sm border rounded focus:border-[var(--color-accent)] transition-colors"
        />

        <label className="block mb-2 text-sm font-medium">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Image description"
          className="w-full mb-4 p-2 text-sm border rounded focus:border-[var(--color-accent)] transition-colors"
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Delete
          </button>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-3 py-1.5 rounded border hover:bg-gray-100 transition-all duration-300 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="w-full sm:w-auto px-3 py-1.5 rounded bg-green-600 text-white hover:bg-green-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
