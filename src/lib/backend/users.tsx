"use server";
import { getPostgresDatabaseManager } from "../../../submodules/submodule-database-manager-postgres/postgresDatabaseManager.server";
import { Uuid } from "../../../submodules/submodule-database-manager-postgres/typeDefinitions";
import { Result, okResult, errResult } from "../../../submodules/submodule-database-manager-postgres/utilities/errorHandling";
import bcrypt from "bcrypt";
import { generateUuid } from "../../../submodules/submodule-database-manager-postgres/utilities/utilities";


export async function getUser(id: Uuid): Promise<Result<{ name: string; email: string; phone: string }>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;
    const query = `
        SELECT full_name, email, phone 
        FROM users 
        WHERE id = $1 
        LIMIT 1;
    `;
    const result = await db.execute(query, [id]);

    if (!result.success) return result;
    const rows = Array.isArray(result.data) ? result.data : result.data?.rows;
    if (!rows || rows.length === 0) {
        return errResult(new Error("User not found"));
    }

    const userRow = rows[0];
    return okResult({
        name: userRow.full_name,
        email: userRow.email,
        phone: userRow.phone,
    });
}

export async function createUser({
    fullName,
    phone,
    email,
    password,
}: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
}): Promise<Result<{ id: Uuid }>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;
    const passwordHash = await bcrypt.hash(password, 10);
    const id = generateUuid() as Uuid;
    const insertQuery = `
    INSERT INTO users (id, full_name, email, phone, password_hash)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

    const insertResult = await db.execute(insertQuery, [
        id,
        fullName,
        email,
        phone,
        passwordHash,
    ]);

    if (!insertResult.success) return insertResult;

    return okResult({ id });
}

export async function verifyUser({
    email,
    password,
}: {
    email: string;
    password: string;
}): Promise<
    Result<{
        id: string;
        full_name: string;
        email: string;
        phone: string;
    }>
> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;

    const query = `
    SELECT id, full_name, email, phone, password_hash
    FROM users
    WHERE email = $1
  `;

    const userResult = await db.execute(query, [email]);
    if (!userResult.success) return userResult;

    const rows = userResult.data.rows as any[];

    if (rows.length === 0) {
        return errResult(new Error("User not found"));
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        return errResult(new Error("Invalid password"));
    }
    return okResult({
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
    });
}

export async function checkEmailAvailability(email: string): Promise<Result<boolean>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;

    const query = `SELECT 1 FROM users WHERE email = $1 LIMIT 1;`;

    const result = await db.execute(query, [email]);
    if (!result.success) {
        return result;
    };

    const rows = Array.isArray(result.data) ? result.data : result.data?.rows;

    if (rows && rows.length > 0) {
        return okResult(false);
    }
    return okResult(true);
}


export async function updateUserProfile(
    id: Uuid, 
    data: { fullName?: string; phone?: string }
): Promise<Result<boolean>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;
    const query = `
        UPDATE users 
        SET 
            full_name = COALESCE($2, full_name),
            phone = COALESCE($3, phone)
        WHERE id = $1;
    `;

    const result = await db.execute(query, [id, data.fullName, data.phone]);
    
    if (!result.success) return result;
    return okResult(true);
}

export async function updateUserPassword(
    id: Uuid, 
    newPassword: string
): Promise<Result<boolean>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;
    
    const passwordHash = await bcrypt.hash(newPassword, 10);

    const query = `
        UPDATE users 
        SET password_hash = $2
        WHERE id = $1;
    `;

    const result = await db.execute(query, [id, passwordHash]);

    if (!result.success) return result;
    return okResult(true);
}