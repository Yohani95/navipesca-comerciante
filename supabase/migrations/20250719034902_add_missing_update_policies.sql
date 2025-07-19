-- Add missing UPDATE policy for clientes only
-- All other tables already have their UPDATE policies defined in the initial migration

-- Add UPDATE policy for clientes (user can update their company data)
CREATE POLICY "Users can update their own client data" ON clientes
    FOR UPDATE USING (id IN (
        SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
    ));

-- Note: UPDATE policies for embarcaciones, bins, pesajes already exist
-- UPDATE policies for pagos, cobros_mensuales are intentionally NOT created
-- because these are system-managed data (billing and payments) 