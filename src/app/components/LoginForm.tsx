"use client";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InputPasswordField, InputTextField } from "./ui/InputFields";
import { loginAction, signupAction } from "@/lib/auth";

export default function AuthEntry() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const queryMode = searchParams.get("mode") as "login" | "signup" | null;
    const [mode, setMode] = useState<"login" | "signup">(
        queryMode === "signup" ? "signup" : "login"
    );

    useEffect(() => {
        const current = searchParams.get("mode");
        if (current !== mode) {
            router.replace(`?mode=${mode}`);
        }
    }, [mode, router, searchParams]);

    return (
        <div className="w-fit p-7 bg-white dark:bg-[#121212] border border-[#c9cbcf] shadow-[0_0_20px_rgba(0,0,0,0.22)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)] dark:border-[#181818] rounded-lg grid place-items-center min-w-[350px]">
            <img
                src="https://res.cloudinary.com/duwfzddrs/image/upload/v1756146570/bifrost_2_zcda2y.png"
                alt="Bifrost Logo"
                width={40}
                style={{ borderRadius: 6 }}
            />

            <h2 className="text-lg font-semibold my-4 text-[#333333] dark:text-[#cbccd3]">
                {mode === "login" ? "Login" : "Sign Up"} to Bifrost
            </h2>

            {mode === "login" ? (
                <LoginComponent onToggle={() => setMode("signup")} />
            ) : (
                <SignupComponent onToggle={() => setMode("login")} />
            )}
        </div>
    );
}

function LoginComponent({ onToggle }: { onToggle: () => void }) {
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: typeof form.values) => {
            const result = await loginAction(values);

            if (!result.success) {
                throw new Error(result.error);
            }

            return result;
        },
        onSuccess: () => {
            window.location.href = "/";
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.validate().hasErrors) return;
        mutation.mutate(form.values);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                <InputTextField
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    form={form}
                    disabled={mutation.isPending}
                    required
                />
                <InputPasswordField
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
                    className={`bg-blue-600 text-white p-2 rounded disabled:opacity-60 flex justify-center ${mutation.isPending ? "cursor-progress opacity-75" : "cursor-pointer"
                        }`}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Logging in..." : "Login"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <button
                    onClick={onToggle}
                    type="button" // Important: preventing form submission on click
                    className="text-blue-600 underline"
                >
                    Create one
                </button>
            </p>
        </div>
    );
}


function SignupComponent({ onToggle }: { onToggle: () => void }) {
    const form = useForm({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
        },
        validate: {
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
            name: (value) =>
                value.trim().length > 0 ? null : "Enter a valid name",
            phone: (value) =>
                /^[0-9]{10}$/.test(value) ? null : "Enter a valid 10-digit phone number",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: typeof form.values) => {
            const payload = {
                fullName: values.name,
                phone: values.phone,
                email: values.email,
                password: values.password,
            };

            const result = await signupAction(payload);

            if (!result.success) {
                throw new Error(result.error);
            }
            
            return result;
        },
        onSuccess: () => {
            window.location.href = "/";
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.validate().hasErrors) return;
        mutation.mutate(form.values);
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
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
                <InputTextField
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    form={form}
                    disabled={mutation.isPending}
                    required
                />
                <InputPasswordField
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
                    className={`bg-blue-600 text-white p-2 rounded disabled:opacity-60 flex justify-center ${
                        mutation.isPending ? "cursor-progress opacity-75" : "cursor-pointer"
                    }`}
                    disabled={mutation.isPending}
                >
                    {mutation.isPending ? "Creating account..." : "Sign Up"}
                </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <button 
                    onClick={onToggle} 
                    type="button" 
                    className="text-blue-600 underline"
                >
                    Login here
                </button>
            </p>
        </div>
    );
}