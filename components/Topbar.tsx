"use client";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface TopbarProps {
  sidebarCollapsed: boolean;
}

export default function Topbar({ sidebarCollapsed }: TopbarProps) {
  const user = useSelector((state: RootState) => state.auth.currentUser);

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 bg-[var(--color-white)] shadow-md
        flex items-center px-6 z-40
        transition-all duration-500 ease-in-out
        ${sidebarCollapsed ? "left-16" : "left-64"}
      `}
    >
      <div className="font-bold text-[var(--color-base)] text-lg transition-all duration-500">
      Jewel Foundation
      </div>

      {user && (
        <div className="ml-auto text-[var(--color-black)] text-sm md:text-base transition-all duration-500">
          Welcome, {user.first_name}
        </div>
      )}
    </header>
  );
}
