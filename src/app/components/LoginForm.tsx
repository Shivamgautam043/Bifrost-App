"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { InputFieldWithLabel } from "./ui/InputFields";

export default function LoginForm() {
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
        <div className="w-fit p-7 bg-white dark:bg-[#121212] border-[#161616] border rounded-lg grid grid-cols-1 place-items-center min-w-md">
            <img src="https://res.cloudinary.com/duwfzddrs/image/upload/v1756146570/bifrost_2_zcda2y.png" alt="" width={40} />
            <h2 className="text-lg font-semibold mb-4">
                {mode === "login" ? "Login" : "Sign Up"} to Bifrost
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === "signup" && (
                    <>
                        <InputFieldWithLabel
                            name="fullName"
                            label="Full Name"
                            placeholder="Enter full name"
                            disabled={mutation.isPending}
                        />

                        <InputFieldWithLabel
                            name="phone"
                            label="Phone"
                            placeholder="Enter phone number"
                            disabled={mutation.isPending}
                        />
                    </>
                )}

                <InputFieldWithLabel
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    type="email"
                    disabled={mutation.isPending}
                />

                <InputFieldWithLabel
                    name="password"
                    label="Password"
                    placeholder="Enter password"
                    type="password"
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


        </div>


    );
}
