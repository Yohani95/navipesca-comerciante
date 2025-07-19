-- Script para verificar TODAS las políticas existentes en Supabase
-- Ejecuta esto en el SQL Editor de Supabase

-- 1. Verificar todas las políticas existentes
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
WHERE schemaname = 'public'
ORDER BY tablename, cmd, policyname;

-- 2. Verificar específicamente las políticas de UPDATE
SELECT 
    tablename,
    policyname,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND cmd = 'UPDATE'
ORDER BY tablename, policyname;

-- 3. Verificar específicamente las políticas de SELECT
SELECT 
    tablename,
    policyname,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
AND cmd = 'SELECT'
ORDER BY tablename, policyname;

-- 4. Verificar específicamente las políticas de INSERT
SELECT 
    tablename,
    policyname,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
AND cmd = 'INSERT'
ORDER BY tablename, policyname;

-- 5. Verificar si RLS está habilitado en todas las tablas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename; 