"use client";

import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { InputPasswordField, InputTextField } from "./ui/InputFields"; // Assuming these exist from your previous code
import { updatePasswordAction, updateProfileAction } from "@/lib/auth";


interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export default function SettingsForm({ user }: { user: UserData }) {
    const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

    return (
        <div className="w-fit p-7 bg-white dark:bg-[#121212] border border-[#c9cbcf] shadow-[0_0_20px_rgba(0,0,0,0.22)] dark:shadow-[0_0_20px_rgba(0,0,0,0.6)] dark:border-[#181818] rounded-lg min-w-[350px] max-w-[400px]">
            
            <div className="flex flex-col items-center mb-6">
                <img
                    src="https://res.cloudinary.com/duwfzddrs/image/upload/v1756146570/bifrost_2_zcda2y.png"
                    alt="Bifrost Logo"
                    width={40}
                    style={{ borderRadius: 6 }}
                    className="mb-3"
                />
                <h2 className="text-xl font-semibold text-[#333333] dark:text-[#cbccd3]">
                    Account Settings
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                </p>
            </div>

       
            <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6">
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                        activeTab === "profile"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                >
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={`flex-1 pb-2 text-sm font-medium transition-colors ${
                        activeTab === "security"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    }`}
                >
                    Security
                </button>
            </div>

            {activeTab === "profile" ? (
                <ProfileUpdateForm user={user} />
            ) : (
                <PasswordUpdateForm userId={user.id} />
            )}
        </div>
    );
}

function ProfileUpdateForm({ user }: { user: UserData }) {
    const form = useForm({
        initialValues: {
            name: user.name || "",
            phone: user.phone || "",
        },
        validate: {
            name: (value) => (value.trim().length > 0 ? null : "Name cannot be empty"),
            phone: (value) =>
                /^[0-9]{10}$/.test(value) ? null : "Enter a valid 10-digit phone number",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: typeof form.values) => {
            const result = await updateProfileAction(user.id, values);
            if (!result.success) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            toast.success("Profile updated successfully!");
        },
        onError: (err) => {
            toast.error((err as Error).message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.validate().hasErrors) return;
        mutation.mutate(form.values);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
            <InputTextField
                name="name"
                label="Display Name"
                placeholder="Your Name"
                form={form}
                disabled={mutation.isPending}
            />
            <InputTextField
                name="phone"
                label="Phone Number"
                placeholder="0000000000"
                form={form}
                disabled={mutation.isPending}
            />
            
            <button
                type="submit"
                disabled={mutation.isPending || !form.isDirty()}
                className={`mt-2 w-full bg-blue-600 text-white font-semibold p-2.5 rounded-lg transition-all flex justify-center items-center ${
                    mutation.isPending || !form.isDirty() ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
            >
                {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}

function PasswordUpdateForm({ userId }: { userId: string }) {
    const form = useForm({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validate: {
            password: (value) => (value.length >= 6 ? null : "Min 6 characters"),
            confirmPassword: (value, values) =>
                value === values.password ? null : "Passwords do not match",
        },
    });

    const mutation = useMutation({
        mutationFn: async (values: typeof form.values) => {
            const result = await updatePasswordAction(userId, { password: values.password });
            if (!result.success) throw new Error(result.error);
            return result;
        },
        onSuccess: () => {
            toast.success("Password changed successfully!");
            form.reset();
        },
        onError: (err) => {
            toast.error((err as Error).message);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.validate().hasErrors) return;
        mutation.mutate(form.values);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 animate-fadeIn">
            <InputPasswordField
                name="password"
                label="New Password"
                placeholder="******"
                form={form}
                disabled={mutation.isPending}
            />
            <InputPasswordField
                name="confirmPassword"
                label="Confirm Password"
                placeholder="******"
                form={form}
                disabled={mutation.isPending}
            />

            <button
                type="submit"
                disabled={mutation.isPending || !form.isDirty()}
                className={`mt-2 w-full bg-red-600 text-white font-semibold p-2.5 rounded-lg transition-all flex justify-center items-center ${
                    mutation.isPending || !form.isDirty() ? "opacity-70 cursor-not-allowed" : "hover:bg-red-700"
                }`}
            >
                {mutation.isPending ? "Updating..." : "Update Password"}
            </button>
        </form>
    );
}