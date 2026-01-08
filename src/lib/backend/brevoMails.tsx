"use server";
import { Result, okResult, errResult } from "../../../submodules/submodule-database-manager-postgres/utilities/errorHandling";

export async function sendSignUpOtpEmail({
    name,
    email,
    otp,
}: {
    name: string;
    email: string;
    otp: string;
}): Promise<Result<boolean>> {
    
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
        console.error("BREVO_API_KEY is missing in environment variables");
        return errResult(new Error("Server configuration error"));
    }

    try {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": apiKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                to: [
                    {
                        email: email,
                        name: name,
                    },
                ],
                templateId: 2,
                params: {
                    OTP_CODE: otp,
                    NAME: name,
                },
            }),
        });

        const data = await response.json();
        if (response.ok && data.messageId) {
            return okResult(true);
        } else {
            console.error("Brevo API Error:", data);
            return errResult(new Error(data.message || "Failed to send email via Brevo"));
        }

    } catch (error) {
        console.error("Network Error sending email:", error);
        return errResult(error instanceof Error ? error : new Error("Unknown network error"));
    }
}