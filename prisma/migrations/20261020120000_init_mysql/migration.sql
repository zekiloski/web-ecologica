-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'VENDEDOR') NOT NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    PRIMARY KEY (`provider`, `providerAccountId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    PRIMARY KEY (`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Configuracion` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `empresaNombre` VARCHAR(191) NOT NULL,
    `logoUrl` TEXT NULL,
    `whatsapp` VARCHAR(191) NOT NULL,
    `emailNotificaciones` VARCHAR(191) NOT NULL,
    `colorPrimario` VARCHAR(191) NOT NULL DEFAULT '#F5A524',
    `colorAcento` VARCHAR(191) NOT NULL DEFAULT '#A3E635',
    `performanceRatio` DOUBLE NOT NULL DEFAULT 0.79,
    `degradacionAnual` DOUBLE NOT NULL DEFAULT 0.005,
    `aumentoTarifaAnual` DOUBLE NOT NULL DEFAULT 0.03,
    `valorUVA` DECIMAL(12, 2) NOT NULL,
    `valorUVAFecha` DATETIME(3) NOT NULL,
    `factorCO2KgKwh` DOUBLE NOT NULL DEFAULT 0.4,
    `kgCO2PorArbol` DOUBLE NOT NULL DEFAULT 22,
    `margenPrecio` DOUBLE NOT NULL DEFAULT 0.1,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Distribuidora` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `precioInyeccion` DECIMAL(12, 2) NOT NULL,

    UNIQUE INDEX `Distribuidora_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tarifa` (
    `id` VARCHAR(191) NOT NULL,
    `distribuidoraId` VARCHAR(191) NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `segmento` ENUM('HOGAR', 'COMERCIO', 'INDUSTRIA', 'AGRO') NOT NULL,
    `precioKwh` DECIMAL(12, 2) NOT NULL,
    `cargoFijo` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `vigenteDesde` DATETIME(3) NOT NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,

    INDEX `Tarifa_distribuidoraId_segmento_idx`(`distribuidoraId`, `segmento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Localidad` (
    `id` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `hspMensual` JSON NOT NULL,
    `distribuidoraId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Localidad_provincia_nombre_key`(`provincia`, `nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Panel` (
    `id` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `wp` INTEGER NOT NULL,
    `m2` DOUBLE NOT NULL,
    `precio` DECIMAL(14, 2) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,
    `predeterminado` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inversor` (
    `id` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `kw` DOUBLE NOT NULL,
    `fases` INTEGER NOT NULL,
    `hibrido` BOOLEAN NOT NULL DEFAULT false,
    `precio` DECIMAL(14, 2) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bateria` (
    `id` VARCHAR(191) NOT NULL,
    `marca` VARCHAR(191) NOT NULL,
    `modelo` VARCHAR(191) NOT NULL,
    `kwh` DOUBLE NOT NULL,
    `precio` DECIMAL(14, 2) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Estructura` (
    `id` VARCHAR(191) NOT NULL,
    `tipoTecho` ENUM('CHAPA', 'LOSA', 'TEJA', 'SUELO') NOT NULL,
    `precioPorPanel` DECIMAL(14, 2) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Estructura_tipoTecho_key`(`tipoTecho`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EscalaPrecio` (
    `id` VARCHAR(191) NOT NULL,
    `segmento` ENUM('HOGAR', 'COMERCIO', 'INDUSTRIA', 'AGRO') NOT NULL,
    `kwpDesde` DOUBLE NOT NULL,
    `kwpHasta` DOUBLE NOT NULL,
    `precioPorKwp` DECIMAL(14, 2) NOT NULL,
    `costoFijoInst` DECIMAL(14, 2) NOT NULL DEFAULT 0,

    INDEX `EscalaPrecio_segmento_idx`(`segmento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LineaCredito` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `destinatario` ENUM('PERSONA', 'EMPRESA') NOT NULL,
    `tna` DOUBLE NOT NULL,
    `tea` DOUBLE NULL,
    `cft` DOUBLE NULL,
    `plazos` JSON NOT NULL,
    `montoMaximo` DECIMAL(16, 2) NOT NULL,
    `esUVA` BOOLEAN NOT NULL,
    `ivaSobreIntereses` BOOLEAN NOT NULL DEFAULT false,
    `vigenciaDesde` DATETIME(3) NOT NULL,
    `vigenciaHasta` DATETIME(3) NULL,
    `activa` BOOLEAN NOT NULL DEFAULT true,
    `textoLegal` TEXT NOT NULL,
    `requisitos` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `localidad` VARCHAR(191) NOT NULL,
    `estado` ENUM('NUEVO', 'CONTACTADO', 'VISITA', 'VENDIDO', 'PERDIDO') NOT NULL DEFAULT 'NUEVO',
    `notas` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Lead_estado_createdAt_idx`(`estado`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cotizacion` (
    `id` VARCHAR(191) NOT NULL,
    `leadId` VARCHAR(191) NULL,
    `origen` ENUM('WEB', 'EMBED') NOT NULL DEFAULT 'WEB',
    `tipoCliente` ENUM('HOGAR', 'COMERCIO', 'INDUSTRIA', 'AGRO') NOT NULL,
    `respuestas` JSON NOT NULL,
    `resultado` JSON NOT NULL,
    `parametros` JSON NOT NULL,
    `kwp` DOUBLE NOT NULL,
    `paneles` INTEGER NOT NULL,
    `precioTotal` DECIMAL(16, 2) NOT NULL,
    `lineaCreditoId` VARCHAR(191) NULL,
    `plazoMeses` INTEGER NULL,
    `cuotaInicial` DECIMAL(16, 2) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Cotizacion_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tarifa` ADD CONSTRAINT `Tarifa_distribuidoraId_fkey` FOREIGN KEY (`distribuidoraId`) REFERENCES `Distribuidora`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Localidad` ADD CONSTRAINT `Localidad_distribuidoraId_fkey` FOREIGN KEY (`distribuidoraId`) REFERENCES `Distribuidora`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cotizacion` ADD CONSTRAINT `Cotizacion_leadId_fkey` FOREIGN KEY (`leadId`) REFERENCES `Lead`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cotizacion` ADD CONSTRAINT `Cotizacion_lineaCreditoId_fkey` FOREIGN KEY (`lineaCreditoId`) REFERENCES `LineaCredito`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

