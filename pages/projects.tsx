"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { fetchProjects, Project } from "../redux/slices/projectsSlice";
import { fetchCategories } from "../redux/slices/categoriesSlice";

import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";

import Loader from "@/components/Loader";

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
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchCategories());
  }, [dispatch]);

  const filteredProjects = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter(p => p.category_name === filter);
  }, [projects, filter]);

  const ringColors = [
    "bg-[var(--color-base)]",
    "bg-[var(--color-accent)]",
    "bg-[var(--color-secondary)]",
  ];

  const formatDate = (dateStr?: string) => dateStr?.split("T")[0] || null;

  const getStatusBadge = (project: Project) => {
    const now = new Date();
    const end = project.end_date ? new Date(project.end_date) : null;
    if (end && end < now) {
      return (
        <div className="inline-flex items-center gap-1 text-xs text-red-500 font-semibold whitespace-nowrap">
          <XCircleIcon className="w-4 h-4 flex-shrink-0" /> Completed
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-1 text-xs text-blue-800 font-semibold whitespace-nowrap">
          <CheckCircleIcon className="w-4 h-4 flex-shrink-0" /> Ongoing
        </div>
      );
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Projects</h1>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
            >
              <option value="All">All Projects</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="bg-[var(--color-base)] text-white px-4 py-2 rounded hover:brightness-110 transition w-full sm:w-auto"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project, index) => {
          const cardColor = ringColors[index % ringColors.length];

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all p-5 flex flex-col sm:flex-row justify-between gap-4 min-h-[130px]"
            >
              {/* Left: Icon + Info */}
              <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                <div
                  className={`w-12 h-12 rounded-full ${cardColor} flex items-center justify-center text-white flex-shrink-0`}
                >
                  <TagIcon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">{project.category_name || "Uncategorized"}</p>
                  <h3 className="font-semibold text-lg break-words">{project.title}</h3>

                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    {project.start_date && (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                        {formatDate(project.start_date)}
                      </span>
                    )}

                    {project.target_donation !== undefined && (
                      <span className="flex items-center gap-1 whitespace-nowrap">
                        <CurrencyDollarIcon className="w-3 h-3 flex-shrink-0" />
                        ₦{project.target_donation.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Status + Menu */}
              <div className="flex items-center gap-3 flex-shrink-0 mt-3 sm:mt-0">
                {getStatusBadge(project)}

                <div className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === project.id ? null : project.id)
                    }
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
                  >
                    ⋮
                  </button>

                  {activeMenu === project.id && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border overflow-hidden animate-scaleIn z-20">
                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setDetailsOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      >
                        <InformationCircleIcon className="w-4 h-4" />
                        Details
                      </button>

                      <button
                        onClick={() => {
                          setSelectedProject(project);
                          setEditOpen(true);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                      >
                        <PencilIcon className="w-4 h-4" />
                        Edit
                      </button>
                    </div>
                  )}
                </div>
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 break-words">{selectedProject.title}</h2>
            <p className="text-gray-600 mb-4">{selectedProject.description || "No description"}</p>
            <div className="text-sm text-gray-400 space-y-1">
              {selectedProject.start_date && <p>Start: {formatDate(selectedProject.start_date)}</p>}
              {selectedProject.end_date && <p>End: {formatDate(selectedProject.end_date)}</p>}
              {selectedProject.category_name && <p>Category: {selectedProject.category_name}</p>}
              {selectedProject.target_donation !== undefined && <p>Target: ₦{selectedProject.target_donation.toLocaleString()}</p>}
            </div>
            <button
              onClick={() => setDetailsOpen(false)}
              className="mt-4 bg-[var(--color-base)] text-white px-4 py-2 rounded hover:brightness-110 transition w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
