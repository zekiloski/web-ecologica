import { MailCheck } from "lucide-react";
import type { Metadata } from "next";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/auth";
import { Logo } from "@/components/site/Logo";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false } };
export const dynamic = "force-dynamic";

const ERRORES: Record<string, string> = {
  AccessDenied: "Ese email no tiene acceso al panel. Pedile a un administrador que te agregue.",
  Verification: "El link venció o ya se usó. Pedí uno nuevo.",
  Configuration: "El envío de emails no está configurado todavía.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ enviado?: string; error?: string }> }) {
  const [session, { enviado, error }] = await Promise.all([auth(), searchParams]);
  if (session?.user) redirect("/admin");

  async function ingresar(formData: FormData) {
    "use server";
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    try {
      await signIn("resend", { email, redirectTo: "/admin" });
    } catch (e) {
      // Email sin acceso: misma respuesta que un envío correcto, para no revelar qué emails tienen acceso.
      if (e instanceof AuthError && e.type === "AccessDenied") redirect("/login?enviado=1");
      throw e;
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="glass w-full max-w-sm rounded-3xl p-8">
        <Logo />
        {enviado ? (
          <div className="mt-8 text-center">
            <MailCheck className="mx-auto size-10 text-ahorro" />
            <h1 className="mt-4 text-2xl font-semibold">Revisá tu email</h1>
            <p className="mt-2 text-sm text-muted-foreground">Si el email tiene acceso al panel, te llega un link para ingresar. Vence en 24 horas.</p>
          </div>
        ) : (
          <form action={ingresar} className="mt-8">
            <h1 className="text-2xl font-semibold">Panel de administración</h1>
            <p className="mt-1 text-sm text-muted-foreground">Te enviamos un link de acceso a tu email.</p>
            {error && (
              <p role="alert" className="mt-4 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                {ERRORES[error] ?? "No pudimos iniciar sesión. Probá de nuevo."}
              </p>
            )}
            <label htmlFor="email" className="mt-6 mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="h-12 w-full rounded-xl border border-input bg-background/60 px-3.5 outline-none focus:border-primary focus:ring-3 focus:ring-primary/25"
            />
            <button type="submit" className="btn-sun mt-4 h-12 w-full rounded-xl">
              Enviarme el link
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
