import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#080D13] px-5 text-sm text-[#D5B579]">Carregando Coram Deo…</main>}>
      <LoginClient />
    </Suspense>
  );
}
