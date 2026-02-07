"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPeople, Person } from "../redux/slices/peopleSlice";

import CreateSupervisorModal from "../components/CreateSupervisorModal";
import EditSupervisorModal from "../components/EditSupervisorModal";
import StatsCard from "../components/StatusCard";
import Loader from "../components/Loader";

import { Users, Pencil } from "lucide-react";
import "../app/globals.css";

export default function SupervisorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { people, loading, error } = useSelector(
    (state: RootState) => state.people
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] =
    useState<Person | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const supervisors = people.filter((p) => p.type === "supervisor");

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const openEditModal = (supervisor: Person) => {
    setSelectedSupervisor(supervisor);
    setEditModalOpen(true);
  };

  const getInitials = (p: Person) =>
    `${p.first_name.charAt(0)}${p.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="p-6 md:p-8 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-base)]">
          Supervisors
        </h1>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[var(--color-accent)] text-white px-5 py-2.5 rounded-lg
          shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
        >
          + Add Supervisor
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">

        <StatsCard
          title="Total Supervisors"
          value={supervisors.length}
          icon={<Users className="w-6 h-6 text-white" />}
          className="bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-base)]
          text-white h-[110px]"
        />

        <StatsCard
          title="Active"
          value={supervisors.filter((s) => s.is_active).length}
          icon={<Users className="w-6 h-6 text-white" />}
          className="bg-gradient-to-br from-black to-gray-800
          text-white h-[110px]"
        />

      </div>

      {/* LOADER */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <p className="text-red-500">{error}</p>
      )}

      {!loading && supervisors.length === 0 && (
        <p className="text-gray-500">No supervisors found.</p>
      )}

      {/* SUPERVISOR CARDS */}
      {!loading && (
        <div className="flex flex-col space-y-5">

          {supervisors.map((sup) => (
            <div
              key={sup.id}
              className="bg-white rounded-xl border
              shadow-sm hover:shadow-lg transition-all
              p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

              {/* LEFT */}
              <div className="flex items-start gap-4">

                {sup.photo_url && !brokenImages[sup.id] ? (
                  <img
                    src={sup.photo_url}
                    className="w-14 h-14 rounded-full object-cover border"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [sup.id]: true }))
                    }
                  />
                ) : (
                  <div
                    className="w-14 h-14 rounded-full
                    bg-[var(--color-base)] text-white
                    flex items-center justify-center font-bold"
                  >
                    {getInitials(sup)}
                  </div>
                )}

                <div className="flex flex-col space-y-1">

                  <h2 className="text-lg font-semibold text-gray-800">
                    {sup.first_name} {sup.last_name}
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-2 max-w-xl">
                    {sup.bio || "No bio provided."}
                  </p>

                  {sup.is_active !== undefined && (
                    <span
                      className={`text-xs font-medium ${
                        sup.is_active
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {sup.is_active ? "Active" : "Inactive"}
                    </span>
                  )}

                </div>
              </div>

              {/* RIGHT */}
              <div className="flex justify-end">

                <button
                  onClick={() => openEditModal(sup)}
                  className="flex items-center gap-1
                  bg-[var(--color-base)] text-white
                  px-3 py-1.5 rounded-md
                  text-sm shadow-sm
                  hover:shadow hover:brightness-110
                  transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

      {/* MODALS */}
      <CreateSupervisorModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <EditSupervisorModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        supervisor={selectedSupervisor}
      />

    </div>
  );
}
