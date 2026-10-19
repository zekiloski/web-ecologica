import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type DefaultSession } from "next-auth";
import Resend from "next-auth/providers/resend";
import { redirect } from "next/navigation";
import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: Role } & DefaultSession["user"];
  }
  interface User {
    role?: Role;
  }
}

/** Emails con acceso de administrador aunque todavía no existan en la base (variable ADMIN_EMAILS, separados por coma). */
function emailsAdmin(): string[] {
  return (process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

const sinResend = !process.env.AUTH_RESEND_KEY;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  trustHost: true,
  providers: [
    Resend({
      from: process.env.EMAIL_FROM ?? "Eco Lógica <onboarding@resend.dev>",
      // Sin clave de Resend (desarrollo) el link de acceso se imprime en la consola del servidor.
      ...(sinResend && {
        apiKey: "sin-clave",
        async sendVerificationRequest({ identifier, url }) {
          if (process.env.NODE_ENV === "production") throw new Error("Falta configurar AUTH_RESEND_KEY");
          console.log(`\n[auth] Link de acceso para ${identifier}:\n${url}\n`);
        },
      }),
    }),
  ],
  pages: { signIn: "/login", verifyRequest: "/login?enviado=1", error: "/login" },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;
      if (emailsAdmin().includes(email)) return true;
      return !!(await prisma.user.findUnique({ where: { email }, select: { id: true } }));
    },
    async session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role ?? "VENDEDOR";
      return session;
    },
  },
});

/** Exige sesión (y opcionalmente rol ADMIN) en páginas y acciones del panel. */
export async function requerirSesion(rol?: Role) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (rol === "ADMIN" && session.user.role !== "ADMIN") redirect("/admin");
  return session;
}
