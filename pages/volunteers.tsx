"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchPeople, Person } from "../redux/slices/peopleSlice";

import CreateVolunteerModal from "../components/CreateVolunteerModal";
import EditVolunteerModal from "../components/EditVolunteerModal";
import StatsCard from "../components/StatusCard";
import Loader from "../components/Loader";

import { Users, Pencil } from "lucide-react";
import "../app/globals.css";

export default function VolunteersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { people, loading, error } = useSelector(
    (state: RootState) => state.people
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] =
    useState<Person | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<number, boolean>>({});

  const volunteers = people.filter((p) => p.type === "volunteer");

  useEffect(() => {
    dispatch(fetchPeople());
  }, [dispatch]);

  const openEditModal = (volunteer: Person) => {
    setSelectedVolunteer(volunteer);
    setEditModalOpen(true);
  };

  const getInitials = (p: Person) =>
    `${p.first_name.charAt(0)}${p.last_name.charAt(0)}`.toUpperCase();

  return (
    <div className="p-6 md:p-8 space-y-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-base)]">
          Volunteers
        </h1>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="bg-[var(--color-secondary)] text-white px-5 py-2.5 rounded-lg
          shadow-md hover:shadow-lg hover:scale-[1.03] transition-all"
        >
          + Add Volunteer
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-xl">

        <StatsCard
          title="Total Volunteers"
          value={volunteers.length}
          icon={<Users className="w-6 h-6 text-white" />}
          className="bg-[var(--color-secondary)] text-white h-[110px]"
        />

        <StatsCard
          title="Active"
          value={volunteers.filter((v) => v.is_active).length}
          icon={<Users className="w-6 h-6 text-white" />}
          className="bg-[var(--color-base)] text-white h-[110px]"
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

      {!loading && volunteers.length === 0 && (
        <p className="text-gray-500">No volunteers found.</p>
      )}

      {/* VOLUNTEER CARDS */}
      {!loading && (
        <div className="flex flex-col space-y-5">

          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white rounded-xl border
              shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all
              p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

              {/* LEFT */}
              <div className="flex items-start gap-4">

                {vol.photo_url && !brokenImages[vol.id] ? (
                  <img
                    src={vol.photo_url}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border"
                    onError={() =>
                      setBrokenImages((prev) => ({ ...prev, [vol.id]: true }))
                    }
                  />
                ) : (
                  <div
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full
                    bg-[var(--color-secondary)] text-white
                    flex items-center justify-center font-bold"
                  >
                    {getInitials(vol)}
                  </div>
                )}

                <div className="flex flex-col space-y-1 max-w-xs sm:max-w-sm">

                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {vol.first_name} {vol.last_name}
                  </h2>

                  <p className="text-gray-500 text-sm line-clamp-2 max-w-full">
                    {vol.bio || "No bio provided."}
                  </p>

                  {vol.is_active !== undefined && (
                    <span
                      className={`text-xs font-medium ${
                        vol.is_active
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {vol.is_active ? "Active" : "Inactive"}
                    </span>
                  )}

                </div>
              </div>

              {/* RIGHT */}
              <div className="flex justify-end">

                <button
                  onClick={() => openEditModal(vol)}
                  className="flex items-center gap-1
                  bg-[var(--color-secondary)] text-white
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
      <CreateVolunteerModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      <EditVolunteerModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        volunteer={selectedVolunteer}
      />

    </div>
  );
}
