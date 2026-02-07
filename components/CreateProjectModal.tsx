"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { createProject } from "../redux/slices/projectsSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [targetDonation, setTargetDonation] = useState<number | "">("");

  // fetch categories from slice
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    // optional: if categories slice has a fetch action, you can dispatch it here
    // dispatch(fetchCategories());
  }, [dispatch]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await dispatch(
      createProject({
        title: title.trim(),
        description: description.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        category_id: categoryId === "" ? undefined : Number(categoryId),
        target_donation: targetDonation === "" ? undefined : Number(targetDonation),
      })
    );

    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setCategoryId("");
    setTargetDonation("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4 animate-fadeIn"
      >
        <h2 className="text-2xl font-bold mb-2 text-[var(--color-base)] font-figtree">
          Create Project
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Project Title"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[var(--color-accent)] focus:outline-none transition text-sm"
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

        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[var(--color-base)] text-white font-semibold hover:brightness-110 hover:scale-[1.03] transition-all duration-300 text-sm"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
