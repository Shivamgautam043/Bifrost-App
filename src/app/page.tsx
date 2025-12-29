import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getPostgresDatabaseManager } from "../../submodules/submodule-database-manager-postgres/postgresDatabaseManager.server";
import { RainbowBackground } from "./components/BifrostEffect";
import Header from "./components/Header";
import { TextHoverEffect } from "./components/ui/text-hover-effect";

export async function getUsers() {
  const postgresManagerResult = await getPostgresDatabaseManager(null);
  if (!postgresManagerResult.success) return postgresManagerResult;

  const query = `
    SELECT * from users;
  `;

  const queryResult = await postgresManagerResult.data.execute(query);

  if (!queryResult.success) return queryResult;

  const rows = (queryResult.data.rows ?? []) as unknown[];

  return rows;
}

export default async function Home() {
  const users = await getUsers();
  console.log(users);
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <p>No token found. Please login.</p>;
  }

  let decoded: any = null;

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

