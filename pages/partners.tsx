"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";

import { fetchPartners, Partner } from "../redux/slices/partnersSlice";

import CreatePartnerModal from "../components/CreatePartnerModal";
import EditPartnerModal from "../components/EditPartnerModal";

import Loader from "@/components/Loader";
import Badge from "@/components/Badge";

import { PencilIcon, LinkIcon } from "@heroicons/react/24/outline";

export default function PartnersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { partners, status, error } = useSelector(
    (state: RootState) => state.partners
  );

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchPartners());
  }, [dispatch]);

  const openEdit = (partner: Partner) => {
    setSelectedPartner(partner);
    setEditOpen(true);
    setActiveMenu(null);
  };

  const cardColors = [
    "bg-[var(--color-secondary)]",
    "bg-[var(--color-base)]",
    "bg-[var(--color-gray)]",
  ];

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight font-figtree">
          Partners
        </h1>
        <button
          onClick={() => setCreateOpen(true)}
          className="bg-[var(--color-base)] text-white px-5 py-2 rounded-lg hover:brightness-110 hover:scale-[1.02] transition-all duration-300 font-semibold"
        >
          + Add Partner
        </button>
      </div>

      {/* Loader / Error */}
      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}
      {status === "failed" && <p className="text-red-500">{error}</p>}

      {/* Partners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {partners.map((partner, index) => {
          const cardColor = cardColors[index % cardColors.length];

          return (
            <div
              key={partner.id}
              className={`relative ${cardColor} rounded-2xl shadow p-6 flex items-center gap-4
                hover:shadow-2xl transition-all duration-300 min-h-[140px]`}
            >
              {/* Optional Badge */}
              {/* {partner.status && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge text={partner.} />
                </div>
              )} */}

              {/* Logo */}
              {partner.logo_url ? (
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                  ?
                </div>
              )}

              {/* Name and Website */}
              <div className="flex-1 flex flex-col overflow-hidden text-white">
                <h2 className="text-lg font-semibold break-words">{partner.name}</h2>
                {partner.website_url && (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-white/80 hover:text-white transition truncate gap-1"
                  >
                    <LinkIcon className="w-4 h-4" /> {partner.website_url}
                  </a>
                )}
              </div>

              {/* Menu */}
              <div className="relative">
                <button
                  onClick={() =>
                    setActiveMenu(activeMenu === partner.id ? null : partner.id)
                  }
                  className="w-8 h-8 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition"
                >
                  ⋮
                </button>

                {activeMenu === partner.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border overflow-hidden animate-scaleIn z-10">
                    <button
                      onClick={() => openEdit(partner)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 flex items-center gap-2 transition-colors text-black"
                    >
                      <PencilIcon className="w-4 h-4" /> Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      <CreatePartnerModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />
      <EditPartnerModal
        isOpen={editOpen}
        partner={selectedPartner}
        onClose={() => setEditOpen(false)}
      />
    </div>
  );
}
