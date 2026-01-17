import { getUser } from "@/lib/backend/users";
import { Uuid } from "../../../submodules/submodule-database-manager-postgres/typeDefinitions";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import SettingsForm from "../components/SettingForm";
import { cookies } from "next/headers";

export default async function SettingsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  let currentUser = null;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: Uuid;
      };
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

  if (currentUser === null) {
    redirect("/login");
  }

  const userResult = await getUser(currentUser.id as Uuid);

  if (!userResult.success) {
    redirect("/?mode=login");
  }

  const userData = {
    id: currentUser.id as Uuid,
    ...userResult.data,
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-black py-12">
      <SettingsForm user={userData} />
    </div>
  );
}
