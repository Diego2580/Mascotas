-- Copiar datos de la columna dueno a owner (por si hay datos)
UPDATE mascotas SET owner = dueno WHERE owner IS NULL;

-- Eliminar la columna dueno antigua  
ALTER TABLE mascotas DROP COLUMN dueno;
