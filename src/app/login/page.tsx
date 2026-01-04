import LoginForm from "../components/LoginForm";
import { TextHoverEffect } from "../components/ui/text-hover-effect";

export default function Page() {
  return (
    <div className="max-w-full mx-auto h-screen grid grid-cols-1 w-full place-items-center">
      <LoginForm/>
      <TextHoverEffect text="Bifrost" />
    </div>
  );
}
