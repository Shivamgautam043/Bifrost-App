import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";
import { createUser } from "@/lib/backend/users";

export async function POST(req: Request) {
    try {
        const { fullName, phone, email, password } = await req.json();

        if (!fullName || !phone || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        // 1) Call your createUser() from submodule
        const result = await createUser({
            fullName,
            phone,
            email,
            password,
        });

        if (!result.success) {
            console.error(result.err.message);
            return NextResponse.json(
                { error: result.err?.message || "Failed to create user" },
                { status: 500 }
            );
        }
        const userId = result.data.id;
        const token = signJWT({ id: userId });
        const res = NextResponse.json({
            success: true,
            user: {
                id: userId,
                email,
            },
        });
        res.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            path: "/",
            sameSite: "lax",
        });
        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
