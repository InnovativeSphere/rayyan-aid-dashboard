"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { X, Activity, Info } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface DonationsChartProps {
  data: {
    month: string;
    total: number;
  }[];
  onClose: () => void;
}

export default function DonationsChart({ data, onClose }: DonationsChartProps) {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Donations",
        data: data.map((d) => d.total),
        backgroundColor: "var(--color-accent)",
        borderRadius: 8,
        hoverBackgroundColor: "var(--color-base)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function (context: any) {
            return `₦${context.raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "var(--color-base)",
        },
        grid: {
          color: "var(--color-gray)/30",
        },
      },
      x: {
        ticks: {
          color: "var(--color-base)",
          autoSkip: false,
        },
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 sm:p-4 flex flex-col space-y-4 animate-scaleIn">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity size={20} className="text-[var(--color-base)]" />
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--color-base)]">
              Donation Analytics
            </h2>
            <Info size={16} className="text-gray-400" />
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-[var(--color-base)] transition-transform duration-300 hover:scale-110"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chart */}
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
            <Activity size={32} />
            <p className="text-center text-sm sm:text-base text-[var(--color-secondary)]">
              No donation data available.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Bar data={chartData} options={options} />
          </div>
        )}
      </div>
    </div>
  );
}
