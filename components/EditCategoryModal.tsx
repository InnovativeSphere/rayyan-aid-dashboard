"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hook";
import { editCategory } from "../redux/slices/categoriesSlice";
import type { Category } from "../redux/slices/categoriesSlice";
import { X, Tag, FileText } from "lucide-react";
import '../app/globals.css';

interface Props {
  open: boolean;
  onClose: () => void;
  category: Category | null;
}

export default function EditCategoryModal({ open, onClose, category }: Props) {
  const dispatch = useAppDispatch();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description);
    }
  }, [category]);

  if (!open || !category) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setLoading(true);
    await dispatch(editCategory({ id: category.id, data: { name, description } }));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md p-5 flex flex-col animate-fadeIn">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-[var(--color-base)]">
            Edit Category
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <div className="flex items-center gap-2 border rounded-lg p-2">
            <Tag size={16} className="text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category Name"
              className="flex-1 outline-none text-sm sm:text-base"
            />
          </div>

          <div className="flex items-start gap-2 border rounded-lg p-2">
            <FileText size={16} className="text-gray-400 mt-1" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              rows={3}
              className="flex-1 outline-none text-sm sm:text-base resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-lg border hover:bg-gray-100 transition text-sm sm:text-base"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 rounded-lg bg-[var(--color-accent)] text-white hover:bg-[var(--color-base)] transition font-medium text-sm sm:text-base ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
