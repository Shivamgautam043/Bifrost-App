"use server";
import { createUser, verifyUser } from "@/lib/backend/users";
import { signJWT } from "@/lib/jwt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type ActionResponse = 
  | { success: true }
  | { success: false; error: string };

export async function loginAction(values: { email: string; password: string }): Promise<ActionResponse> {
    const { email, password } = values;

    if (!email || !password) {
        return { success: false, error: "Email and password are required." };
    }
    const result = await verifyUser({ email, password });

    if (!result.success) {
        return { 
            success: false, 
            error: result.err?.message ?? "Invalid credentials" 
        };
    }

    const user = result.data;
    const token = signJWT({
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        phone: user.phone,
    });
    const cookieStore = await cookies();
    
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // Optional: 1 week
    });

    return { success: true };
}

export async function signupAction(values: { 
    fullName: string; 
    phone: string; 
    email: string; 
    password: string 
}): Promise<ActionResponse> {
    const { fullName, phone, email, password } = values;

    if (!fullName || !phone || !email || !password) {
        return { success: false, error: "All fields are required." };
    }

    const result = await createUser({
        fullName,
        phone,
        email,
        password,
    });

    if (!result.success) {
        return { 
            success: false, 
            error: result.err?.message || "Failed to create user" 
        };
    }

    const userId = result.data.id;

    const token = signJWT({ 
        id: userId,
        // email, fullName, phone - add these if your specific JWT payload needs them
    });

    const cookieStore = await cookies();
    
    cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });

    return { success: true };
}

export async function logoutAction() {
  (await cookies()).delete("token");
  redirect("/login");
}
