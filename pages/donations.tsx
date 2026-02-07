"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchDonations, Donation } from "../redux/slices/donationSlice";

import AddDonationModal from "../components/AddDonationModal";
import DonationsChart from "@/components/DonationsChart";
import DonationDetails from "@/components/DonationDetails";
import ViewDonationHistoryModal from "@/components/ViewDonationHistoryModal";

import StatusCard from "@/components/StatusCard";

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
  const [selectedDonation, setSelectedDonation] =
    useState<Donation | null>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  /* INITIAL FETCH */
  useEffect(() => {
    dispatch(fetchDonations());
  }, [dispatch]);

  /* REFRESH AFTER MODALS CLOSE */
  useEffect(() => {
    if (!viewOpen && !chartOpen && !detailsOpen) {
      dispatch(fetchDonations());
    }
  }, [viewOpen, chartOpen, detailsOpen, dispatch]);

  /* GROUP BY PROJECT */
  const grouped: Record<number, Donation[]> = {};
  donations.forEach((d) => {
    if (!grouped[d.project_id]) grouped[d.project_id] = [];
    grouped[d.project_id].push(d);
  });

  /* CHART DATA */
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

  /* OPENERS */
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

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Donations
          </h1>
          <p className="text-sm text-gray-500">
            Track and analyze all incoming donations
          </p>
        </div>

        <button
          onClick={() => setAddOpen(true)}
          className="bg-[var(--color-base)] text-white px-5 py-2 rounded-lg
          hover:brightness-110 hover:scale-[1.03] transition-all"
        >
          + Add Donation
        </button>
      </div>

      {/* LOADER */}
      {status === "loading" && (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      )}

      {/* CARDS */}
      {status !== "loading" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

          {Object.entries(grouped).map(([projectId, items], index) => {
            const total = items.reduce(
              (sum, d) => sum + Number(d.amount || 0),
              0,
            );

            const projectTitle =
              items[0]?.project_title || `Project ${projectId}`;

            const colorVariants = [
              "bg-[var(--color-base)]/10",
              "bg-[var(--color-secondary)]/10",
              "bg-[var(--color-accent)]/10",
            ];

            return (
            <div
  key={projectId}
  className={`relative rounded-xl p-1 
    hover:shadow-xl hover:-translate-y-1 transition-all
    ${colorVariants[index % colorVariants.length]}`}
>
  {/* CLICKABLE WRAPPER */}
  <div
    className="cursor-pointer"
    onClick={() => openDetails(items[0])} // handle clicks here
  >
    <StatusCard
      title={projectTitle}
      value={`₦${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
      icon={<BanknotesIcon className="w-6 h-6 text-[var(--color-base)]" />}
      className="bg-white h-[150px] flex flex-col justify-center"
    />
  </div>

  {/* MENU */}
  <div className="absolute top-2 right-2 z-20">
    <button
      onClick={(e) => {
        e.stopPropagation();
        setActiveMenu(
          activeMenu === Number(projectId)
            ? null
            : Number(projectId),
        );
      }}
      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition"
    >
      ⋮
    </button>

    {activeMenu === Number(projectId) && (
      <div
        className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border overflow-hidden animate-fadeIn"
      >
        <MenuItem
          icon={<DocumentTextIcon className="w-4 h-4 mr-2" />}
          onClick={() => openView(items[0])}
        >
          View History
        </MenuItem>

        <MenuItem
          icon={<EyeIcon className="w-4 h-4 mr-2" />}
          onClick={() => openDetails(items[0])}
        >
          Details
        </MenuItem>

        <MenuItem
          icon={<ChartBarIcon className="w-4 h-4 mr-2" />}
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

      {/* MODALS */}
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
        <DonationsChart
          data={chartData}
          onClose={() => setChartOpen(false)}
        />
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
      className="w-full text-left px-4 py-2 hover:bg-[var(--color-base)]/10 flex items-center transition-colors"
    >
      {icon} {children}
    </button>
  );
}
