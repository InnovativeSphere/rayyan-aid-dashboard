"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDonations,
  updateDonation,
  removeDonation,
} from "../redux/slices/donationSlice";
import { RootState, AppDispatch } from "../redux/store";
import { FaTimes, FaEdit, FaSave, FaTrash } from "react-icons/fa";
import type { Donation } from "../redux/slices/donationSlice";

interface DonationDetailsProps {
  donationId: number;
  onClose: () => void;
}

export default function DonationDetails({ donationId, onClose }: DonationDetailsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { donations, status } = useSelector((state: RootState) => state.donations);
  const donation = donations.find((d: Donation) => d.id === donationId);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ donor_name: "", amount: "" });

  useEffect(() => {
    if (status === "idle") dispatch(fetchDonations(undefined));
  }, [dispatch, status]);

  useEffect(() => {
    if (donation) {
      setForm({
        donor_name: donation.donor_name || "",
        amount: String(donation.amount),
      });
    }
  }, [donation]);

  if (status === "loading") {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded-lg shadow text-sm">
          Loading donation…
        </div>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="fixed inset-0 grid place-items-center bg-black/40">
        <div className="bg-white px-6 py-4 rounded-lg shadow text-sm">
          Donation not found
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    await dispatch(
      updateDonation({
        id: donation.id,
        donor_name: form.donor_name,
        amount: Number(form.amount),
      })
    );
    dispatch(fetchDonations(undefined));
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this donation?")) return;
    await dispatch(removeDonation(donation.id));
    dispatch(fetchDonations(undefined));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 animate-fadeIn">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-xl p-4 space-y-4 animate-scaleIn">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-[var(--color-base)]">
            Donation Details
          </h2>
          <button onClick={onClose} className="p-1">
            <FaTimes className="w-4 h-4 text-[var(--color-base)]" />
          </button>
        </div>

        <div className="text-xs text-[var(--color-gray)] space-y-1">
          <p>Project: {donation.project_title || donation.project_id}</p>
          <p>Date: {new Date(donation.donation_date).toLocaleDateString()}</p>
        </div>

        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1 bg-green-600 text-white px-2 py-1 rounded"
          >
            <FaSave /> Save
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded"
          >
            <FaTrash /> Delete
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div>
            <label className="text-xs font-medium">Donor Name</label>
            {isEditing ? (
              <input
                value={form.donor_name}
                onChange={(e) => setForm({ ...form, donor_name: e.target.value })}
                className="w-full border p-2 rounded-lg"
              />
            ) : (
              <p className="mt-1">{donation.donor_name || "Anonymous"}</p>
            )}
          </div>

          <div>
            <label className="text-xs font-medium">Amount</label>
            {isEditing ? (
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full border p-2 rounded-lg"
              />
            ) : (
              <p className="mt-1 font-semibold text-[var(--color-accent)]">
                ₦{Number(donation.amount).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
