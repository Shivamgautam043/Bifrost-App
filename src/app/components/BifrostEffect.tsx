type RainbowBackgroundProps = {
  height?: string | number; // e.g. "300px", "60vh", 400
};

export function RainbowBackground({ height = "100%" }: RainbowBackgroundProps) {
  return (
    <div
      className="absolute left-0 right-0 top-0 z-10"
      style={{
        height: typeof height === "number" ? `${height}px` : height,
        maskImage:
          "radial-gradient(at 50% 18%, black 27%, transparent 70%)",
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
          />
        </div>
      </div>
    </div>
  );
}
