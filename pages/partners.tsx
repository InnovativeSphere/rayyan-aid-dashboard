"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import {
  fetchPartners,
  deletePartner,
  Partner,
} from "../redux/slices/partnersSlice";

import CreatePartnerModal from "../components/CreatePartnerModal";
import EditPartnerModal from "../components/EditPartnerModal";
import Loader from "@/components/Loader";

import { Pencil, Link, Trash2 } from "lucide-react";

export default function PartnersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { partners, status, error } = useSelector(
    (state: RootState) => state.partners
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  /* INITIAL FETCH */
  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  /* REFRESH AFTER CREATE / EDIT / DELETE */
  useEffect(() => {
    if (!createOpen && !editOpen) {
      dispatch(fetchPartners());
    }
  }, [createOpen, editOpen, dispatch]);

  const openEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setEditOpen(true);
  };

  const handleDelete = async (partner: Partner) => {
    if (!confirm(`Delete partner "${partner.name}"?`)) return;

    await dispatch(deletePartner(partner.id));
    dispatch(fetchPartners());
  };

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[var(--color-base)]">
          Partners
        </h1>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-accent)] text-white
                     px-5 py-2 rounded-lg shadow
                     hover:shadow-md hover:scale-[1.02]
                     transition-all duration-300 font-medium"
        >
          + Add Partner
        </button>
      </div>

      {/* LOADER / ERROR */}
      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {status === "failed" && (
        <p className="text-red-500">{error}</p>
      )}

      {!partners.length && status !== "loading" && (
        <p className="text-gray-500">No partners found.</p>
      )}

      {/* PARTNERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl border shadow-sm
                       hover:shadow-lg transition-all
                       p-5 flex flex-col justify-between gap-3 min-h-[140px]"
          >
            {/* TOP ROW */}
            <div className="flex items-center gap-4">
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-16 h-16 rounded-full object-cover
                             border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300
                                flex items-center justify-center
                                text-white font-bold text-lg">
                  ?
                </div>
              )}

              <div className="flex-1 overflow-hidden">
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {partner.name}
                </h2>

                {partner.website_url && (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm
                               text-gray-500 hover:text-gray-800 truncate"
                  >
                    <Link className="w-4 h-4" />
                    {partner.website_url}
                  </a>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-between mt-3">
              <button
                onClick={() => openEdit(partner)}
                className="flex items-center gap-2 px-3 py-1.5
                           bg-[var(--color-base)] text-white
                           rounded-md shadow-sm
                           hover:brightness-110 transition-all text-sm"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>

              <button
                onClick={() => handleDelete(partner)}
                className="flex items-center gap-2 px-3 py-1.5
                           bg-red-600 text-white rounded-md
                           shadow-sm hover:bg-red-700
                           transition-all text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODALS */}
      <CreatePartnerModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditPartnerModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        partner={selectedPartner}
      />
    </div>
  );
}
