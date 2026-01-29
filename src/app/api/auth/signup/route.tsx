import { createUser } from "@/lib/backend/users";
import { corsHeaders } from "@/lib/cors";
import { signJWT } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";


export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}


export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin");
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
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "Full name is required" },
        { status: 400 },
      );
    }
    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 },
      );
    }
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }
    if (!password) {
      return NextResponse.json(
        { success: false, error: "Password is required" },
        { status: 400 },
      );
    }

    const result = await createUser({ fullName, phone, email, password });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.err?.message || "Failed to create user",
        },
        { status: 400 },
      );
    }

    const userId = result.data.id;

    const token = signJWT({
      id: userId,
      email: email,
      name: fullName,
      phone: phone,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        token: token,
        // user: { id: userId, email, fullName },
        user: {
          id: userId,
          name: fullName,
          email: email,
          phone: phone,
        },
      },
      {
        headers: corsHeaders(origin),
      },
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "none", //  required for cross-site
      secure: true,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
