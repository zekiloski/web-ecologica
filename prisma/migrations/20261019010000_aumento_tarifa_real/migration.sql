-- La proyección pasa a pesos de hoy: aumentoTarifaAnual es el aumento real (por encima de la inflación).
ALTER TABLE "Configuracion" ALTER COLUMN "aumentoTarifaAnual" SET DEFAULT 0.03;
UPDATE "Configuracion" SET "aumentoTarifaAnual" = 0.03 WHERE "aumentoTarifaAnual" = 0.25;
