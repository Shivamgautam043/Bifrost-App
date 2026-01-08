"use client";
import { useForm } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InputOtpField, InputPasswordField, InputTextField } from "./ui/InputFields";
import { loginAction, signupAction } from "@/lib/auth";
import { toast } from "react-toastify";
import { checkEmailAvailability } from "@/lib/backend/users";
import { createOtp, getOtp } from "@/lib/backend/otps";
import { Uuid } from "../../../submodules/submodule-database-manager-postgres/typeDefinitions";

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
    const [step, setStep] = useState<0 | 1>(0);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
        },
        validate: {
            name: (value) =>
                value.trim().length > 0 ? null : "Enter a valid name",
            phone: (value) =>
                /^[0-9]{10}$/.test(value) ? null : "Enter a valid 10-digit phone number",
            email: (value) =>
                /^\S+@\S+\.\S+$/.test(value) ? null : "Enter a valid email",
            password: (value) =>
                value.length >= 6 ? null : "Password must be at least 6 characters",
        },
    });

    const [otp, setOtp] = useState("");
    const [otpId, setOtpId] = useState("");
    const [errorInOtp, setErrorInOtp] = useState(false);
    useEffect(() => {
        setErrorInOtp(false);
    }, [otp]);

    const checkEmailStatus = async (value: string) => {
        const result = await checkEmailAvailability(value);
        if (result.success) return result.data;
        return true;
    };


    const handleStep0Click = async () => {
        const validation = form.validate();
        if (validation.hasErrors) return;

        if (!form.errors.email) {
            const isAvailable = await checkEmailStatus(form.values.email);
            if (!isAvailable) {
                form.setFieldError("email", "Email already taken");
                toast.error("Email already taken");
                return;
            }
        }

        try {
            setLoading(true);
            const result = await createOtp({ name: form.values.name, email: form.values.email });
            if (result.success) {
                setOtpId(result.data.id);
                toast.success(`OTP Sent! (${result.data.otpCode})`);
                setStep(1);
            } else {
                toast.error("Failed to generate OTP. Please try again.");
            }


        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const mutation = useMutation({
        mutationFn: async () => {
            const otpResult = await getOtp(otpId as Uuid);

            if (!otpResult.success) {
                throw new Error("Invalid or Expired OTP Session");
            }

            const serverOtpData = otpResult.data;
            if (serverOtpData.otpCode !== otp) {
                throw new Error("Incorrect OTP");
            }
            if (new Date() > new Date(serverOtpData.expiresAt)) {
                throw new Error("OTP Expired");
            }

            if (serverOtpData.isConsumed) {
                throw new Error("OTP already used");
            }
            const payload = {
                fullName: form.values.name,
                phone: form.values.phone,
                email: form.values.email,
                password: form.values.password,
            };

            const signupResult = await signupAction(payload);

            if (!signupResult.success) {
                throw new Error(signupResult.error);
            }

            return signupResult;
        },
        onSuccess: () => {
            toast.success("Account created successfully!");
            window.location.href = "/";
        },
        onError: (error) => {
            const msg = (error as Error).message;
            if (msg === "Incorrect OTP") {
                setErrorInOtp(true);
            }
            toast.error(msg);
        }
    });

    const handleStep1Click = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }
        mutation.mutate();
    };


    return (
        <div className="w-full">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4 w-full">

                <InputTextField
                    name="name"
                    label="Name"
                    placeholder="Enter your name"
                    form={form}
                    disabled={step === 1 || loading}
                    required
                />
                <InputTextField
                    name="phone"
                    label="Phone"
                    placeholder="Enter phone number"
                    form={form}
                    disabled={step === 1 || loading}
                    required
                />
                <InputTextField
                    name="email"
                    label="Email"
                    placeholder="Enter email"
                    form={form}
                    disabled={step === 1 || loading}
                    required
                    onBlurFunction={async (e) => {
                        if (step === 1) return;
                        const emailValue = e.target.value;
                        form.validateField("email");
                        if (!form.errors.email && emailValue) {
                            const isAvailable = await checkEmailStatus(emailValue);
                            if (!isAvailable) {
                                form.setFieldError("email", "Email already taken");
                                toast.error("Email already taken");
                            }
                        }
                    }}
                />
                <InputPasswordField
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    form={form}
                    disabled={step === 1 || loading}
                    required
                />

                {/* --- OTP FIELD (Only Visible in Step 1) --- */}
                {step === 1 && (
                    <div className="animate-slideDown">
                        <InputOtpField
                            otp={otp}
                            setOtp={setOtp}
                            otpId={otpId}
                            resendOtp={handleStep0Click}
                            errorInOtp={errorInOtp}
                        />
                    </div>
                )}

                {/* --- BUTTONS --- */}
                <div className="mt-2">
                    {step === 0 ? (
                        <button
                            type="button"
                            onClick={handleStep0Click}
                            disabled={loading}
                            className={`w-full bg-blue-600 text-white font-semibold p-3 rounded-lg transition-all flex justify-center items-center ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"
                                }`}
                        >
                            {loading ? "Sending OTP..." : "Continue"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleStep1Click}
                            disabled={mutation.isPending}
                            className={`w-full bg-blue-600 text-white font-semibold p-3 rounded-lg transition-all flex justify-center items-center gap-2 ${mutation.isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
                                }`}
                        >
                            {mutation.isPending && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {mutation.isPending ? "Verifying..." : "Sign Up"}
                        </button>
                    )}
                </div>

                {step === 1 && (
                    <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="text-xs text-gray-500 hover:text-black dark:hover:text-white underline text-center w-full"
                    >
                        Change Details
                    </button>
                )}
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