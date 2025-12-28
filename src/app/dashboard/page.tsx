import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export default async function Dashboard() {
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

    // decoded format: { id: "...", iat: ..., exp: ... }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="mt-4">
                <span className="font-semibold">User ID:</span> {decoded.id}
            </p>
        </div>
    );
}
