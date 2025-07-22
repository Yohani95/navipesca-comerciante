-- Agregar tablas para el flujo real de pesaje
-- Permite manejar múltiples embarcaciones en paralelo

-- Tabla para pesajes en proceso
CREATE TABLE pesajes_en_proceso (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "embarcacionId" TEXT NOT NULL REFERENCES embarcaciones(id) ON DELETE CASCADE,
    "embarcacionNombre" TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'tara', -- 'tara', 'pesaje', 'completado'
    "fechaInicio" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "fechaCierre" TIMESTAMP WITH TIME ZONE,
    "usuarioId" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    observaciones TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para bins de pesaje en proceso
CREATE TABLE bins_pesaje (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "pesajeId" TEXT NOT NULL REFERENCES pesajes_en_proceso(id) ON DELETE CASCADE,
    "binId" TEXT NOT NULL REFERENCES bins(id) ON DELETE CASCADE,
    codigo TEXT NOT NULL,
    tara DECIMAL(10,2) NOT NULL,
    "pesoBruto" DECIMAL(10,2),
    "pesoNeto" DECIMAL(10,2),
    estado TEXT NOT NULL DEFAULT 'pendiente', -- 'pendiente', 'tara_completada', 'pesaje_completado'
    observaciones TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX idx_pesajes_en_proceso_cliente_id ON pesajes_en_proceso("clienteId");
CREATE INDEX idx_pesajes_en_proceso_embarcacion_id ON pesajes_en_proceso("embarcacionId");
CREATE INDEX idx_pesajes_en_proceso_estado ON pesajes_en_proceso(estado);
CREATE INDEX idx_pesajes_en_proceso_fecha_inicio ON pesajes_en_proceso("fechaInicio");
CREATE INDEX idx_bins_pesaje_pesaje_id ON bins_pesaje("pesajeId");
CREATE INDEX idx_bins_pesaje_bin_id ON bins_pesaje("binId");
CREATE INDEX idx_bins_pesaje_estado ON bins_pesaje(estado);

-- Habilitar RLS
ALTER TABLE pesajes_en_proceso ENABLE ROW LEVEL SECURITY;
ALTER TABLE bins_pesaje ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pesajes_en_proceso
CREATE POLICY "Users can view their client's pesajes en proceso" ON pesajes_en_proceso
    FOR SELECT USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can insert their client's pesajes en proceso" ON pesajes_en_proceso
    FOR INSERT WITH CHECK ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can update their client's pesajes en proceso" ON pesajes_en_proceso
    FOR UPDATE USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

-- Políticas RLS para bins_pesaje
CREATE POLICY "Users can view their client's bins pesaje" ON bins_pesaje
    FOR SELECT USING ("pesajeId" IN (
        SELECT p.id FROM pesajes_en_proceso p 
        WHERE p."clienteId" IN (
            SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
        )
    ));

CREATE POLICY "Users can insert their client's bins pesaje" ON bins_pesaje
    FOR INSERT WITH CHECK ("pesajeId" IN (
        SELECT p.id FROM pesajes_en_proceso p 
        WHERE p."clienteId" IN (
            SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
        )
    ));

CREATE POLICY "Users can update their client's bins pesaje" ON bins_pesaje
    FOR UPDATE USING ("pesajeId" IN (
        SELECT p.id FROM pesajes_en_proceso p 
        WHERE p."clienteId" IN (
            SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
        )
    )); 