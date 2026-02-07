"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  fetchCategories,
  removeCategory,
} from "@/redux/slices/categoriesSlice";

import CreateCategoryModal from "@/components/CreateCategoryModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import StatsCard from "@/components/StatusCard";
import Loader from "@/components/Loader";

import { FiTrash2, FiPlus } from "react-icons/fi";
import { Pencil } from "lucide-react";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(
    (state) => state.category,
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!createOpen && !editOpen) {
      dispatch(fetchCategories());
    }
  }, [createOpen, editOpen, dispatch]);

  const handleCardClick = (category: any) => {
    setSelectedCategory(category);
    setEditOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm("Delete this category?")) return;

    await dispatch(removeCategory(id));
    dispatch(fetchCategories());
  };

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-[var(--color-base)]">
          Categories
        </h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2
          bg-[var(--color-accent)] text-white
          px-4 py-2 rounded-md text-sm
          shadow-sm hover:shadow hover:brightness-110 transition-all"
        >
          <FiPlus className="text-sm" />
          Create
        </button>
      </div>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && categories.length === 0 && (
        <p className="text-gray-500 text-sm">No categories found.</p>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <div
              key={category.id}
              onClick={() => handleCardClick(category)}
              className="relative cursor-pointer
              hover:scale-[1.02] transition-transform"
            >
              <StatsCard
                title={category.name}
                value={category.description || "—"}
                icon={<Pencil className="w-4 h-4" />}
                className={`h-35 p-5
                  ${
                    idx % 3 === 0
                      ? "bg-gradient-to-br from-[var(--color-base)] to-[var(--color-accent)] text-white"
                      : idx % 3 === 1
                        ? "bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-secondary)] text-white"
                        : "bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-base)] text-white"
                  }
                `}
              />

              {/* DELETE */}
              <button
                onClick={(e) => handleDelete(e, category.id)}
                className="absolute top-4 right-4
                text-white/80 hover:text-red-400
                transition-colors"
              >
                <FiTrash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <CreateCategoryModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditCategoryModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
}
