import { NextResponse } from "next/server";
import { signJWT } from "@/lib/jwt";
import { verifyUser } from "@/lib/backend/users";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required." },
                { status: 400 }
            );
        }

        const result = await verifyUser({ email, password });

        if (!result.success) {
            return NextResponse.json(
                { error: result.err?.message ?? "Invalid credentials" },
                { status: 401 }
            );
        }

        const user = result.data;

        const token = signJWT({
            id: user.id,
            email: user.email,
            fullName: user.full_name,
            phone: user.phone,
        });

        const res = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                phone: user.phone,
            },
        });

        res.cookies.set("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
