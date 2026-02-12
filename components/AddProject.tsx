"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { createProject } from "../redux/slices/projectsSlice";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";

const CreateProjectForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTitle = title.trim();
    if (!cleanTitle) {
      alert("Title is required");
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(
        createProject({
          title: cleanTitle,
          description: description.trim() || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        })
      );

      if (createProject.fulfilled.match(resultAction)) {
        alert("Project created successfully!");
        router.push("/projects");
      } else {
        alert(resultAction.payload || "Failed to create project");
      }
    } catch (err) {
      alert("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 bg-white rounded-xl shadow-lg p-4 animate-fadeIn">
      <h2 className="text-lg font-semibold mb-4 text-[var(--color-base)]">
        Create Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 text-sm">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Project title"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] transition"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[var(--color-accent)] transition resize-none"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block font-medium mb-1">Start</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-[var(--color-accent)] transition"
            />
          </div>

          <div className="flex-1">
            <label className="block font-medium mb-1">End</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-2 py-2 text-xs focus:ring-2 focus:ring-[var(--color-accent)] transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[var(--color-base)] text-white py-2 rounded-lg font-semibold transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? (
            <div className="flex justify-center py-1">
              <Loader />
            </div>
          ) : (
            "Create Project"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;
