import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center bg-[#0F2131] px-5 py-10 text-white">Carregando…</main>}>
      <LoginClient />
    </Suspense>
  );
}
