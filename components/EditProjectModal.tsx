"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  updateProject,
  deleteProject,
  Project,
} from "../redux/slices/projectsSlice";

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
    await dispatch(
      updateProject({
        id: project.id,
        updates: {
          title,
          description,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
          category_id: categoryId === "" ? undefined : Number(categoryId),
          target_donation: targetDonation === "" ? undefined : Number(targetDonation),
        },
      })
    );

    onClose();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this project?")) return;

    await dispatch(deleteProject(project.id));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4 animate-fadeIn">
        <h2 className="text-2xl font-bold text-[var(--color-base)] font-figtree">
          Edit Project
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
          placeholder="Project Title"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
          placeholder="Description"
        />

        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            value={targetDonation}
            onChange={(e) =>
              setTargetDonation(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="Target Donation"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
          />

          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between pt-4">
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:brightness-110 transition-all duration-300 text-sm"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300 text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
