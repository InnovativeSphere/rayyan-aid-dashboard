"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  updateProject,
  deleteProject,
  Project,
} from "../redux/slices/projectsSlice";
import Loader from "@/components/Loader";

interface Props {
  isOpen: boolean;
  project: Project | null;
  onClose: () => void;
}

export default function EditProjectModal({ isOpen, project, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [targetDonation, setTargetDonation] = useState<number | "">("");
  const [loading, setLoading] = useState(false);

  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (project) {
      setTitle(project.title || "");
      setDescription(project.description || "");
      setStartDate(project.start_date || "");
      setEndDate(project.end_date || "");
      setCategoryId(project.category_id ?? "");
      setTargetDonation(project.target_donation ?? "");
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const handleUpdate = async () => {
    setLoading(true);

    await dispatch(
      updateProject({
        id: project.id,
        updates: {
          title,
          description,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          category_id: categoryId === "" ? undefined : Number(categoryId),
          target_donation:
            targetDonation === "" ? undefined : Number(targetDonation),
        },
      })
    );

    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;

    setLoading(true);
    await dispatch(deleteProject(project.id));
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-4 space-y-3 animate-fadeIn">

        <h2 className="text-lg font-semibold text-[var(--color-base)]">
          Edit Project
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project title"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[var(--color-accent)] transition"
        />

        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-[var(--color-accent)] transition"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-[var(--color-accent)] transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={targetDonation}
            onChange={(e) =>
              setTargetDonation(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            placeholder="Target ₦"
            className="border rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-[var(--color-accent)] transition"
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="border rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-[var(--color-accent)] transition"
          >
            <option value="">Category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-3 py-2 rounded-lg bg-red-600 text-white text-xs disabled:opacity-50"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-3 py-2 rounded-lg border text-xs hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-3 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold text-xs disabled:opacity-50"
            >
              {loading ? <Loader /> : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
