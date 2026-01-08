import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import Header from "./components/Header";
import { TextHoverEffect } from "./components/ui/text-hover-effect";
import { RainbowBackground } from "./components/BifrostEffect";
import { getUser } from "@/lib/backend/users";
import { Uuid } from "../../submodules/submodule-database-manager-postgres/typeDefinitions";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: Uuid };
      const userResult = await getUser(decoded.id);

      if (userResult.success) {
        currentUser = {
          id: decoded.id,
          name: userResult.data.name,
          email: userResult.data.email,
        };
      }
    } catch (err) {
      console.error("Auth Error:", err);
    }
  }

  return (
    <div>
      <Header user={currentUser} />
      <div className="p-6 relative h-screen z-30">
        <RainbowBackground height={400} />
        <TextHoverEffect text="Bifrost" />
      </div>
    </div>
  );
}