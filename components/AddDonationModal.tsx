"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchProjects } from "../redux/slices/projectsSlice";
import { addDonation, fetchDonations } from "../redux/slices/donationSlice";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddDonationModal({ isOpen, onClose }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { projects } = useSelector((state: RootState) => state.projects);

  const [projectId, setProjectId] = useState<number | "">("");
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState<number | "">("");

  useEffect(() => {
    if (isOpen) dispatch(fetchProjects());
  }, [isOpen, dispatch]);

  const handleSubmit = async () => {
    if (!projectId || amount === "" || isNaN(Number(amount))) return;

    await dispatch(
      addDonation({
        project_id: Number(projectId),
        donor_name: donorName || undefined,
        amount: Number(amount),
      })
    );

    await dispatch(fetchDonations());

    setProjectId("");
    setDonorName("");
    setAmount("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-xl shadow-xl p-4 animate-scaleIn relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
        >
          ✕
        </button>

        <h2 className="text-lg font-semibold mb-3">
          Add Donation
        </h2>

        <div className="space-y-3">
          {/* Project */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Project
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(Number(e.target.value))}
              className="w-full border border-gray-300 p-2 rounded-lg text-sm"
            >
              <option value="">Select project</option>
              {projects.length === 0 ? (
                <option disabled>Loading projects…</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Donor */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Donor Name
            </label>
            <input
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="Anonymous"
              className="w-full border border-gray-300 p-2 rounded-lg text-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full border border-gray-300 p-2 rounded-lg text-sm"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[var(--color-base)] text-white py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition"
          >
            Add Donation
          </button>
        </div>
      </div>
    </div>
  );
}
