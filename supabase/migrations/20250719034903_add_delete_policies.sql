-- Add DELETE policies for embarcaciones, bins, and pesajes
-- With safety restrictions to prevent accidental deletions

-- DELETE policy for embarcaciones (only if no pesajes associated)
CREATE POLICY "Users can delete their client's embarcaciones" ON embarcaciones
    FOR DELETE USING (
        "clienteId" IN (
            SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
        )
        AND id NOT IN (
            SELECT DISTINCT "embarcacionId" FROM pesajes WHERE "embarcacionId" = embarcaciones.id
        )
    );

-- DELETE policy for bins (only if no pesajes associated)
CREATE POLICY "Users can delete their client's bins" ON bins
    FOR DELETE USING (
        "clienteId" IN (
            SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
        )
        AND id NOT IN (
            SELECT DISTINCT "binId" FROM pesajes WHERE "binId" = bins.id
        )
    );

-- DELETE policy for pesajes (only recent pesajes, not older than 24 hours)
CREATE POLICY "Users can delete their client's pesajes" ON pesajes
    FOR DELETE USING (
        "clienteId" IN (
            SELECT u."clienteId" FROM usuarios u WHERE u.id = auth.uid()::text
        )
        AND "createdAt" > NOW() - INTERVAL '24 hours'
        AND estado = 'pendiente'
    );

-- Note: These policies include safety restrictions:
-- 1. Embarcaciones/Bins: Cannot delete if they have associated pesajes
-- 2. Pesajes: Can only delete recent (24h) and pending pesajes
-- 3. All deletions are restricted to the user's client data only 