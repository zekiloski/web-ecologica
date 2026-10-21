# Eco Lógica: cotizador solar con simulador de crédito Bancor

Web de Eco Lógica S.A.S (Oncativo, Córdoba): home, cotizador de 8 pasos, proyectos realizados y panel de administración.

Stack: Next.js 15 (App Router) + TypeScript + Tailwind 4, Prisma con MySQL, Auth.js (link por email vía Resend).

## Desarrollo local

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # tests de cálculo (Vitest)
```

Sin `DATABASE_URL`, `npm run dev` usa los datos de ejemplo de `src/lib/datos-ejemplo.ts`, así que el home y el cotizador funcionan sin base. El panel `/admin` y el guardado de leads necesitan una base MySQL; las variables están en `.env.example`.

## Publicar en Hostinger (plan Business o Cloud)

Hostinger compila la app en su servidor y la arranca en modo `standalone`. La base se prepara sola: el build intenta aplicar las migraciones y cargar los datos iniciales (`scripts/preparar-db.mjs`) y, si no llega a la base, no se corta. Al arrancar, la web hace lo mismo (`src/lib/migraciones.ts`) y, si la base todavía no existe, reintenta en la próxima visita.

### 1. Crear la app

1. En hPanel: **Websites → Add website → Node.js Apps → Import Git repository**.
2. Conectá GitHub y elegí el repositorio `zekiloski/web-ecologica`, rama `main`.
3. Dominio: elegí el **dominio temporal** para probar (después se conecta el definitivo).
4. Revisá la configuración que Hostinger completa sola:
   - Framework: **Next.js**
   - Node.js: **22**
   - Build command: **build**
   - Output directory: **.next**
5. Desplegá. Sin base todavía, la web compila pero muestra «No pudimos cargar la página» hasta completar el paso 3.

### 2. Crear la base MySQL

En el panel del sitio: **Databases → Management**. Creá una base con su usuario y contraseña y anotá los tres datos. El host es `localhost`.

### 3. Variables de entorno

En el panel del sitio: **Deployments → Settings and redeploy → Environment variables**.

| Variable | Valor |
|---|---|
| `DATABASE_URL` | `mysql://USUARIO:CONTRASEÑA@localhost:3306/BASE` |
| `AUTH_SECRET` | Texto aleatorio. Generalo con `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `AUTH_URL` | La dirección del sitio, ej. `https://xxxx.hostingersite.com` |
| `NEXT_PUBLIC_SITE_URL` | La misma dirección |
| `AUTH_RESEND_KEY` | Clave de Resend (`re_...`) |
| `EMAIL_FROM` | `Eco Lógica <onboarding@resend.dev>` (hasta verificar un dominio en Resend) |
| `ADMIN_EMAILS` | Email(s) con acceso al panel, separados por coma |

Si la contraseña tiene caracteres especiales (`@ : / # ? &`), hay que codificarlos en la URL: por ejemplo `@` se escribe `%40`.

Guardá y **redesplegá**. Las tablas se crean en el build (log: `All migrations have been successfully applied` y `Seed completo.`) o, si el build no llega a la base, al arrancar (Runtime Logs: `[db] Migración aplicada` y `[db] Datos iniciales cargados.`). Un aviso `[preparar-db] AVISO` en el build no es un error.

### 4. Cuando conectes el dominio definitivo

Actualizá `AUTH_URL` y `NEXT_PUBLIC_SITE_URL` con el dominio nuevo y redesplegá.

## Dónde se edita cada cosa

- **Tarifas, tasas, valor UVA, catálogo, precios, datos de la empresa:** panel `/admin`.
- **Proyectos y fotos:** `src/content/proyectos.ts` y `public/proyectos/<proyecto>/`.
- **Textos del home, Nosotros, preguntas frecuentes y contacto:** `src/content/sitio.ts`.
- **Fórmulas:** `src/lib/solar.ts` y `src/lib/credito.ts` (con tests en `tests/`).
