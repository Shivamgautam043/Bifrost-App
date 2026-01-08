"use server";
import { getPostgresDatabaseManager } from "../../../submodules/submodule-database-manager-postgres/postgresDatabaseManager.server";
import { Uuid } from "../../../submodules/submodule-database-manager-postgres/typeDefinitions";
import { Result, okResult, errResult } from "../../../submodules/submodule-database-manager-postgres/utilities/errorHandling";
import { generateUuid } from "../../../submodules/submodule-database-manager-postgres/utilities/utilities";
import { sendSignUpOtpEmail } from "./brevoMails";

export async function createOtp({ name, email }: { name: string, email: string }): Promise<Result<{ id: Uuid; otpCode: string }>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;
    const db = postgresManagerResult.data;
    const id = generateUuid() as Uuid;

    const otpCode = Math.floor(1000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const insertQuery = `
        INSERT INTO otps (id, otp_code, expires_at, is_consumed, is_verified)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
    `;

    const insertResult = await db.execute(insertQuery, [
        id,
        otpCode,
        expiresAt,
        false,
        false
    ]);

    if (!insertResult.success) return insertResult;
    console.log("otp->" + otpCode);
    const emailResult = await sendSignUpOtpEmail({
        name: name,
        email: email,
        otp: otpCode
    });

    if (emailResult.success) {
        console.log("Email sent for Sign-Up")
    } else {
        console.log("Failed to send email. Please try again.");

    }
    return okResult({ id, otpCode });
}

export async function getOtp(id: Uuid): Promise<Result<{
    otpCode: string;
    expiresAt: Date;
    isConsumed: boolean;
    isVerified: boolean
}>> {
    const postgresManagerResult = await getPostgresDatabaseManager(null);
    if (!postgresManagerResult.success) return postgresManagerResult;

    const db = postgresManagerResult.data;

    const query = `
        SELECT otp_code, expires_at, is_consumed, is_verified
        FROM otps
        WHERE id = $1
        LIMIT 1;
    `;

    const result = await db.execute(query, [id]);

    if (!result.success) return result;

    const rows = Array.isArray(result.data) ? result.data : result.data?.rows;

    if (!rows || rows.length === 0) {
        return errResult(new Error("OTP not found"));
    }

    const row = rows[0];

    return okResult({
        otpCode: row.otp_code,
        expiresAt: new Date(row.expires_at),
        isConsumed: row.is_consumed,
        isVerified: row.is_verified,
    });
}