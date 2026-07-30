-- Índices de performance para consolidated_data_stores (tabla central del sistema).
--
-- Por qué: hoy la tabla tiene 0 índices (fuera de la PK). Cualquier filtro por
-- distributor/code_store_distributor/code_product_distributor/calculate_date/status
-- o el JOIN por matriculation_template_id hace un full table scan.
--
-- Seguridad: un índice NUNCA cambia el resultado de una query, solo la velocidad.
-- No altera funcionalidad. Se usa CONCURRENTLY para no bloquear lecturas/escrituras
-- mientras se construye (tablas grandes en producción).
--
-- CONCURRENTLY no puede correr dentro de una transacción: ejecutar cada
-- sentencia por separado (no envolver este archivo en BEGIN/COMMIT).
--
-- Ejecutar manualmente contra la base (psql, DBeaver, etc.). No lo corre la app.

-- Columnas usadas sueltas en WHERE/JOIN a lo largo de consolidated.data.stores.repository.ts
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_status
  ON "db-sellout".consolidated_data_stores (status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_calculate_date
  ON "db-sellout".consolidated_data_stores (calculate_date);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_matriculation_template_id
  ON "db-sellout".consolidated_data_stores (matriculation_template_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_key_store
  ON "db-sellout".consolidated_data_stores (key_store);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_key_producto
  ON "db-sellout".consolidated_data_stores (key_producto);

-- Pares que se filtran juntos en updateFieldsByDistributorAndCode /
-- updateFieldsByProductAndModel / findByDistributorStoreDuplicated, etc.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_distributor_store
  ON "db-sellout".consolidated_data_stores (distributor, code_store_distributor);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_distributor_product_desc
  ON "db-sellout".consolidated_data_stores (distributor, code_product_distributor, description_distributor);

-- Índice compuesto para el filtro "status = true AND calculate_date = X" que se repite
-- en syncMasterStores/syncMasterProducts, findMonthlyStoresFieldsWithOutDate, etc.
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_cds_status_calculate_date
  ON "db-sellout".consolidated_data_stores (status, calculate_date);

-- NOTA sobre EXTRACT(YEAR FROM ...)/TO_CHAR(...) en el código:
-- Estos índices NO aceleran queries que envuelven la columna en una función,
-- p.ej. "EXTRACT(YEAR FROM calculate_date) = :year". Postgres no puede usar un
-- índice normal ahí. Dos maneras de resolverlo (fuera del alcance de este script,
-- requieren decisión + verificación de que calculate_date siempre es el día 1 del mes):
--   a) Reescribir esas queries a "calculate_date = 'YYYY-MM-01'" (comparación directa,
--      sargable, usa idx_cds_calculate_date de arriba).
--   b) Crear un índice de expresión que calce exacto con la función usada, ej:
--      CREATE INDEX CONCURRENTLY idx_cds_calc_year_month
--        ON "db-sellout".consolidated_data_stores (EXTRACT(YEAR FROM calculate_date), EXTRACT(MONTH FROM calculate_date));
-- No lo incluyo por defecto porque cambiar la query (opción a) es una decisión de
-- código que hay que validar contra el comportamiento actual antes de aplicar.
