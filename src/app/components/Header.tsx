"use client";

import { logoutAction } from "@/lib/auth";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function Header({
  user,
}: {
  user: { id: string; name: string; email: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function handleLogout() {
    await logoutAction();
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="fixed right-0 top-0 w-full h-16 px-6 bg-gray-100 dark:bg-black shadow-[0_1px_4px_rgba(0,0,0,0.15)] dark:shadow-[0_1px_4px_rgba(255,255,255,0.15)] flex items-center justify-between !z-50">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/duwfzddrs/image/upload/v1756146570/bifrost_2_zcda2y.png"
            width={40}
            height={40}
            alt="Logo"
            className="rounded"
          />
          <span className="font-semibold text-lg">Bifrost</span>
        </div>

        {user ? (
          // LOGGED IN STATE
          <div className="relative" ref={dropdownRef}>
            {/* AVATAR BUTTON */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 border border-gray-300 dark:border-white/30 text-black dark:text-white font-semibold transition-all duration-200 hover:shadow-md hover:shadow-black/20 dark:hover:shadow-white/20"
            >
              {user.name ? user.name.charAt(0).toUpperCase() : ""}
            </button>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-3 w-56 rounded-lg pt-4 bg-white dark:bg-gray-900 shadow-lg shadow-black/10 dark:shadow-white/10 border border-gray-200 dark:border-white/20 animate-slideDown">
                <div className="mb-3 px-4">
                  <p className="font-semibold text-black dark:text-white">
                    {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <hr className="border-gray-200 dark:border-white/20" />
                <button className="w-full text-left text-sm py-2 px-4 hover:bg-gray-100 dark:hover:bg-white/10 transition cursor-pointer">
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm py-2 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-500/20 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // LOGGED OUT STATE (LOGIN BUTTON)
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {/* Simple Login Icon (SVG) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            Login
          </Link>
        )}
      </header>

      {/* Spacer */}
      <div className="h-16 w-full" />
    </>
  );
}