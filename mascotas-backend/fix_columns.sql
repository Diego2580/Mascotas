-- Copiar datos de la columna dueño a owner (por si hay datos)
UPDATE mascotas SET owner = "dueño" WHERE owner IS NULL;

-- Eliminar la columna dueño antigua
ALTER TABLE mascotas DROP COLUMN "dueño";
