"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import Link from "next/link";

import {
  fetchDonations,
  fetchDonationsGroupedByAmount,
  fetchTotalDonationsPerProject,
} from "../redux/slices/donationSlice";
import { fetchProjects } from "../redux/slices/projectsSlice";
import { fetchPartners } from "../redux/slices/partnersSlice";

import StatsCard from "@/components/StatusCard";
import { Card } from "@/components/Card";
import RecentDonationsTable from "../components/RecentDonationsTable";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  Folder,
  DollarSign,
  Image as ImageIcon,
  Activity,
  Users,
  Handshake,
} from "lucide-react";
import Loader from "@/components/Loader";
import Badge from "@/components/Badge";

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedProject, setSelectedProject] = useState<number | "all">("all");

  const { donations } = useSelector((state: RootState) => state.donations);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { partners } = useSelector((state: RootState) => state.partners);

  useEffect(() => {
    dispatch(fetchDonations());
    dispatch(fetchDonationsGroupedByAmount());
    dispatch(fetchTotalDonationsPerProject());
    dispatch(fetchProjects());
    dispatch(fetchPartners());
  }, [dispatch]);

  /* -------------------- DATA -------------------- */

  const filteredDonations = useMemo(() => {
    return selectedProject === "all"
      ? donations
      : donations.filter((d) => d.project_id === selectedProject);
  }, [donations, selectedProject]);

  const recentDonations = useMemo(() => {
    return filteredDonations
      .slice(-8)
      .reverse()
      .map((d) => ({ ...d, donor_name: d.donor_name || "Anonymous" }));
  }, [filteredDonations]);

  const totalDonationsAmount = useMemo(() => {
    return filteredDonations.reduce((acc, d) => acc + Number(d.amount || 0), 0);
  }, [filteredDonations]);

  const formattedTotal = useMemo(() => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(totalDonationsAmount);
  }, [totalDonationsAmount]);

  const isLoading = !projects.length && !donations.length;

  /* -------------------- UI -------------------- */

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12 mt-6 animate-fadeIn">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-black)]">
            Dashboard
          </h1>
          <p className="text-sm text-gray-500">
            Platform performance overview
          </p>
        </div>

        <select
          value={selectedProject}
          onChange={(e) =>
            setSelectedProject(
              e.target.value === "all" ? "all" : Number(e.target.value),
            )
          }
          className="rounded-lg px-4 py-2 text-sm border border-gray-300 bg-white
                     transition focus:outline-none focus:ring-2
                     focus:ring-[var(--color-accent)]"
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Donation Analytics</h2>
            <Badge text="Live" />
          </div>

          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donations}>
                <XAxis dataKey="id" tickLine={false} />
                <YAxis tickLine={false} />
                <Tooltip />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]}>
                  {donations.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        index % 3 === 0
                          ? "var(--color-secondary)"
                          : index % 3 === 1
                          ? "var(--color-base)"
                          : "var(--color-accent)"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* SUMMARY */}
        <Card className="hover:shadow-lg transition-shadow">
          <h2 className="font-semibold mb-4">Summary</h2>

          <div className="flex flex-col gap-4 text-sm">
            {[
              ["Total Donations", formattedTotal],
              ["Total Donors", filteredDonations.length],
              ["Total Projects", projects.length],
              ["Partners", partners.length],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-600">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <StatsCard title="Projects" value={projects.length}
          className="bg-[var(--color-secondary)] text-white hover:scale-[1.02] transition"
          icon={<Folder className="w-5 h-5" />}
        />
        <StatsCard title="Donations" value={formattedTotal}
          className="bg-[var(--color-base)] text-white hover:scale-[1.02] transition"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard title="Donors" value={filteredDonations.length}
          className="bg-[var(--color-accent)] text-white hover:scale-[1.02] transition"
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard title="Partners" value={partners.length}
          className="bg-[var(--color-secondary)] text-white hover:scale-[1.02] transition"
          icon={<Handshake className="w-5 h-5" />}
        />
        <StatsCard title="Active" value={projects.length}
          className="bg-[var(--color-base)] text-white hover:scale-[1.02] transition"
          icon={<Activity className="w-5 h-5" />}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              name: "Projects",
              href: "/projects",
              icon: Folder,
              color: "bg-[var(--color-secondary)]/10",
              iconColor: "text-[var(--color-secondary)]",
            },
            {
              name: "Donations",
              href: "/donations",
              icon: DollarSign,
              color: "bg-[var(--color-base)]/10",
              iconColor: "text-[var(--color-base)]",
            },
            {
              name: "Photos",
              href: "/photos",
              icon: ImageIcon,
              color: "bg-[var(--color-accent)]/10",
              iconColor: "text-[var(--color-accent)]",
            },
          ].map((item) => (
            <Link key={item.name} href={item.href}>
              <Card
                className={`flex items-center gap-4 p-6 ${item.color}
                hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div
                  className={`w-12 h-12 rounded-full bg-white flex items-center justify-center ${item.iconColor}`}
                >
                  <item.icon className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-sm text-gray-500">Manage</p>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* RECENT DONATIONS */}
      <Card className="hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Recent Donations</h2>
          <Link
            href="/donations"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            View all
          </Link>
        </div>

        <RecentDonationsTable donations={recentDonations} />
      </Card>
    </div>
  );
}
