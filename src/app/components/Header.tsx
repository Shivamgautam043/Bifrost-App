"use client";

import Image from "next/image";

export default function Header() {
    async function handleLogout() {
        const res = await fetch("/api/auth/logout", {
            method: "POST",
        });

        if (res.ok) {
            window.location.href = "/login";
        }
    }

    return (
        <header className="w-full px-6 py-3 bg-gray-100 dark:bg-black border-b flex items-center justify-between">

            {/* LEFT: Logo */}
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

            {/* RIGHT: Logout */}
            <button
                onClick={handleLogout}
                className="cursor-pointer"
                type="button"
            >
                <img src="https://cdn-icons-png.freepik.com/256/16584/16584919.png?semt=ais_white_label" alt="" width={32}/>
            </button>
        </header>
    );
}
