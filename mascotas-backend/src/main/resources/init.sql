-- Script de creación de la base de datos de mascotas
-- Base de datos PostgreSQL

-- Crear tabla de mascotas
CREATE TABLE IF NOT EXISTS mascotas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(50) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 0 AND edad <= 100),
    owner VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejoras de rendimiento
CREATE INDEX idx_mascotas_especie ON mascotas(especie);
CREATE INDEX idx_mascotas_owner ON mascotas(owner);
CREATE INDEX idx_mascotas_nombre ON mascotas(nombre);

-- Crear tabla de auditoría (opcional)
CREATE TABLE IF NOT EXISTS mascotas_auditoria (
    id BIGSERIAL PRIMARY KEY,
    mascota_id BIGINT NOT NULL,
    accion VARCHAR(50) NOT NULL,
    usuario VARCHAR(100),
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_anteriores TEXT,
    datos_nuevos TEXT
);

-- Insertar datos de prueba
INSERT INTO mascotas (nombre, especie, edad, owner) VALUES
('Max', 'Perro', 5, 'Juan'),
('Mishi', 'Gato', 3, 'María'),
('Rocky', 'Perro', 7, 'Pedro'),
('Luna', 'Gato', 2, 'Ana'),
('Toby', 'Perro', 4, 'Luis'),
('Fluffy', 'Conejo', 1, 'Carlos'),
('Tweety', 'Pajaro', 2, 'Isabel'),
('Nemo', 'Pez', 1, 'Roberto'),
('Bella', 'Perro', 6, 'Sofía'),
('Shadow', 'Gato', 8, 'Miguel');
