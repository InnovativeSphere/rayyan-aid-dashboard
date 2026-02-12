"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { fetchDonations } from "../redux/slices/donationSlice";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: number | null;
  projectTitle?: string;
}

export default function DonationAnalyticsModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { donations } = useSelector((state: RootState) => state.donations);

  useEffect(() => {
    if (isOpen && projectId) {
      dispatch(fetchDonations(projectId));
    }
  }, [isOpen, projectId, dispatch]);

  if (!isOpen || !projectId) return null;

  const chartData = donations.map((d) => ({
    date: new Date(d.donation_date).toLocaleDateString(),
    amount: Number(d.amount),
  }));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-3xl p-6 rounded-xl shadow-xl animate-scaleIn relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black hover:rotate-90 transition-all"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-1">Donation Analytics</h2>

        <p className="text-gray-500 mb-6">{projectTitle}</p>

        {chartData.length === 0 && (
          <p className="text-gray-500">No donations yet.</p>
        )}

        {chartData.length > 0 && (
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
