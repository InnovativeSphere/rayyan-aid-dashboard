"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  fetchProjectImages,
  ProjectImage,
} from "../redux/slices/ProjectImagesSlice";
import AddProjectImageModal from "../components/AddProjectImageModal";
import EditProjectImageModal from "../components/EditProjectImageModal";
import Loader from "../components/Loader";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function PhotosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { images, loading, error } = useSelector(
    (state: RootState) => state.projectImages
  );

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projectFilter, setProjectFilter] = useState<string>("All");

  useEffect(() => {
    dispatch(fetchProjectImages());
  }, [dispatch, refreshCounter]);

  const openEditModal = (img: ProjectImage) => {
    setSelectedImage(img);
    setEditModalOpen(true);
  };

  const handleRefresh = () => setRefreshCounter((prev) => prev + 1);

  // Group images by project
  const groupedImages: Record<string, ProjectImage[]> = {};
  images
    .filter((img) => projectFilter === "All" || img.project_title === projectFilter)
    .forEach((img) => {
      const projectName = img.project_title || `Project ${img.project_id}`;
      if (!groupedImages[projectName]) groupedImages[projectName] = [];
      groupedImages[projectName].push(img);
    });

  // Auto-slide effect
  useEffect(() => {
    const maxImages = Math.max(
      ...Object.values(groupedImages).map((imgs) =>
        Math.max(
          imgs.filter((i) => i.description === "before").length,
          imgs.filter((i) => i.description === "after").length
        )
      ),
      0
    );
    if (maxImages === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % maxImages);
    }, 3500);
    return () => clearInterval(interval);
  }, [groupedImages]);

  const projectOptions = ["All", ...Array.from(new Set(images.map((i) => i.project_title)))];

  return (
    <div className="p-6 sm:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-base)] font-figtree">
          Project Photos
        </h1>
        <div className="flex gap-2 items-center">
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="border rounded px-3 py-1 shadow-sm bg-white"
          >
            {projectOptions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1 bg-[var(--color-base)] hover:bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            Add Image
          </button>
        </div>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}
      {error && <p className="text-red-500 font-medium">{error}</p>}

      {Object.entries(groupedImages).map(([projectName, imgs]) => {
        const beforeImages = imgs.filter((i) => i.description === "before");
        const afterImages = imgs.filter((i) => i.description === "after");

        return (
          <div key={projectName} className="space-y-6">
            <h2 className="text-2xl font-semibold text-[var(--color-accent)] font-figtree">
              {projectName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CrossfadeSlideshow
                images={beforeImages}
                label="Before"
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                onEdit={openEditModal}
              />
              <CrossfadeSlideshow
                images={afterImages}
                label="After"
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                onEdit={openEditModal}
              />
            </div>
          </div>
        );
      })}

      <AddProjectImageModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          handleRefresh();
        }}
      />
      <EditProjectImageModal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          handleRefresh();
        }}
        image={selectedImage}
      />
    </div>
  );
}

// ------------------- CrossfadeSlideshow Component -------------------

interface CrossfadeSlideshowProps {
  images: ProjectImage[];
  label: string;
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  onEdit: (img: ProjectImage) => void;
}

function CrossfadeSlideshow({
  images,
  label,
  currentIndex,
  setCurrentIndex,
  onEdit,
}: CrossfadeSlideshowProps) {
  if (!images || images.length === 0)
    return (
      <div className="border border-gray-200 rounded-lg p-6 text-center text-gray-400 font-figtree bg-white shadow-sm">
        No {label} images
      </div>
    );

  const idx = currentIndex % images.length;
  const currentImage = images[idx];
  const visibleThumbnails = images.slice(0, 6);

  return (
    <div className="relative border border-gray-200 rounded-lg shadow-lg overflow-hidden bg-white">
      <div className="absolute top-2 left-2 bg-[var(--color-accent)] text-white px-3 py-1 rounded z-10 text-sm font-medium font-figtree shadow">
        {label}
      </div>

      <div className="relative w-full h-64 sm:h-72 md:h-80 lg:h-96">
        {images.map((img, i) => (
          <img
            key={img.id}
            src={img.image_url}
            alt={`${label} image`}
            className={`absolute inset-0 w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover rounded transition-opacity duration-700 ease-in-out ${
              i === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => onEdit(currentImage)}
        className="absolute bottom-2 right-2 z-20 bg-[var(--color-base)] hover:bg-[var(--color-accent)] text-white px-3 py-1 rounded-lg shadow font-figtree text-sm transition-all duration-300"
      >
        Edit
      </button>

      <div className="flex justify-start mt-4 space-x-2 overflow-x-auto z-10 relative pb-2">
        {visibleThumbnails.map((img, i) => (
          <img
            key={img.id}
            src={img.image_url}
            alt="thumbnail"
            className={`w-12 h-12 sm:w-14 sm:h-14 object-cover rounded border cursor-pointer transition-all duration-300 hover:scale-105 ${
              i === idx ? "border-[var(--color-base)]" : "border-gray-300"
            }`}
            onClick={() => setCurrentIndex(i)}
          />
        ))}
        {images.length > 6 && (
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-gray-200 rounded text-sm font-medium text-gray-600">
            +{images.length - 6}
          </div>
        )}
      </div>
    </div>
  );
}
