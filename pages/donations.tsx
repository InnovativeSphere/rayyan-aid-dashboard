"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchDonations, Donation } from "../redux/slices/donationSlice";

import AddDonationModal from "../components/AddDonationModal";
import DonationsChart from "@/components/DonationsChart";
import DonationDetails from "@/components/DonationDetails";
import ViewDonationHistoryModal from "@/components/ViewDonationHistoryModal";
import Loader from "@/components/Loader";

import {
  DocumentTextIcon,
  EyeIcon,
  ChartBarIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

export default function DonationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { donations, status } = useSelector(
    (state: RootState) => state.donations,
  );

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(
    null,
  );
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const [filterProject, setFilterProject] = useState("All");

  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  useEffect(() => {
    if (!viewOpen && !chartOpen && !detailsOpen) {
      dispatch(fetchDonations());
    }
  }, [viewOpen, chartOpen, detailsOpen, dispatch]);

  const filteredDonations = useMemo(() => {
    if (filterProject === "All") return donations;
    return donations.filter((d) => d.project_title === filterProject);
  }, [filterProject, donations]);

  const projectOptions = Array.from(
    new Set(donations.map((d) => d.project_title || `Project ${d.project_id}`)),
  );

  const grouped: Record<number, Donation[]> = {};
  filteredDonations.forEach((d) => {
    if (!grouped[d.project_id]) grouped[d.project_id] = [];
    grouped[d.project_id].push(d);
  });

  const chartData = useMemo(() => {
    if (!selectedDonation) return [];
    const projectDonations = donations.filter(
      (d) => d.project_id === selectedDonation.project_id,
    );

    const map: Record<string, number> = {};
    projectDonations.forEach((d) => {
      const date = new Date(d.created_at);
      const key = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      map[key] = (map[key] || 0) + Number(d.amount || 0);
    });

    return Object.entries(map).map(([month, total]) => ({ month, total }));
  }, [selectedDonation, donations]);

  const openView = (d: Donation) => {
    setSelectedDonation(d);
    setViewOpen(true);
    setActiveMenu(null);
  };

  const openChart = (d: Donation) => {
    setSelectedDonation(d);
    setChartOpen(true);
    setActiveMenu(null);
  };

  const openDetails = (d: Donation) => {
    setSelectedDonation(d);
    setDetailsOpen(true);
    setActiveMenu(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="text-sm text-gray-500">
            Track and analyze incoming donations
          </p>
        </div>

     <button
  onClick={() => setAddOpen(true)}
  className="bg-[var(--color-base)] text-white px-2 py-0.5 text-sm rounded hover:bg-[var(--color-accent)] transition"
>
  + Add Donation
</button>

      </div>

      {/* Filter row */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="border rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition"
          >
            <option value="All">All Projects</option>
            {projectOptions.map((proj) => (
              <option key={proj} value={proj}>
                {proj}
              </option>
            ))}
          </select>
        </div>

        <div className="text-sm font-medium text-gray-700">
          Total Donors: {filteredDonations.length}
        </div>
      </div>

      {/* Loader */}
      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {/* Cards */}
      {status !== "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(grouped).map(([projectId, items]) => {
            const total = items.reduce(
              (sum, d) => sum + Number(d.amount || 0),
              0,
            );

            const projectTitle =
              items[0]?.project_title || `Project ${projectId}`;

            return (
              <div
                key={projectId}
                className="relative bg-white rounded-2xl border shadow-sm hover:shadow-lg transition"
              >
                <div
                  onClick={() => openDetails(items[0])}
                  className="p-6 flex flex-col gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-base)]/15 flex items-center justify-center">
                      <BanknotesIcon className="w-6 h-6 text-[var(--color-base)]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Project Total</p>
                      <h3 className="text-lg font-semibold truncate">
                        ₦{total.toLocaleString()}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 truncate">
                    {projectTitle}
                  </p>
                </div>

                {/* Menu */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(
                        activeMenu === Number(projectId)
                          ? null
                          : Number(projectId),
                      );
                    }}
                    className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition"
                  >
                    ⋮
                  </button>

                  {activeMenu === Number(projectId) && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border overflow-hidden animate-fadeIn z-20">
                      <MenuItem
                        icon={<DocumentTextIcon className="w-4 h-4" />}
                        onClick={() => openView(items[0])}
                      >
                        View History
                      </MenuItem>

                      <MenuItem
                        icon={<EyeIcon className="w-4 h-4" />}
                        onClick={() => openDetails(items[0])}
                      >
                        Details
                      </MenuItem>

                      <MenuItem
                        icon={<ChartBarIcon className="w-4 h-4" />}
                        onClick={() => openChart(items[0])}
                      >
                        Analytics
                      </MenuItem>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddDonationModal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          dispatch(fetchDonations());
        }}
      />

      <ViewDonationHistoryModal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        projectId={selectedDonation?.project_id || null}
        projectTitle={selectedDonation?.project_title}
      />

      {chartOpen && selectedDonation && (
        <DonationsChart data={chartData} onClose={() => setChartOpen(false)} />
      )}

      {detailsOpen && selectedDonation && (
        <DonationDetails
          donationId={selectedDonation.id}
          onClose={() => setDetailsOpen(false)}
        />
      )}
    </div>
  );
}

function MenuItem({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="w-full px-4 py-2 text-left flex items-center gap-2 text-sm hover:bg-[var(--color-base)]/10 transition"
    >
      {icon}
      {children}
    </button>
  );
}
