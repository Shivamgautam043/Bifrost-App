import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  res.cookies.set("token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0), // delete immediately
  });

  return res;
}
