"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { fetchCategories, removeCategory } from "@/redux/slices/categoriesSlice";

import CreateCategoryModal from "@/components/CreateCategoryModal";
import EditCategoryModal from "@/components/EditCategoryModal";
import Loader from "@/components/Loader";

import { FiTrash2, FiPlus } from "react-icons/fi";
import { Pencil } from "lucide-react";

export default function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading, error } = useAppSelector(state => state.category);

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
        <h1 className="text-2xl font-semibold text-[var(--color-base)]">Categories</h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] text-white px-4 py-2 rounded-lg shadow hover:shadow-md hover:brightness-105 transition-all font-medium"
        >
          <FiPlus className="w-4 h-4" />
          Create Category
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

      {/* GRID OF CARDS */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-all cursor-pointer relative p-5 flex flex-col justify-between gap-3"
            >
              {/* CARD CONTENT */}
              <h2 className="text-lg font-semibold text-gray-800 truncate">{category.name}</h2>
              <p className="text-gray-500 text-sm line-clamp-3">{category.description || "No description provided."}</p>

              {/* ICONS */}
              <div className="flex justify-between items-center mt-3">
                <button
                  onClick={e => handleDelete(e, category.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-600 transition-all text-sm"
                >
                  <FiTrash2 className="w-5 h-5" />
                  Delete
                </button>

                <button
                  onClick={() => handleCardClick(category)}
                  className="flex items-center gap-1 text-[var(--color-base)] hover:text-[var(--color-accent)] transition-all text-sm"
                >
                  <Pencil className="w-5 h-5" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      <CreateCategoryModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditCategoryModal open={editOpen} onClose={() => setEditOpen(false)} category={selectedCategory} />
    </div>
  );
}
