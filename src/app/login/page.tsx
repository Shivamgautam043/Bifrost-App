"use client";

import { useState } from "react";

export default function AuthForm() {
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.target);

    // COMMON FIELDS
    const email = form.get("email");
    const password = form.get("password");

    let body: any = { email, password };
    let endpoint = "/api/auth/login";

    // SIGNUP MODE → add extra fields
    if (mode === "signup") {
      body.fullName = form.get("fullName");
      body.phone = form.get("phone");
      endpoint = "/api/auth/signup";
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      setError(data.error || "Request failed");
      return;
    }

    // SUCCESS → redirect
    window.location.href = "/dashboard";
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* SIGNUP FIELDS */}
        {mode === "signup" && (
          <>
            <input
              name="fullName"
              placeholder="Full Name"
              className="border p-2 rounded"
            />
            <input
              name="phone"
              placeholder="Phone"
              className="border p-2 rounded"
            />
          </>
        )}

        {/* COMMON FIELDS */}
        <input
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
        />

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
            {error}
          </p>
        )}

        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {mode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      {/* TOGGLE BUTTON */}
      <p className="mt-4 text-sm text-center">
        {mode === "login" ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => setMode("signup")}
              className="text-blue-600 underline"
            >
              Create one
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("login")}
              className="text-blue-600 underline"
            >
              Login here
            </button>
          </>
        )}
      </p>
    </div>
  );
}
