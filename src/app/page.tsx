import { getPostgresDatabaseManager } from "../../submodules/submodule-database-manager-postgres/postgresDatabaseManager.server";

export async function getUsers() {
  const postgresManagerResult = await getPostgresDatabaseManager(null);
  if (!postgresManagerResult.success) return postgresManagerResult;

  // Optimized Aggregation Query
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
  return (
    <div>
      Shivam
    </div>
  )
}