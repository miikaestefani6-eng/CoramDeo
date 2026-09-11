import { redirect } from "next/navigation";
import { ModuleShell } from "../components/ModuleShell";
import { createClient } from "@/lib/supabase/server";
import AccountClient from "./AccountClient";

export default async function ContaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/conta");

  const [{ data: profile }, { data: admin }] = await Promise.all([
    supabase.from("profiles").select("display_name,preferred_translation,biblical_familiarity,study_minutes").eq("user_id", user.id).maybeSingle(),
    supabase.from("coram_admins").select("role").eq("user_id", user.id).eq("active", true).maybeSingle(),
  ]);

  return (
    <ModuleShell title="Minha conta" description="Gerencie suas preferências, seus conteúdos salvos e a segurança do seu acesso.">
      <AccountClient
        email={user.email || ""}
        isAdmin={Boolean(admin)}
        initialProfile={{
          display_name: profile?.display_name || String(user.user_metadata?.full_name || ""),
          preferred_translation: profile?.preferred_translation || "NVI",
          biblical_familiarity: profile?.biblical_familiarity || "aprendendo",
          study_minutes: profile?.study_minutes || 10,
        }}
      />
    </ModuleShell>
  );
}
