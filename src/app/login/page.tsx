"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { TextHoverEffect } from "../components/ui/text-hover-effect";

export default function AuthForm() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  const mutation = useMutation({
    mutationFn: async (body: any) => {
      let endpoint = "/api/auth/login";
      if (mode === "signup") endpoint = "/api/auth/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Request failed");
      }

      return data;
    },

    onSuccess() {
      window.location.href = "/";
    },
  });

  function handleSubmit(e: any) {
    e.preventDefault();

    const form = new FormData(e.target);
    const email = form.get("email");
    const password = form.get("password");

    let body: any = { email, password };

    if (mode === "signup") {
      body.fullName = form.get("fullName");
      body.phone = form.get("phone");
    }

    mutation.mutate(body);
  }

  return (
    <div className="max-w-sm mx-auto mt-10 h-screen">
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === "signup" && (
          <>
            <input
              name="fullName"
              placeholder="Full Name"
              className="border p-2 rounded"
              disabled={mutation.isPending}
            />
            <input
              name="phone"
              placeholder="Phone"
              className="border p-2 rounded"
              disabled={mutation.isPending}
            />
          </>
        )}

        <input
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          disabled={mutation.isPending}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          disabled={mutation.isPending}
        />

        {mutation.isError && (
          <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
            {(mutation.error as Error).message}
          </p>
        )}

        {/* BUTTON */}
        <button
          className="bg-blue-600 text-white p-2 rounded disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : mode === "login" ? (
            "Login"
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Toggle */}
      <p className="mt-4 text-sm text-center">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <button
              onClick={() => setMode("signup")}
              className="text-blue-600 underline"
              disabled={mutation.isPending}
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
              disabled={mutation.isPending}
            >
              Login here
            </button>
          </>
        )}
      </p>

      <TextHoverEffect text="Bifrost" />
    </div>
  );
}
