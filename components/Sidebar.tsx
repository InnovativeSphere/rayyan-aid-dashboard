"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import {
  HomeIcon,
  UserGroupIcon,
  PhotoIcon,
  ClipboardIcon,
  GiftIcon,
  Bars3Icon,
  XMarkIcon,
  UserIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { logoutUser } from "../redux/slices/authSlice";
import { useRouter } from "next/navigation";
import { FaAmericanSignLanguageInterpreting } from "react-icons/fa";
import { Users } from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Donations", href: "/donations", icon: GiftIcon },
  { name: "Projects", href: "/projects", icon: ClipboardIcon },
  { name: "Photos", href: "/photos", icon: PhotoIcon },
  { name: "Supervisors", href: "/supervisors", icon: UserGroupIcon },
  { name: "Volunteers", href: "/volunteers", icon: UserGroupIcon },
  { name: "Profile", href: "/profile", icon: UserIcon },
  {
    name: "Register",
    href: "/signup",
    icon: FaAmericanSignLanguageInterpreting,
  },
  { name: "Category", href: "/categories", icon: WindowIcon },
  { name: "Partners", href: "/partners", icon: Users },
];

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-[var(--color-black)] text-[var(--color-white)]
        flex flex-col transition-all duration-500 z-50
        ${collapsed ? "w-16" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-gray)]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Image
              src="/Rayyan Aid Logo-03.png"
              alt="Rayyan Aid Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-[var(--color-base)] text-lg tracking-wide">
              Rayyan Aid
            </span>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-[var(--color-gray)] rounded-lg transition-all duration-300"
        >
          {collapsed ? (
            <Bars3Icon className="w-6 h-6 text-[var(--color-base)]" />
          ) : (
            <XMarkIcon className="w-6 h-6 text-[var(--color-base)]" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center gap-3 p-2 rounded-lg text-sm font-medium
              text-white
              transition-all duration-300
              ${
                pathname === item.href
                  ? "bg-[var(--color-accent)] shadow-md"
                  : "bg-transparent hover:bg-[var(--color-base)]/30"
              }
            `}
          >
            <item.icon className="w-5 h-5 text-white transition-colors duration-300" />
            {!collapsed && (
              <span className="truncate text-white">{item.name}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-[var(--color-gray)]">
        <button
          onClick={async () => {
            await dispatch(logoutUser());
            router.push("/");
          }}
          className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-base)] p-2 rounded-lg transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2"
        >
          {!collapsed && "Logout"}
          {!collapsed && <XMarkIcon className="w-4 h-4 text-white" />}
        </button>
      </div>
    </aside>
  );
}
