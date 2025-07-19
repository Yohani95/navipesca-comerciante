-- Corregir permisos del trigger para nuevos usuarios

-- Habilitar la extensión uuid-ossp si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Recrear la función con permisos adecuados
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    cliente_id TEXT;
    user_metadata JSONB;
BEGIN
    -- Obtener los metadatos del usuario
    user_metadata := NEW.raw_user_meta_data;
    
    -- Crear el cliente primero
    INSERT INTO public.clientes (
        id,
        nombre,
        email,
        telefono,
        direccion,
        "fechaRegistro",
        "fechaVencimiento",
        "estadoSuscripcion",
        "tarifaPorKilo",
        activo,
        "createdAt",
        "updatedAt"
    ) VALUES (
        gen_random_uuid()::text,
        COALESCE(user_metadata->>'nombreEmpresa', user_metadata->>'nombre', 'Cliente Nuevo'),
        NEW.email,
        user_metadata->>'telefono',
        user_metadata->>'direccion',
        NOW(),
        NOW() + INTERVAL '30 days', -- 30 días de prueba
        'prueba',
        1, -- 1 peso por kilo
        true,
        NOW(),
        NOW()
    ) RETURNING id INTO cliente_id;
    
    -- Crear el usuario en nuestra tabla usuarios
    INSERT INTO public.usuarios (
        id,
        email,
        nombre,
        apellido,
        rol,
        "clienteId",
        activo,
        "createdAt",
        "updatedAt"
    ) VALUES (
        NEW.id::text,
        NEW.email,
        COALESCE(user_metadata->>'nombre', 'Usuario'),
        COALESCE(user_metadata->>'apellido', 'Nuevo'),
        COALESCE(user_metadata->>'rol', 'comprador'),
        cliente_id,
        true,
        NOW(),
        NOW()
    );
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log del error (opcional)
        RAISE LOG 'Error en handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recrear el trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Otorgar permisos necesarios
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
