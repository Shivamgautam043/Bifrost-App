import { verifyUser } from "@/lib/backend/users";
import { signJWT } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let formData;

    try {
      formData = await req.formData();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Please add form data" },
        { status: 400 },
      );
    }

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 },
      );
    }

    const result = await verifyUser({ email, password });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.err?.message || "Invalid credentials" },
        { status: 401 },
      );
    }

    const user = result.data;

    const token = signJWT({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      phone: user.phone,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        name: user.full_name,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "none", //  required for cross-site
      secure: true,
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
