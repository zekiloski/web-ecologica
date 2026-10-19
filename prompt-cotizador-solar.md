# Prompt: Cotizador solar paso a paso con simulador de crédito Bancor

> Pegalo completo en Claude Code. Los valores numéricos (tasas, precios, tarifa, irradiación) son de referencia: el sistema los toma de un panel de administración para que se actualicen sin tocar código.

---

## ROL Y OBJETIVO

Sos un desarrollador full-stack senior especializado en e-commerce y en energía solar fotovoltaica. Vas a construir una **web de venta e instalación de paneles solares** cuyo corazón es un **cotizador interactivo paso a paso** (wizard). El cliente entra, responde preguntas simples sobre su casa o empresa y al final ve:

1. Qué sistema necesita (kWp, cantidad de paneles, inversor, superficie de techo).
2. Cuánta energía va a generar y cuánto va a ahorrar por mes, por año y en 25 años.
3. Cuánto cuesta el sistema instalado.
4. **Cuánto le cuesta financiarlo con crédito Bancor**, en cuotas, comparado con lo que ahorra en la factura de luz.
5. Un botón para pedir el presupuesto formal / hablar por WhatsApp.

Referencia de negocio: empresas como Eco Lógica S.A.S (Oncativo, Córdoba), que hace proyectos solares on-grid para hogares, comercios e industrias (casos de 30 kW sobre piso y 300 kW en planta fabril). Su web actual es institucional (WordPress + Elementor) y **no tiene cotizador ni simulador de crédito**: ese es el diferencial que vamos a construir.

## STACK (web nueva desde cero, NO WordPress)

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS**.
- **shadcn/ui** para componentes (formularios, sliders, tabs, diálogos) y **Framer Motion** para animaciones y transiciones entre pasos del wizard.
- **Recharts** para gráficos (generación mensual, cuota vs. ahorro, ahorro acumulado).
- **React Hook Form + Zod** para el wizard y las validaciones.
- Lógica de cálculo en módulos puros y testeables (`/lib/solar.ts` y `/lib/credito.ts`), sin dependencias de UI.
- Base de datos: **PostgreSQL + Prisma** (leads, cotizaciones guardadas, parámetros).
- Autenticación del panel `/admin` con **Auth.js** (login por email).
- Emails con **Resend**; PDF del presupuesto con **@react-pdf/renderer**.
- Despliegue: **Railway** (app + PostgreSQL en el mismo proyecto) o Vercel + base en Railway/Supabase.
- Opcional: ruta `/embed/cotizador` para insertar el cotizador como iframe en webs de otros instaladores.
- Mobile-first: la mayoría de los clientes va a entrar desde el celular. Objetivo Lighthouse > 90 en rendimiento y accesibilidad.

## FLUJO DEL WIZARD (un paso por pantalla, barra de progreso arriba)

**Paso 1 – Tipo de cliente**
Hogar · Comercio · Industria / Pyme · Campo / Agro (bombeo, galpones, tambo).

**Paso 2 – Ubicación**
Provincia y localidad (por defecto Córdoba). Define la irradiación solar (HSP) y la distribuidora/tarifa (EPEC o cooperativa local).

**Paso 3 – Consumo eléctrico** (tres caminos, el usuario elige):
- **A. Tengo mi factura** (el más preciso): ingresa kWh del período y días del período, o el importe en $ y la categoría tarifaria. Opcional: subir foto de la factura (dejá preparado el hook para leerla con IA más adelante).
- **B. Sé cuánto pago**: ingresa el monto mensual en $ → se convierte a kWh con la tarifa vigente.
- **C. No sé, estimame**: metros cuadrados cubiertos, cantidad de personas/empleados, y checklist de equipos (aire acondicionado y cantidad, heladera, freezer, bomba de agua, termotanque eléctrico, horno eléctrico, pileta, maquinaria con potencia en kW y horas de uso). Para empresas: horario de trabajo y días por semana.

Mostrar en vivo: **consumo diario, mensual y anual en kWh**.

**Paso 4 – Techo / espacio disponible**
Tipo (chapa, losa, teja, suelo), metros cuadrados disponibles, orientación (Norte ideal, Este/Oeste, no sé) y si hay sombras. Si el espacio no alcanza para el sistema ideal, avisarlo y proponer el máximo posible.

**Paso 5 – Objetivo**
Cubrir 50 % · 75 % · 100 % del consumo · Lo máximo que entre. Opción de agregar **baterías** (respaldo ante cortes) con su costo extra.

**Paso 6 – Resultado del sistema**
Tarjetas grandes y claras:
- Potencia recomendada (kWp) y cantidad de paneles (con la potencia del panel configurada, ej. 580 Wp).
- Superficie de techo que ocupa.
- Generación estimada mensual (gráfico de barras por mes, con estacionalidad).
- % de cobertura de la factura.
- Ahorro mensual, anual y acumulado a 25 años.
- CO₂ evitado y equivalente en árboles.
- **Precio estimado del sistema instalado** (rango ±10 %).

**Paso 7 – Financiación Bancor**
- Monto a financiar (por defecto 100 % del presupuesto, editable con slider) y anticipo opcional.
- Selector de plazo: 12 · 24 · 36 · 48 · 60 · 72 meses.
- Selector de línea (configurable desde admin), por ejemplo:
  - **Personas** – préstamo personal ecosustentable en UVA, solo en comercios vinculados con Bancor.
  - **Empresas** – línea para pymes con tasa bonificada (requiere proveedor con convenio Bancor y adherido a CADIEC).
- Mostrar: cuota inicial, total a pagar, TNA, TEA y **CFT** (obligatorio mostrarlos juntos).
- **Gráfico comparativo clave:** cuota mensual vs. ahorro mensual en la factura. Mensaje del tipo: "Tu cuota es $X y ahorrás $Y por mes: el sistema se paga prácticamente solo".
- Leyenda legal: "Simulación orientativa. Las cuotas en UVA se ajustan por inflación. Sujeto a calificación crediticia y aprobación de Bancor. Las condiciones pueden variar."

**Paso 8 – Captura de lead y cierre**
Antes de descargar el PDF: nombre, teléfono, email, localidad. Luego:
- Descargar **presupuesto preliminar en PDF** con todo el detalle.
- Botón **WhatsApp** con mensaje pre-armado que incluya el resumen ("Hola, quiero un sistema de 6,4 kWp, 11 paneles, financiado en 48 cuotas…").
- Botón "Agendar visita técnica".
- Guardar la cotización en la BD y notificar por email al vendedor.

## FÓRMULAS (implementar en `/lib/solar.ts` con tests unitarios)

```
consumo_diario_kWh   = consumo_mensual_kWh / 30
HSP                  = horas solares pico de la localidad (Córdoba ≈ 5,0 promedio anual; tabla mensual editable)
PR                   = performance ratio (0,78–0,80; editable)
kWp_necesario        = (consumo_diario_kWh × %cobertura) / (HSP × PR)
cantidad_paneles     = ceil(kWp_necesario × 1000 / Wp_panel)
kWp_real             = cantidad_paneles × Wp_panel / 1000
superficie_m2        = cantidad_paneles × m2_por_panel (≈ 2,6 m² para 580 Wp)
generacion_mensual   = kWp_real × HSP_mes × días_mes × PR
ahorro_mensual_$     = min(generacion, consumo) × tarifa_$kWh  (+ excedente × precio_inyeccion si hay generación distribuida)
degradación          = 0,5 % anual en la proyección a 25 años
aumento_tarifa       = % anual configurable para la proyección de ahorro
precio_sistema       = kWp_real × precio_por_kWp(según escala) + instalación + adicionales (estructura de suelo, baterías)
```

Inversor: elegir la potencia comercial inmediata superior a kWp_real (lista editable). Si kWp > 10, sugerir trifásico.

## FÓRMULAS DE CRÉDITO (en `/lib/credito.ts`)

Sistema francés:
```
i     = TNA / 12
cuota = P × i / (1 − (1 + i)^−n)
```
- Mostrar tabla de amortización completa (capital, interés, IVA sobre intereses si corresponde, saldo).
- Para líneas en **UVA**: calcular la cuota en UVAs y convertir con el valor UVA del día (campo editable en admin; dejar preparado para traerlo del BCRA). Aclarar que la cuota en pesos sube con la inflación.
- Calcular el **período de repago**: mes en que el ahorro acumulado supera lo pagado.

## PANEL ADMIN (`/admin`)

Todo lo que cambia con el tiempo se edita acá, nunca hardcodeado:
- Líneas de crédito: nombre, destinatario (persona/empresa), TNA, TEA, CFT, plazos permitidos, monto máximo, si es UVA, vigencia desde/hasta, activa sí/no, texto legal.
- Valor UVA.
- Tarifas por distribuidora y categoría ($/kWh) y precio de inyección.
- HSP mensual por localidad.
- Catálogo: paneles (marca, Wp, m², precio), inversores, baterías, estructuras.
- Precio por kWp por escala (residencial / comercial / industrial) y margen.
- Datos de la empresa: logo, WhatsApp, email de notificaciones, colores.
- Listado de leads con su cotización, estado (nuevo, contactado, visita, vendido) y exportación a Excel.

## DISEÑO (moderno, novedoso, que no parezca una plantilla)

Dirección visual: **"tecnología solar premium"**, al nivel de una startup energética y no de una web institucional clásica.

- **Paleta:** fondo oscuro profundo (azul noche casi negro) con acentos en ámbar/amarillo solar degradado hacia naranja, y verde lima para el ahorro. Modo claro disponible.
- **Tipografía:** sans geométrica moderna (ej. *Space Grotesk* o *Sora* para títulos, *Inter* para texto). Títulos grandes y con mucho aire.
- **Hero:** titular fuerte ("Tu techo puede pagar tu factura de luz"), un sol/panel animado o ilustración 3D sutil con luz que se mueve, y debajo un **mini-cotizador de un solo campo** ("¿Cuánto pagás de luz por mes?") que muestra el ahorro estimado al instante y lleva al wizard completo.
- **Wizard:** tarjetas grandes seleccionables con íconos (no selects aburridos), transiciones suaves entre pasos, barra de progreso con forma de recorrido del sol, y un **panel lateral "tu sistema en vivo"** que se actualiza a medida que el cliente responde (kWp, paneles, ahorro).
- **Resultados:** números animados que cuentan hacia arriba, efecto *glassmorphism* sutil en las tarjetas, gráfico interactivo "cuota vs. ahorro" con el mes de repago resaltado, y una visualización del techo con los paneles dibujados en grilla según la cantidad calculada.
- **Microinteracciones:** botones con brillo al pasar, sliders con feedback inmediato, confeti suave al terminar la cotización.
- **Secciones del home:** hero con mini-cotizador · cómo funciona en 3 pasos · contador de impacto (kW instalados, toneladas de CO₂ evitadas) · casos de éxito en carrusel con fotos y kW · bloque destacado de financiación Bancor · preguntas frecuentes en acordeón · contacto con mapa y WhatsApp flotante.
- Botón "Atrás" siempre visible; el progreso se guarda en `localStorage` (si cierra y vuelve, sigue donde estaba).
- Respetar `prefers-reduced-motion` y buen contraste en ambos modos.
- **SEO local:** metadatos y datos estructurados (LocalBusiness) para "paneles solares Córdoba", "energía solar Oncativo", "crédito Bancor paneles solares".

## ENTREGABLES Y ORDEN DE TRABAJO

1. Módulos `/lib/solar.ts` y `/lib/credito.ts` con tests (Vitest) que verifiquen casos de ejemplo.
2. Esquema Prisma y seed con parámetros de ejemplo.
3. Wizard completo con datos del seed.
4. Panel admin.
5. PDF, WhatsApp, emails.
6. Versión embebible.
7. README con instrucciones para correr local y desplegar.

Antes de empezar, mostrame la estructura de carpetas y el esquema de base de datos para que lo apruebe. Trabajá por etapas y avisame al terminar cada una.
