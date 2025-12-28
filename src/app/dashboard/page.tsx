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
        <div className="p-6 relative h-screen">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <p className="mt-4">
                <span className="font-semibold">User ID:</span> {decoded.id}
            </p>
            <RainbowBackground />
        </div>
    );
}

export function RainbowBackground() {

    return (
        <>
            
            <div
                className="absolute inset-0 to-0 z-50"
                style={{
                    maskImage: "radial-gradient(at 50% 18%, black 27%, transparent 70%)",
                }}
            >
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="pointer-events-none absolute -inset-2.5 overflow-hidden text-white blur-2xl invert transition-opacity duration-500 dark:text-black dark:opacity-70 dark:invert-0"
                        style={{
                            transform: "translate3d(0px, 0px, 0px)",
                            "--background-color": "var(--ds-background-200)",
                            "--duration": "23s",
                            "--gaps":
                                "repeating-linear-gradient(110deg, var(--background-color) 0%, var(--background-color) 8%, transparent 10%, transparent 12%, var(--background-color) 19%)",
                            "--lights":
                                "repeating-linear-gradient(110deg, var(--ds-teal-500) 10%, var(--ds-blue-700) 15%, var(--ds-purple-700) 20%, var(--ds-pink-700) 25%, var(--ds-amber-700) 30%)",
                            backgroundImage: "var(--gaps), var(--lights)",
                            backgroundSize: "110%, 100%",
                            backgroundPosition: "50% 50%, 50% 50%",
                        } as React.CSSProperties}
                    >
                        <div
                            className="absolute h-full w-[300%] mix-blend-difference motion-safe:animate-northern-lights"
                            style={{
                                backgroundImage: "var(--gaps), var(--lights)",
                                backgroundPosition: "50% 50%",
                                backgroundSize: "100%, 100%",
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </>
    );
}
