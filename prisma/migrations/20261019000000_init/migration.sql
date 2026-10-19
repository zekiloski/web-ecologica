-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Segmento" AS ENUM ('HOGAR', 'COMERCIO', 'INDUSTRIA', 'AGRO');

-- CreateEnum
CREATE TYPE "TipoTecho" AS ENUM ('CHAPA', 'LOSA', 'TEJA', 'SUELO');

-- CreateEnum
CREATE TYPE "Destinatario" AS ENUM ('PERSONA', 'EMPRESA');

-- CreateEnum
CREATE TYPE "EstadoLead" AS ENUM ('NUEVO', 'CONTACTADO', 'VISITA', 'VENDIDO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "Origen" AS ENUM ('WEB', 'EMBED');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VENDEDOR');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("provider","providerAccountId")
);

-- CreateTable
CREATE TABLE "Session" (
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "empresaNombre" TEXT NOT NULL,
    "logoUrl" TEXT,
    "whatsapp" TEXT NOT NULL,
    "emailNotificaciones" TEXT NOT NULL,
    "colorPrimario" TEXT NOT NULL DEFAULT '#F5A524',
    "colorAcento" TEXT NOT NULL DEFAULT '#A3E635',
    "performanceRatio" DOUBLE PRECISION NOT NULL DEFAULT 0.79,
    "degradacionAnual" DOUBLE PRECISION NOT NULL DEFAULT 0.005,
    "aumentoTarifaAnual" DOUBLE PRECISION NOT NULL DEFAULT 0.25,
    "valorUVA" DECIMAL(12,2) NOT NULL,
    "valorUVAFecha" TIMESTAMP(3) NOT NULL,
    "factorCO2KgKwh" DOUBLE PRECISION NOT NULL DEFAULT 0.4,
    "kgCO2PorArbol" DOUBLE PRECISION NOT NULL DEFAULT 22,
    "margenPrecio" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Distribuidora" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "precioInyeccion" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "Distribuidora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tarifa" (
    "id" TEXT NOT NULL,
    "distribuidoraId" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "segmento" "Segmento" NOT NULL,
    "precioKwh" DECIMAL(12,2) NOT NULL,
    "cargoFijo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "vigenteDesde" TIMESTAMP(3) NOT NULL,
    "activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Tarifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localidad" (
    "id" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "hspMensual" DOUBLE PRECISION[],
    "distribuidoraId" TEXT NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Panel" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "wp" INTEGER NOT NULL,
    "m2" DOUBLE PRECISION NOT NULL,
    "precio" DECIMAL(14,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "predeterminado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Panel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inversor" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "kw" DOUBLE PRECISION NOT NULL,
    "fases" INTEGER NOT NULL,
    "hibrido" BOOLEAN NOT NULL DEFAULT false,
    "precio" DECIMAL(14,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Inversor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bateria" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "kwh" DOUBLE PRECISION NOT NULL,
    "precio" DECIMAL(14,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Bateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estructura" (
    "id" TEXT NOT NULL,
    "tipoTecho" "TipoTecho" NOT NULL,
    "precioPorPanel" DECIMAL(14,2) NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Estructura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscalaPrecio" (
    "id" TEXT NOT NULL,
    "segmento" "Segmento" NOT NULL,
    "kwpDesde" DOUBLE PRECISION NOT NULL,
    "kwpHasta" DOUBLE PRECISION NOT NULL,
    "precioPorKwp" DECIMAL(14,2) NOT NULL,
    "costoFijoInst" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "EscalaPrecio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LineaCredito" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "destinatario" "Destinatario" NOT NULL,
    "tna" DOUBLE PRECISION NOT NULL,
    "tea" DOUBLE PRECISION,
    "cft" DOUBLE PRECISION,
    "plazos" INTEGER[],
    "montoMaximo" DECIMAL(16,2) NOT NULL,
    "esUVA" BOOLEAN NOT NULL,
    "ivaSobreIntereses" BOOLEAN NOT NULL DEFAULT false,
    "vigenciaDesde" TIMESTAMP(3) NOT NULL,
    "vigenciaHasta" TIMESTAMP(3),
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "textoLegal" TEXT NOT NULL,
    "requisitos" TEXT,

    CONSTRAINT "LineaCredito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "estado" "EstadoLead" NOT NULL DEFAULT 'NUEVO',
    "notas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cotizacion" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "origen" "Origen" NOT NULL DEFAULT 'WEB',
    "tipoCliente" "Segmento" NOT NULL,
    "respuestas" JSONB NOT NULL,
    "resultado" JSONB NOT NULL,
    "parametros" JSONB NOT NULL,
    "kwp" DOUBLE PRECISION NOT NULL,
    "paneles" INTEGER NOT NULL,
    "precioTotal" DECIMAL(16,2) NOT NULL,
    "lineaCreditoId" TEXT,
    "plazoMeses" INTEGER,
    "cuotaInicial" DECIMAL(16,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Cotizacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Distribuidora_nombre_key" ON "Distribuidora"("nombre");

-- CreateIndex
CREATE INDEX "Tarifa_distribuidoraId_segmento_idx" ON "Tarifa"("distribuidoraId", "segmento");

-- CreateIndex
CREATE UNIQUE INDEX "Localidad_provincia_nombre_key" ON "Localidad"("provincia", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Estructura_tipoTecho_key" ON "Estructura"("tipoTecho");

-- CreateIndex
CREATE INDEX "EscalaPrecio_segmento_idx" ON "EscalaPrecio"("segmento");

-- CreateIndex
CREATE INDEX "Lead_estado_createdAt_idx" ON "Lead"("estado", "createdAt");

-- CreateIndex
CREATE INDEX "Cotizacion_createdAt_idx" ON "Cotizacion"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tarifa" ADD CONSTRAINT "Tarifa_distribuidoraId_fkey" FOREIGN KEY ("distribuidoraId") REFERENCES "Distribuidora"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localidad" ADD CONSTRAINT "Localidad_distribuidoraId_fkey" FOREIGN KEY ("distribuidoraId") REFERENCES "Distribuidora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cotizacion" ADD CONSTRAINT "Cotizacion_lineaCreditoId_fkey" FOREIGN KEY ("lineaCreditoId") REFERENCES "LineaCredito"("id") ON DELETE SET NULL ON UPDATE CASCADE;

