import { Suspense } from "react";
import LoginForm from "../components/LoginForm";
import { TextHoverEffect } from "../components/ui/text-hover-effect";

export default function Page() {
  return (
    <div className="max-w-full mx-auto h-screen grid grid-cols-1 w-full place-items-center pt-24">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <TextHoverEffect text="Bifrost" />
    </div>
  );
}