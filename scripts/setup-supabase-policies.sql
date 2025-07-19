-- Script para configurar políticas de seguridad en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Habilitar RLS en las tablas si no está habilitado
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para la tabla usuarios
-- Permitir que los usuarios lean y actualicen sus propios datos
CREATE POLICY "Usuarios pueden leer sus propios datos" ON usuarios
    FOR SELECT USING (
        auth.uid()::text = id OR 
        email = auth.jwt() ->> 'email'
    );

CREATE POLICY "Usuarios pueden actualizar sus propios datos" ON usuarios
    FOR UPDATE USING (
        auth.uid()::text = id OR 
        email = auth.jwt() ->> 'email'
    );

-- 3. Políticas para la tabla clientes
-- Permitir que los usuarios lean y actualicen datos de su empresa
CREATE POLICY "Usuarios pueden leer datos de su empresa" ON clientes
    FOR SELECT USING (
        id IN (
            SELECT clienteId 
            FROM usuarios 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

CREATE POLICY "Usuarios pueden actualizar datos de su empresa" ON clientes
    FOR UPDATE USING (
        id IN (
            SELECT clienteId 
            FROM usuarios 
            WHERE email = auth.jwt() ->> 'email'
        )
    );

-- 4. Política para insertar nuevos usuarios (si es necesario)
CREATE POLICY "Permitir inserción de usuarios" ON usuarios
    FOR INSERT WITH CHECK (true);

-- 5. Política para insertar nuevos clientes (si es necesario)
CREATE POLICY "Permitir inserción de clientes" ON clientes
    FOR INSERT WITH CHECK (true);

-- 6. Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename IN ('usuarios', 'clientes')
ORDER BY tablename, policyname; 