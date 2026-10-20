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

Hostinger compila la app en su servidor y la arranca en modo `standalone`. El script `build` aplica las migraciones y carga los datos iniciales antes de compilar (`scripts/preparar-db.mjs`). Si no hay `DATABASE_URL`, ese paso se saltea.

### 1. Crear la app

1. En hPanel: **Websites → Add website → Node.js Apps → Import Git repository**.
2. Conectá GitHub y elegí el repositorio `zekiloski/web-ecologica`, rama `main`.
3. Dominio: elegí el **dominio temporal** para probar (después se conecta el definitivo).
4. Revisá la configuración que Hostinger completa sola:
   - Framework: **Next.js**
   - Node.js: **22**
   - Build command: **build**
   - Output directory: **.next**
5. Desplegá. Este primer build no tiene base todavía: la web compila, pero va a dar error hasta completar el paso 3.

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

Guardá y **redesplegá**. En el log del build tienen que aparecer `All migrations have been successfully applied` y `Seed completo.`

### 4. Cuando conectes el dominio definitivo

Actualizá `AUTH_URL` y `NEXT_PUBLIC_SITE_URL` con el dominio nuevo y redesplegá.

## Dónde se edita cada cosa

- **Tarifas, tasas, valor UVA, catálogo, precios, datos de la empresa:** panel `/admin`.
- **Proyectos y fotos:** `src/content/proyectos.ts` y `public/proyectos/<proyecto>/`.
- **Textos del home, Nosotros, preguntas frecuentes y contacto:** `src/content/sitio.ts`.
- **Fórmulas:** `src/lib/solar.ts` y `src/lib/credito.ts` (con tests en `tests/`).
