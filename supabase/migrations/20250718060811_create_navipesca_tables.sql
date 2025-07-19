-- Create NaviPesca tables
-- Based on Prisma schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clientes table
CREATE TABLE clientes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nombre TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefono TEXT,
    direccion TEXT,
    "fechaRegistro" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "fechaVencimiento" TIMESTAMP WITH TIME ZONE NOT NULL,
    "estadoSuscripcion" TEXT DEFAULT 'prueba',
    "tarifaPorKilo" DECIMAL(10,2) DEFAULT 1.00,
    activo BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create usuarios table
CREATE TABLE usuarios (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rol TEXT NOT NULL,
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "lastLogin" TIMESTAMP WITH TIME ZONE
);

-- Create embarcaciones table
CREATE TABLE embarcaciones (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    nombre TEXT NOT NULL,
    matricula TEXT UNIQUE NOT NULL,
    propietario TEXT NOT NULL,
    telefono TEXT,
    observaciones TEXT,
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    activa BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bins table
CREATE TABLE bins (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    codigo TEXT NOT NULL,
    tara DECIMAL(10,2) NOT NULL,
    capacidad DECIMAL(10,2),
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    activo BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(codigo, "clienteId")
);

-- Create pesajes table
CREATE TABLE pesajes (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "embarcacionId" TEXT NOT NULL REFERENCES embarcaciones(id) ON DELETE CASCADE,
    "binId" TEXT NOT NULL REFERENCES bins(id) ON DELETE CASCADE,
    "usuarioId" TEXT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    "pesoBruto" DECIMAL(10,2) NOT NULL,
    "pesoNeto" DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    observaciones TEXT,
    estado TEXT DEFAULT 'pendiente',
    sincronizado BOOLEAN DEFAULT false,
    "fechaSinc" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pagos table
CREATE TABLE pagos (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    monto DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    concepto TEXT NOT NULL,
    "metodoPago" TEXT,
    referencia TEXT,
    observaciones TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cobros_mensuales table
CREATE TABLE cobros_mensuales (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "clienteId" TEXT NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
    año INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    "totalKilos" DECIMAL(10,2) DEFAULT 0,
    "precioPorKilo" DECIMAL(10,2) NOT NULL,
    "montoTotal" DECIMAL(10,2) NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    "fechaGenerado" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "fechaVencimiento" TIMESTAMP WITH TIME ZONE NOT NULL,
    "fechaPago" TIMESTAMP WITH TIME ZONE,
    observaciones TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("clienteId", año, mes)
);

-- Create indexes
CREATE INDEX idx_usuarios_cliente_id ON usuarios("clienteId");
CREATE INDEX idx_embarcaciones_cliente_id ON embarcaciones("clienteId");
CREATE INDEX idx_embarcaciones_matricula ON embarcaciones(matricula);
CREATE INDEX idx_bins_cliente_id ON bins("clienteId");
CREATE INDEX idx_pesajes_cliente_id ON pesajes("clienteId");
CREATE INDEX idx_pesajes_embarcacion_id ON pesajes("embarcacionId");
CREATE INDEX idx_pesajes_fecha ON pesajes(fecha);
CREATE INDEX idx_pesajes_estado ON pesajes(estado);
CREATE INDEX idx_pagos_cliente_id ON pagos("clienteId");
CREATE INDEX idx_pagos_fecha ON pagos(fecha);
CREATE INDEX idx_cobros_mensuales_cliente_id ON cobros_mensuales("clienteId");
CREATE INDEX idx_cobros_mensuales_estado ON cobros_mensuales(estado);

-- Enable Row Level Security (RLS)
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE embarcaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE pesajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cobros_mensuales ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - customize as needed)
-- These policies allow users to see only their client's data
CREATE POLICY "Users can view their own client data" ON clientes
    FOR SELECT USING (id IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can view their own user data" ON usuarios
    FOR SELECT USING (id = auth.uid()::text);

CREATE POLICY "Users can view their client's embarcaciones" ON embarcaciones
    FOR SELECT USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can view their client's bins" ON bins
    FOR SELECT USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can view their client's pesajes" ON pesajes
    FOR SELECT USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can view their client's pagos" ON pagos
    FOR SELECT USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can view their client's cobros" ON cobros_mensuales
    FOR SELECT USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

-- Insert policies for data creation
CREATE POLICY "Users can insert their own user data" ON usuarios
    FOR INSERT WITH CHECK (id = auth.uid()::text);

CREATE POLICY "Users can insert their client's data" ON embarcaciones
    FOR INSERT WITH CHECK ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can insert their client's data" ON bins
    FOR INSERT WITH CHECK ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can insert their client's data" ON pesajes
    FOR INSERT WITH CHECK ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

-- Update policies for data modification
CREATE POLICY "Users can update their own user data" ON usuarios
    FOR UPDATE USING (id = auth.uid()::text);

CREATE POLICY "Users can update their client's data" ON embarcaciones
    FOR UPDATE USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can update their client's data" ON bins
    FOR UPDATE USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

CREATE POLICY "Users can update their client's data" ON pesajes
    FOR UPDATE USING ("clienteId" IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));
