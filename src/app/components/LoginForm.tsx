"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { InputFieldWithLabel, InputTextField } from "./ui/InputFields";
import { useForm } from "@mantine/form";

export default function LoginForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryMode = searchParams.get("mode") as "login" | "signup" | null;

    const [mode, setMode] = useState<"login" | "signup">(
        queryMode === "signup" ? "signup" : "login"
    );

    useEffect(() => {
        const current = searchParams.get("mode");
        if (current !== mode) {
            router.replace(`/login?mode=${mode}`);
        }
    }, [mode, router, searchParams]);

    const form = useForm<{
        name: string;
        email: string;
        phone: string;
        password: string;
    }>({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
        },
        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
            name: (value) =>
                value.trim().length > 0 ? null : "Enter a valid name",
            phone: (value) =>
                /^[0-9]{10}$/.test(value)
                    ? null
                    : "Enter a valid 10-digit phone number",
        },
    });

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
        const formData = new FormData(e.target);

        const body: any = {
            email: form.values.email,
            password: form.values.password,
        };

        if (mode === "signup") {
            body.fullName = form.values.name;
            body.phone = form.values.phone;
        }

        mutation.mutate(body);
    }

    return (
        <div className="w-fit p-7 bg-white dark:bg-[#121212] border border-[#c9cbcf] shadow-[0_0_20px_rgba(0,0,0,0.22)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)] dark:border-[#181818] rounded-lg grid place-items-center min-w-sm">
            <img
                src="https://res.cloudinary.com/duwfzddrs/image/upload/v1756146570/bifrost_2_zcda2y.png"
                alt=""
                width={40}
                style={{ borderRadius: 6 }}
            />

            <h2 className="text-lg font-semibold my-4 text-[#333333] dark:text-[#cbccd3]">
                {mode === "login" ? "Login" : "Sign Up"} to Bifrost
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                {mode === "signup" && (
                    <>

                        <InputTextField
                            name="name"
                            label="Name"
                            placeholder="Enter your name"
                            form={form}
                            disabled={mutation.isPending}
                            required
                        />
                        <InputTextField
                            name="phone"
                            label="Phone"
                            placeholder="Enter phone number"
                            form={form}
                            disabled={mutation.isPending}
                            required
                        />

                    </>
                )}


                <InputTextField
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    form={form}
                    disabled={mutation.isPending}
                    required
                />

                <InputTextField
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    form={form}
                    disabled={mutation.isPending}
                    required
                />

                {mutation.isError && (
                    <p className="text-red-600 text-sm bg-red-100 p-2 rounded">
                        {(mutation.error as Error).message}
                    </p>
                )}

                <button
                    className="bg-blue-600 text-white p-2 rounded disabled:opacity-60 flex justify-center"
                    disabled={mutation.isPending}
                >
                    {mutation.isPending
                        ? "Loading..."
                        : mode === "login"
                            ? "Login"
                            : "Sign Up"}
                </button>
            </form>

            {/* 🔹 Toggle */}
            <p className="mt-4 text-sm text-center">
                {mode === "login" ? (
                    <>
                        Don&apos;t have an account?{" "}
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
                            onClick={() => {
                                setMode("login");
                                form.reset();
                            }}
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
