-- Script para verificar políticas de seguridad en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Verificar si RLS está habilitado en las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('usuarios', 'clientes')
ORDER BY tablename;

-- 2. Verificar políticas existentes para la tabla usuarios
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'usuarios'
ORDER BY policyname;

-- 3. Verificar políticas existentes para la tabla clientes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'clientes'
ORDER BY policyname;

-- 4. Verificar permisos del usuario autenticado
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_name IN ('usuarios', 'clientes')
AND grantee = 'authenticated'
ORDER BY table_name, privilege_type;

-- 5. Verificar estructura de las tablas
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios'
ORDER BY ordinal_position;

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'clientes'
ORDER BY ordinal_position; 