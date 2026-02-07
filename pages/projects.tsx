"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { fetchProjects, Project } from "../redux/slices/projectsSlice";
import { fetchCategories } from "../redux/slices/categoriesSlice";

import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";

import Loader from "@/components/Loader";
import StatsCard from "@/components/StatusCard";

import {
  PencilIcon,
  InformationCircleIcon,
  CalendarIcon,
  TagIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export default function ProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading } = useSelector((state: RootState) => state.projects);
  const { categories } = useSelector((state: RootState) => state.category);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter(p => p.category_name === filter);
  }, [projects, filter]);

  const ringColors = [
    "bg-[var(--color-base)]",
    "bg-[var(--color-accent)]",
    "bg-[var(--color-secondary)]",
  ];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return dateStr.split("T")[0]; // YYYY-MM-DD
  };

  const getStatusBadge = (project: Project) => {
    const now = new Date();
    const end = project.end_date ? new Date(project.end_date) : null;
    if (end && end < now) {
      return (
        <div className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold">
          <XCircleIcon className="w-4 h-4" /> Completed
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-1 text-xs text-blue-800 font-semibold">
          <CheckCircleIcon className="w-4 h-4" /> Ongoing
        </div>
      );
    }
  };

  return (
    <div className="p-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border px-3 py-1 text-sm border-gray-300 bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[var(--color-base)] text-white px-4 py-2 rounded hover:brightness-110 transition"
          >
            + Create Project
          </button>
        </div>
      </div>

      {/* Loader */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project, index) => {
          const cardColor = ringColors[index % ringColors.length];

          return (
            <div
              key={project.id}
              className={`relative ${cardColor} rounded-2xl shadow p-5 flex flex-col justify-between hover:shadow-2xl transition-all duration-300 text-white min-h-[180px]`}
            >
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-semibold">{project.title}</h2>

                {/* Menu */}
                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === project.id ? null : project.id)
                    }
                    className="w-8 h-8 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition"
                  >
                    ⋮
                  </button>

                  {activeMenu === project.id && (
                    <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border overflow-hidden animate-scaleIn z-20">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setDetailsOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 transition-colors text-black"
                      >
                        <InformationCircleIcon className="w-4 h-4" /> Details
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setEditOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 transition-colors text-black"
                      >
                        <PencilIcon className="w-4 h-4" /> Edit
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="mt-3 text-sm space-y-1">
                {project.description && <p>{project.description}</p>}
                {project.category_name && (
                  <div className="flex items-center gap-1">
                    <TagIcon className="w-4 h-4" /> {project.category_name}
                  </div>
                )}
                {project.start_date && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" /> {formatDate(project.start_date)}
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" /> {formatDate(project.end_date)}
                  </div>
                )}
                {project.target_donation !== undefined && (
                  <div className="flex items-center gap-1">
                    <CurrencyDollarIcon className="w-4 h-4" /> ₦{project.target_donation.toLocaleString()}
                  </div>
                )}
                {/* Status Badge */}
                <div className="mt-2">{getStatusBadge(project)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditProjectModal
        isOpen={editOpen}
        project={selectedProject}
        onClose={() => setEditOpen(false)}
      />

      {/* Details Modal */}
      {detailsOpen && selectedProject && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fadeIn">
            <h2 className="text-xl font-bold mb-2">{selectedProject.title}</h2>
            <p className="text-gray-600 mb-4">{selectedProject.description || "No description"}</p>
            <div className="text-sm text-gray-400 space-y-1">
              {selectedProject.start_date && <p>Start: {formatDate(selectedProject.start_date)}</p>}
              {selectedProject.end_date && <p>End: {formatDate(selectedProject.end_date)}</p>}
              {selectedProject.category_name && <p>Category: {selectedProject.category_name}</p>}
              {selectedProject.target_donation !== undefined && <p>Target: ₦{selectedProject.target_donation.toLocaleString()}</p>}
            </div>
            <button
              onClick={() => setDetailsOpen(false)}
              className="mt-4 bg-[var(--color-base)] text-white px-4 py-2 rounded hover:brightness-110 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
