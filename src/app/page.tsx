import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Header from "./components/Header";
import { TextHoverEffect } from "./components/ui/text-hover-effect";
import { RainbowBackground } from "./components/BifrostEffect";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  // if (!token) {
  //   return <p>No token found. Please login.</p>;
  // }
  let decoded: any = null;
  if(token)
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    console.error(err);
    return <p>Invalid or expired token.</p>;
  }

  return (
    <div>
      <Header user={token ? { id: decoded.id, name: decoded.fullName, email: decoded.email } : null} />
      <div className="p-6 relative h-screen z-30">
        {/* <p className="mt-4">
          <span className="font-semibold z-30">User ID:</span> {decoded.id}
        </p> */}
        {/* <RainbowBackground /> */}
        <TextHoverEffect text="Bifrost" />
      </div>
    </div>
  )
}

