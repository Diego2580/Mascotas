UPDATE mascotas SET owner = dueño WHERE owner IS NULL;
ALTER TABLE mascotas DROP COLUMN dueño;
