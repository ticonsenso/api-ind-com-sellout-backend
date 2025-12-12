-- Crear la base de datos si no existe
--CREATE DATABASE IF NOT EXISTS consenso_db;

-- Enums y tipos personalizados
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'source_type') THEN
        CREATE TYPE source_type AS ENUM ('API', 'DATABASE', 'FILE', 'KAFKA', 'SFTP', 'S3', 'FTP', 'REST', 'SOAP', 'GRAPHQL', 'WEBSOCKET','EXCEL');
    END IF;
     IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
        CREATE TYPE status_type AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'extract_mode') THEN
        CREATE TYPE extract_mode AS ENUM ('FULL', 'INCREMENTAL');
    END IF;
END $$;

-- Tabla en donde se guardan los usuarios del sistema - esto funcion como enlace con el AD
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    dni VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    company_id INT,
    CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

--Tabla en donde se guardan los roles que van a tener los usuarios
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO roles ("name", status, created_at, updated_at) VALUES('ADMINISTRADOR', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

--Tabla en donde se guardan los roles que van a tiene los usuarios
CREATE TABLE IF NOT EXISTS users_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);
--Tabla en donde se guardan los permisos que van a tener los roles
CREATE TABLE IF NOT EXISTS permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    description TEXT NULL,
    short_description VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE permissions
--     ADD COLUMN description TEXT NULL,
--     ADD COLUMN short_description VARCHAR(255) NULL;

INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(1, 'GESTION USUARIOS', true, '2025-04-18 10:18:27.096', '2025-04-18 10:18:27.096');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(3, 'INICIO', true, '2025-04-18 15:19:29.273', '2025-04-18 15:19:29.273');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(4, 'CALCULO COMISIONES', true, '2025-04-18 15:19:39.699', '2025-04-18 15:19:39.699');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(5, 'ESTADISTICAS', true, '2025-04-18 15:19:50.035', '2025-04-18 15:19:50.035');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(6, 'REPORTES', true, '2025-04-18 15:19:58.210', '2025-04-18 15:19:58.210');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(7, 'POLITICAS Y PARAMETROS', true, '2025-04-18 15:20:05.496', '2025-04-18 15:20:05.496');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(8, 'CONFIGURACION COMISIONES', true, '2025-04-18 15:20:18.461', '2025-04-18 15:20:18.461');
INSERT INTO permissions (id, "name", status, created_at, updated_at) VALUES(9, 'EMPRESAS', true, '2025-04-18 15:20:26.563', '2025-04-18 15:20:26.563');

--Tabla en donde se guardan los permisos que van a tienen los roles
CREATE TABLE IF NOT EXISTS roles_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    permission_id INTEGER NOT NULL REFERENCES permissions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(1, 1, 1, '2025-04-18 10:18:27.096', '2025-04-18 10:18:27.096');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(2, 1, 3, '2025-04-18 15:19:29.273', '2025-04-18 15:19:29.273');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(3, 1, 4, '2025-04-18 15:19:39.699', '2025-04-18 15:19:39.699');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(4, 1, 5, '2025-04-18 15:19:50.035', '2025-04-18 15:19:50.035');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(5, 1, 6, '2025-04-18 15:19:58.210', '2025-04-18 15:19:58.210');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(6, 1, 7, '2025-04-18 15:20:05.496', '2025-04-18 15:20:05.496');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(7, 1, 8, '2025-04-18 15:20:18.461', '2025-04-18 15:20:18.461');
INSERT INTO roles_permissions (id, role_id, permission_id, created_at, updated_at) VALUES(8, 1, 9, '2025-04-18 15:20:26.563', '2025-04-18 15:20:26.563');

--Inicios de session
CREATE TABLE init_session_logs (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    session_index VARCHAR(255) NOT NULL,
    in_response_to VARCHAR(255) NOT NULL,
    logout_time TIMESTAMP,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por email
CREATE INDEX idx_init_session_logs_email ON init_session_logs(email);
-- Índice para búsquedas por session_id
CREATE INDEX idx_init_session_logs_session ON init_session_logs(session_id);

--Spring 2 - Comisiones

-- Tabla: empresa
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: empleado
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    document_number VARCHAR(255) NOT NULL, -- Numero de documento del empleado cedula, pasaporte, etc.
    email VARCHAR(255) NULL,
    phone VARCHAR(255) NULL,
    city VARCHAR(255) NULL,
    date_initial_contract DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Estado activo/inactivo del empleado
    supervisor_id INT REFERENCES employees(id) NULL, -- Supervisor del empleado
    salary NUMERIC(12,2) NOT NULL, -- Salario del empleado
    variable_salary NUMERIC(12,2) NOT NULL, -- Salario variable del empleado
    section VARCHAR(255) NULL, -- desc_seccion - TIENDA/Indurama - desc_seccion - Indurama
    ceco VARCHAR(255) NULL, -- Seco del empleado -ccosto_conta
    desc_uni_nego VARCHAR(255) NULL, -- Unidad de Negocio
    desc_division VARCHAR(255) NULL, -- Área
    desc_depar VARCHAR(255) NULL, -- Departamento
    sub_depar VARCHAR(255) NULL, -- Subdepartamento
    month INTEGER NULL, -- Mes de la configuracion 1-12
    year INTEGER NULL, -- Año de la configuracion
    employee_type VARCHAR(255) NULL, -- Tipo de empleado (FIJOS, TEMPORALES, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- ultima fecha de sincronizacion
);

--ALTER TABLE "db-sellout".employees ADD ceco varchar(255) NULL;
--ALTER TABLE "db-sellout".employees ADD "section" varchar(255) NULL;
-- ALTER TABLE "db-sellout".employees DROP CONSTRAINT employees_code_key;
-- ALTER TABLE "db-sellout".employees ADD month INTEGER NULL;
-- ALTER TABLE "db-sellout".employees ADD year INTEGER NULL;
-- ALTER TABLE "db-sellout".employees ADD employee_type VARCHAR(12) NULL; // Cambio para tipo de empleado

-- Tabla: empleados historico
CREATE TABLE IF NOT EXISTS employees_history (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    code VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    document_number VARCHAR(255) NOT NULL, -- Numero de documento del empleado cedula, pasaporte, etc.
    email VARCHAR(255) NULL,
    phone VARCHAR(255) NULL,
    city VARCHAR(255) NOT NULL,
    date_initial_contract DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE, -- Estado activo/inactivo del empleado
    supervisor_id INT REFERENCES employees(id) NULL, -- Supervisor del empleado
    salary NUMERIC(12,2) NOT NULL, -- Salario del empleado
    variable_salary NUMERIC(12,2) NOT NULL, -- Salario variable del empleado
    regional VARCHAR(255) NULL, -- Regional del empleado
    company_position_history JSONB, -- Historial de posiciones de la empresa
    consolidated_commission_calculation_id INT REFERENCES consolidated_commission_calculation(id) ON DELETE CASCADE NULL -- Calculo consolidado de comisiones
);

-- ALTER TABLE employees_history
-- DROP CONSTRAINT employees_history_code_key;

-- ALTER TABLE employees_history
-- ADD COLUMN company_position_history JSONB;


DROP TABLE IF EXISTS commission_versions;
-- Tabla: configuracion_comision
DROP TABLE IF EXISTS commission_configurations;
CREATE TABLE IF NOT EXISTS commission_configurations (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    version VARCHAR(255) NOT NULL,
    note_version TEXT,
    is_rule_commission BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS commission_configurations_history (
    id SERIAL PRIMARY KEY,
    commission_configurations_id INT REFERENCES commission_configurations(id) ON DELETE CASCADE,
    consolidated_commission_calculation_id INT REFERENCES consolidated_commission_calculation(id) ON DELETE CASCADE NULL, 
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    version VARCHAR(255) NOT NULL,
    note_version TEXT,
    is_rule_commission BOOLEAN DEFAULT FALSE,
    kpi_config JSONB,
    commission_parameters JSONB,
    product_lines JSONB,
    commission_rules JSONB,
    sales_rotation_configurations JSONB,
    variable_scales JSONB
);


-- Tabla: categoria_parametro (para agrupar reglas por tipo, ejemplo: bonificaciones, metas, rangos,categorias productos,productos estrategicos)
DROP TABLE IF EXISTS parameter_categories;
CREATE TABLE IF NOT EXISTS parameter_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla: parametros de comisiones
DROP TABLE IF EXISTS commission_parameters;
CREATE TABLE IF NOT EXISTS commission_parameters (
    id SERIAL PRIMARY KEY,
    commission_configurations_id INT REFERENCES commission_configurations(id) ON DELETE CASCADE,
    category_id INT REFERENCES parameter_categories(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL,
    description TEXT,
    status BOOLEAN DEFAULT TRUE,
    months_condition INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE commission_parameters
-- ADD COLUMN months_condition INTEGER NULL;

-- Tabla: lineas paramatro - ejemplo - linea blanca
CREATE TABLE IF NOT EXISTS parameter_lines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL, 
    description TEXT,
    group_product_line TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: linea_producto (parametrización de líneas aplicables a cada versión)
DROP TABLE IF EXISTS product_lines;
CREATE TABLE IF NOT EXISTS product_lines (
    id SERIAL PRIMARY KEY,
    commission_configurations_id INT REFERENCES commission_configurations(id) ON DELETE CASCADE,
    parameter_line_id INT REFERENCES parameter_lines(id) ON DELETE CASCADE,
    commission_weight NUMERIC(9,2) NOT NULL,
    goal_rotation NUMERIC(9,2) NOT NULL,
    min_sale_value NUMERIC(12,2), -- Valor mínimo de venta para aplicar comisión
    max_sale_value NUMERIC(12,2), -- Valor máximo de venta para aplicar comisión
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: regla_rango (para definir tramos de cumplimiento y % comisiones)
DROP TABLE IF EXISTS commission_rules;
CREATE TABLE IF NOT EXISTS commission_rules (
    id SERIAL PRIMARY KEY,
    commission_configurations_id INT REFERENCES commission_configurations(id) ON DELETE CASCADE,
    parameter_lines_id INT REFERENCES parameter_lines(id) ON DELETE CASCADE NULL,    
    min_complace NUMERIC(9,2) NOT NULL,
    max_complace NUMERIC(9,2) NOT NULL,
    commission_percentage NUMERIC(9,2) NOT NULL,
    bone_extra NUMERIC(9,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

---Editar esta tabla 
--ALTER TABLE commission_rules
--ADD COLUMN parameter_lines_id INT REFERENCES parameter_lines(id) ON DELETE CASCADE NULL,
--ADD COLUMN store_size_id INT REFERENCES store_size(id) ON DELETE CASCADE NULL;

-- Tabla: metas_mensuales (para definir metas por empleado/línea/mes)
CREATE TABLE IF NOT EXISTS monthly_goals (
    id SERIAL PRIMARY KEY,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    product_line_id INT REFERENCES product_lines(id) ON DELETE CASCADE,
    month_start DATE NOT NULL,
    month_end DATE NULL,
    goal_value NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Definicion de temporadas
CREATE TABLE IF NOT EXISTS seasons (
    id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_high_season BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sales_rotation_configurations (
    id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    month_name VARCHAR(50) NOT NULL,
    goal NUMERIC(10,2) NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    description TEXT,
    is_high_season BOOLEAN NOT NULL DEFAULT false,
    commission_configurations_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_configuration
    FOREIGN KEY (commission_configurations_id)
    REFERENCES commission_configurations(id)
    ON DELETE CASCADE
);

-- Insert default seasons configuration
INSERT INTO seasons (month, name, description, is_high_season) VALUES
(1, 'Enero', 'Temporada Baja', false),
(2, 'Febrero', 'Temporada Baja', false), 
(3, 'Marzo', 'Temporada Alta', true),
(4, 'Abril', 'Temporada Baja', false),
(5, 'Mayo', 'Temporada Alta', true),
(6, 'Junio', 'Temporada Baja', false),
(7, 'Julio', 'Temporada Baja', false),
(8, 'Agosto', 'Temporada Baja', false),
(9, 'Septiembre', 'Temporada Baja', false),
(10, 'Octubre', 'Temporada Baja', false),
(11, 'Noviembre', 'Temporada Alta', true),
(12, 'Diciembre', 'Temporada Alta', true);

-- Tabla para almacenar los KPIs, pesos y metas del Producto Estratégico
DROP TABLE IF EXISTS kpi_config;
CREATE TABLE IF NOT EXISTS kpi_config (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    commission_configurations_id INT REFERENCES commission_configurations(id) ON DELETE CASCADE,
    kpi_name VARCHAR(50) NOT NULL,
    weight INT NOT NULL, -- Peso del KPI (suma debe ser 100)
    meta DECIMAL(10, 2), -- Meta base (para Rotación de Venta se usará meta_tb o meta_ta)
    meta_tb DECIMAL(10, 2), -- Meta en temporada baja (T.B.), solo para Rotación de Venta
    meta_ta DECIMAL(10, 2)  -- Meta en temporada alta (T.A.), solo para Rotación de Venta
);

-- Tabla para las escalas de pago del variable
DROP TABLE IF EXISTS variable_scales;
CREATE TABLE IF NOT EXISTS variable_scales (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    commission_configurations_id INT REFERENCES commission_configurations(id) ON DELETE CASCADE,
    min_score DECIMAL(9, 2) NOT NULL, -- Calificación mínima (inclusive)
    max_score DECIMAL(9, 2) NOT NULL, -- Calificación máxima (inclusive)
    variable_amount DECIMAL(12, 2) NOT NULL -- Monto del variable en dólares
);

-- Tabla: resultado_mensual
CREATE TABLE IF NOT EXISTS monthly_results (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    month DATE NOT NULL,
    product_line_id INT REFERENCES product_lines(id) ON DELETE CASCADE,
    sale_value NUMERIC(12,2) NOT NULL,
    compliance NUMERIC(9,2),
    productivity NUMERIC(9,2),
    bonus_applies BOOLEAN DEFAULT FALSE,
    commission_amount NUMERIC(12,2), -- Monto calculado de comisión
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: periodos_liquidacion
CREATE TABLE IF NOT EXISTS settlement_periods (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN', -- OPEN, PROCESSING, CLOSED
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: liquidaciones de comisiones
CREATE TABLE IF NOT EXISTS commission_settlements (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    period_id INT REFERENCES settlement_periods(id) ON DELETE CASCADE,
    total_commission NUMERIC(12,2) NOT NULL,
    total_bonus NUMERIC(12,2) DEFAULT 0,
    total_deductions NUMERIC(12,2) DEFAULT 0,
    final_amount NUMERIC(12,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING', -- PENDING, APPROVED, PAID
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: metrica de producto estratégico
CREATE TABLE IF NOT EXISTS strategic_product_metrics (
    id SERIAL PRIMARY KEY,
    monthly_result_id INT REFERENCES monthly_results(id),
    kpi_name VARCHAR(255) NOT NULL, -- p. ej., "Utilidad Bruta"
    weight NUMERIC(9,2) NOT NULL,
    goal_value NUMERIC(12,2),
    actual_value NUMERIC(12,2),
    compliance NUMERIC(9,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: registro de horas extras
CREATE TABLE IF NOT EXISTS overtime_records (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id),
    month DATE NOT NULL,
    hours NUMERIC(9,2) NOT NULL,
    rate NUMERIC(12,2) NOT NULL,
    approved_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Tabla data_sources (Fuente de Datos) - Sin cambios significativos en estructura
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    source_type VARCHAR(50) NOT NULL, -- API, Database, File, etc.
    connection_info JSONB NULL, -- Guarda credenciales y URL en JSON (considerar encriptación a nivel de aplicación)
    config_params JSONB, -- Configuración específica según el tipo de fuente
    auto_extract BOOLEAN DEFAULT FALSE, -- Indica si se extrae automáticamente (programado)
    extraction_frequency VARCHAR(50), -- Diario, semanal, mensual, etc. (para extracciones automáticas)
    last_extraction_date TIMESTAMP, -- Fecha de la última extracción exitosa o intentada
    next_scheduled_extraction TIMESTAMP, -- Próxima fecha programada para extracción
    extraction_status VARCHAR(50) DEFAULT 'PENDING', -- Estado de la última extracción (resumen rápido)
    is_active BOOLEAN DEFAULT TRUE, -- Indica si la fuente está activa para extracción
    company_id INT REFERENCES companies(id) ON DELETE CASCADE, -- Para multi-empresa
    sheet_name VARCHAR(255), -- Nombre de la hoja en el Excel (para fuentes tipo Excel)
    day_extraction INTEGER NULL, -- Día del mes: 1, 2, 3, ..., o NULL si no aplica
    hour_extraction TIME(0) NULL, -- Hora tipo 10:40, o NULL si no aplica
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Auditoría
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_source_extraction_status CHECK (extraction_status IN ('PENDING', 'SUCCESS', 'FAILED', 'IN_PROGRESS', 'SCHEDULED')) -- Agregado 'SCHEDULED' para claridad
);

-- ALTER TABLE data_sources
-- ADD COLUMN day_extraction INTEGER NULL,     -- Día del mes: 1, 2, 3, ..., o NULL si no aplica
-- ADD COLUMN hour_extraction TIME(0) NULL;    -- Hora tipo 10:40, o NULL si no aplica

-- Tabla para configuración de columnas de Excel/CSV u otros formatos estructurados - Sin cambios
CREATE TABLE IF NOT EXISTS data_source_column_configs (
    id SERIAL PRIMARY KEY,
    data_source_id INT REFERENCES data_sources(id) ON DELETE CASCADE, -- Enlace a la fuente
    column_name VARCHAR(255), -- Nombre del encabezado en el archivo/fuente (puede ser null si se usa index/letter)
    column_index INT, -- Índice de la columna (basado en 0 o 1, definir convención)
    column_letter VARCHAR(10), -- Letra de la columna (para Excel, ej: 'A', 'AZ')
    data_type VARCHAR(50) NOT NULL, -- Tipo de dato esperado (INTEGER, DECIMAL, TEXT, DATE, DATETIME, BOOLEAN, EMAIL, PHONE, etc.)
    format_pattern VARCHAR(100), -- Patrón de formato (ej: 'dd/MM/yyyy' para fechas, '###.##' para números)
    is_required BOOLEAN DEFAULT FALSE, -- Indica si el campo es obligatorio
    default_value TEXT, -- Valor a usar si el campo está vacío y no es requerido
    mapping_to_field VARCHAR(255), -- Campo al que se mapea en el sistema de destino (ej: 'nombre_empleado', 'salario_base')
    header_row INT DEFAULT 1, -- Fila donde están los encabezados (para archivos)
    start_row INT DEFAULT 2, -- Fila donde comienzan los datos (para archivos)
    is_active BOOLEAN DEFAULT TRUE, -- Indica si esta configuración de columna está activa
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Auditoría
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Se mantienen los tipos de datos CHECK; 'EMAIL' y 'PHONE' son útiles para validación a nivel de aplicación
    CONSTRAINT valid_column_data_type CHECK (data_type IN ('INTEGER', 'DECIMAL', 'TEXT', 'DATE', 'DATETIME', 'BOOLEAN', 'EMAIL', 'PHONE'))
);

-- Tabla para registrar logs de extracción - Sin cambios significativos, el CHECK del status es correcto
CREATE TABLE IF NOT EXISTS extraction_logs (
    id SERIAL PRIMARY KEY,
    data_source_id INT REFERENCES data_sources(id) ON DELETE CASCADE, -- De qué fuente es este log
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Inicio de la ejecución
    end_time TIMESTAMP, -- Fin de la ejecución
    status VARCHAR(50) DEFAULT 'IN_PROGRESS', -- Estado final de la ejecución
    records_extracted INT DEFAULT 0, -- Registros leídos de la fuente (bruto)
    records_processed INT DEFAULT 0, -- Registros que pasaron a la etapa de procesamiento (válidos/listos)
    records_failed INT DEFAULT 0, -- Registros que fallaron la extracción/parsing inicial
    error_message TEXT, -- Mensaje de error general si la ejecución falló
    execution_details JSONB, -- Detalles adicionales de la ejecución (ej: path del archivo, URL, query, etc.)
    executed_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Quién o qué sistema ejecutó la extracción
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_log_status CHECK (status IN ('IN_PROGRESS', 'SUCCESS', 'FAILED', 'PARTIAL_SUCCESS')) -- 'PARTIAL_SUCCESS' es útil si algunos registros fallan pero la extracción general continuó
);

-- Tabla para almacenar los datos extraídos (CRUDOS)
CREATE TABLE IF NOT EXISTS extracted_data (
    id SERIAL PRIMARY KEY,
    data_source_id INT REFERENCES data_sources(id) ON DELETE CASCADE, -- De qué fuente provienen los datos
    extraction_log_id INT REFERENCES extraction_logs(id) ON DELETE SET NULL, -- <--- NUEVO CAMPO: Referencia a la ejecución de log que generó estos datos
    extraction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha/hora en que se extrajeron estos datos (puede ser igual al start_time del log)
    data_content JSONB NOT NULL, -- Contenido extraído en formato JSON (ej: un array de objetos/filas)
    record_count INT DEFAULT 0, -- Número de registros contenidos en data_content
    is_processed BOOLEAN DEFAULT FALSE, -- Indica si este lote de datos ya fue procesado/cargado al destino
    processed_date TIMESTAMP, -- Fecha/hora en que se procesó este lote
    processed_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Quién procesó este lote (si aplica) -- Campo adicional sugerido para auditoría del procesamiento
    processing_details JSONB, -- Detalles/logs del procesamiento de este lote (ej: errores por registro) -- Campo adicional sugerido
    data_name VARCHAR(255), -- Nombre de datos extraídos
    calculate_date DATE, -- Fecha de cálculo
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Quién inició (o el sistema que creó) este registro de datos extraídos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE extracted_data
-- ADD COLUMN data_name VARCHAR(255), -- Nombre de datos extraídos
-- ADD COLUMN calculate_date DATE; -- Fecha de cálculo

-- Índices para mejorar el rendimiento
CREATE INDEX idx_data_sources_company ON data_sources(company_id);
CREATE INDEX idx_data_sources_source_type ON data_sources(source_type);
CREATE INDEX idx_data_sources_status ON data_sources(extraction_status, is_active);
CREATE INDEX idx_data_source_column_configs_source ON data_source_column_configs(data_source_id);
CREATE INDEX idx_extracted_data_source ON extracted_data(data_source_id);
CREATE INDEX idx_extracted_data_processed ON extracted_data(is_processed);
CREATE INDEX idx_extraction_logs_source ON extraction_logs(data_source_id);
CREATE INDEX idx_extraction_logs_status ON extraction_logs(status);


CREATE TABLE IF NOT EXISTS detail_tables_config (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE, -- Para multi-empresa
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--INSERT INTO detail_tables_config (company_id, "name", description) VALUES(2, 'employees', 'Configuración para la nomina.');
--INSERT INTO detail_tables_config (company_id, "name", description) VALUES(2, 'product_compliance', 'Lista Productos estratégicos');
--INSERT INTO detail_tables_config (company_id, "name", description) VALUES(2, 'calculation_product_extrategic', 'Calculo de comisiones estratégicas');
--INSERT INTO detail_tables_config (company_id, "name", description) VALUES(2, 'other', 'Configuración general');

-- Tabla: tamaño de la tienda
CREATE TABLE IF NOT EXISTS store_size (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    bonus NUMERIC(12,2) NOT NULL,
    time INTEGER NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS store_configuration (
    id SERIAL PRIMARY KEY,
    regional VARCHAR(100) NOT NULL,
    store_name VARCHAR(100) NOT NULL,
    ceco VARCHAR(50),
    code VARCHAR(50),
    store_size_id INT NOT NULL,
    company_id INT,
    notes TEXT,
    register_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_store_size
        FOREIGN KEY (store_size_id)
        REFERENCES store_size(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS employ_for_month (
    id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL, -- Mes de la configuración 1-12
    mount_name VARCHAR(100) NOT NULL, -- Nombre del mes Enero, Febrero, etc.
    number_employees INT NOT NULL, -- Número de empleados para el mes 2
    store_configuration_id INT NOT NULL, -- ID de la configuración de la tienda
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_store_configuration
        FOREIGN KEY (store_configuration_id)
        REFERENCES store_configuration(id)
        ON DELETE CASCADE
);

-- Tabla: cargo_empresa
CREATE TABLE IF NOT EXISTS company_positions (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    is_store_size BOOLEAN DEFAULT FALSE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    salary_base NUMERIC(12,2), -- Salario base para el cargo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--ALTER TABLE "db-sellout".company_positions ADD is_store_size bool DEFAULT false NULL;

--Cumplimiento de metas indurama por producto
CREATE TABLE IF NOT EXISTS product_compliance (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    parameter_line_id INT REFERENCES parameter_lines(id) ON DELETE CASCADE,
    sale_value NUMERIC(12,2) NOT NULL, --Venta del producto
    budget_value NUMERIC(12,2) NOT NULL, --Meta de venta del producto
    compliance_percentage NUMERIC(9,2) NOT NULL, --Porcentaje de cumplimiento de la meta
    compliance_percentage_max NUMERIC(9,2) NOT NULL, --Porcentaje máximo de cumplimiento de la meta
    weight NUMERIC(9,2) NOT NULL, --Peso de la meta
    value_base_variable NUMERIC(12,2) NOT NULL, --Valor base del variable
    variable_amount NUMERIC(12,2) NOT NULL, --Monto del variable
    calculate_date DATE NOT NULL, --Fecha del mes de cálculo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Calculo del variable en base a los KPI's
CREATE TABLE IF NOT EXISTS calculation_product_extrategic (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    kpi_config_id INT REFERENCES kpi_config(id) ON DELETE CASCADE,
    city VARCHAR(255) NOT NULL,
    regional VARCHAR(255),
    calculate_date DATE NOT NULL,
    ub_real NUMERIC(12,2) NOT NULL, -- Unidades reales Utilidad Bruta
    budget_value NUMERIC(12,2) NOT NULL, -- Presupuesto Utilidad Bruta
    strategic_compliance_pct NUMERIC(9,2) NOT NULL, -- Cumplimiento de producto estratégico Utilidad Bruta porcentaje
    exhibition NUMERIC(12,2) NOT NULL, -- Exhibición Indurama
    total_exhibition NUMERIC(12,2) NOT NULL, -- Total exhibición
    exhibition_pct NUMERIC(9,2) NOT NULL, -- Porcentaje de exhibición
    units_sold NUMERIC(12,2) NOT NULL, -- Unidades vendidas Rotacion de venta
    units_exhibited NUMERIC(12,2) NOT NULL, -- Unidades exhibidas Rotacion de venta
    rotation_pct NUMERIC(9,2) NOT NULL, -- Rotación de venta porcentaje
    productivity_pct NUMERIC(9,2) NOT NULL, -- Productividad
    applies_bonus BOOLEAN DEFAULT FALSE, -- Aplica bono
    value_product_extrategic NUMERIC(12,2) NOT NULL, -- Valor del bono estrategico
    observation TEXT, -- Observación
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--tabla: Calculo de comisiones
CREATE TABLE IF NOT EXISTS consolidated_commission_calculation (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE,
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE,
    total_commission_product_line NUMERIC(12,2) NOT NULL,
    total_commission_product_estategic NUMERIC(12,2) NOT NULL,
    total_hours_extra NUMERIC(12,2) NOT NULL,
    total_nomina NUMERIC(12,2) NOT NULL,
    pct_nomina NUMERIC(9,2) NOT NULL,
    observation TEXT,
    calculate_date DATE NOT NULL, --Fecha del mes de cálculo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--tabla: Calculo de comisiones Marcimex - asesor
CREATE TABLE IF NOT EXISTS advisor_commission (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE, -- ID de la empresa
    company_position_id INT REFERENCES company_positions(id) ON DELETE CASCADE, -- ID del cargo
    employee_id INT REFERENCES employees(id) ON DELETE CASCADE, -- ID del empleado
    store_size_id INT REFERENCES store_size(id) ON DELETE CASCADE NULL,
    tax_sale NUMERIC(15,2) NOT NULL, -- venta fiscal
    budget_sale NUMERIC(15,2) NOT NULL, -- meta de venta
    compliance_sale NUMERIC(15,4) NOT NULL, -- cumplimiento de venta
    range_apply_bonus NUMERIC(15,4) NOT NULL, -- rango de aplicación de bono
    sale_intangible NUMERIC(15,2) NOT NULL, -- venta intangible
    cash_sale NUMERIC(15,2) NOT NULL, -- venta en efectivo
    credit_sale NUMERIC(15,2) NOT NULL, -- venta en crédito
    commission_intangible NUMERIC(15,2) NOT NULL, -- comisión intangible
    commission_cash NUMERIC(15,2) NOT NULL, -- comisión en efectivo
    commission_credit NUMERIC(15,2) NOT NULL, -- comisión en crédito
    commission_total NUMERIC(15,2) NOT NULL, -- comisión total
    observation TEXT, -- observación
    calculate_date DATE NOT NULL, -- fecha del mes de cálculo
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- fecha de actualización
);

-- ALTER TABLE advisor_commission
--   ALTER COLUMN tax_sale            TYPE NUMERIC(15,2),
--   ALTER COLUMN budget_sale         TYPE NUMERIC(15,2),
--   ALTER COLUMN compliance_sale     TYPE NUMERIC(15,4),
--   ALTER COLUMN range_apply_bonus   TYPE NUMERIC(15,4),
--   ALTER COLUMN sale_intangible     TYPE NUMERIC(15,2),
--   ALTER COLUMN cash_sale           TYPE NUMERIC(15,2),
--   ALTER COLUMN credit_sale         TYPE NUMERIC(15,2),
--   ALTER COLUMN commission_intangible TYPE NUMERIC(15,2),
--   ALTER COLUMN commission_cash     TYPE NUMERIC(15,2),
--   ALTER COLUMN commission_credit   TYPE NUMERIC(15,2),
--   ALTER COLUMN commission_total    TYPE NUMERIC(15,2);

-- ALTER TABLE advisor_commission ADD COLUMN store_size_id INT REFERENCES store_size(id) ON DELETE CASCADE NULL;

-- CONFIGURACION DE SELLOUT -----------------------------------------------------------------------------------

-- Tabla: sellout_store_master
CREATE TABLE IF NOT EXISTS sellout_store_master (
    id SERIAL PRIMARY KEY,
    distributor VARCHAR(255) NULL,
    store_distributor VARCHAR(255) NULL,
    search_store VARCHAR(255) NULL UNIQUE,
    code_store_sic VARCHAR(255) NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- CREATE UNIQUE INDEX unique_search_store ON sellout_store_master(search_store);

-- Tabla: sellout_product_master
CREATE TABLE IF NOT EXISTS sellout_product_master (
    id SERIAL PRIMARY KEY,
    distributor VARCHAR(255) NULL,
    product_distributor VARCHAR(255) NULL,
    product_store VARCHAR(255) NULL,
    search_product_store VARCHAR(255) NULL,
    code_product_sic VARCHAR(255) NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CREATE UNIQUE INDEX unique_search_product_store ON sellout_product_master(search_product_store);


CREATE TABLE IF NOT EXISTS sellout_configuration (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    description TEXT NULL,
    distributor_company_name VARCHAR(255) NULL,
    sheet_name VARCHAR(255) NOT NULL,
    code_store_distributor VARCHAR(255) NULL,
    matriculation_id INT REFERENCES matriculation_templates(id) ON DELETE SET NULL,
    calculate_date DATE NOT NULL,
    company_id INT REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    initial_sheet INT NULL,
    end_sheet INT NULL,
    CONSTRAINT fk_company
        FOREIGN KEY (company_id)
        REFERENCES companies(id)
        ON DELETE CASCADE
);

-- ALTER TABLE sellout_configuration ADD COLUMN calculate_date DATE NOT NULL;
--ALTER TABLE sellout_configuration ADD COLUMN initial_sheet INT NULL;
--ALTER TABLE sellout_configuration ADD COLUMN end_sheet INT NULL;

CREATE TABLE IF NOT EXISTS extraction_logs_sellout (
    id SERIAL PRIMARY KEY,
    sellout_configuration_id INT REFERENCES sellout_configuration(id) ON DELETE CASCADE, -- De qué fuente es este log
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Inicio de la ejecución
    end_time TIMESTAMP, -- Fin de la ejecución
    status VARCHAR(50) DEFAULT 'IN_PROGRESS', -- Estado final de la ejecución
    records_extracted INT DEFAULT 0, -- Registros leídos de la fuente (bruto)
    records_processed INT DEFAULT 0, -- Registros que pasaron a la etapa de procesamiento (válidos/listos)
    records_failed INT DEFAULT 0, -- Registros que fallaron la extracción/parsing inicial
    error_message TEXT, -- Mensaje de error general si la ejecución falló
    execution_details JSONB, -- Detalles adicionales de la ejecución (ej: path del archivo, URL, query, etc.)
    executed_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Quién o qué sistema ejecutó la extracción
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_log_status CHECK (status IN ('IN_PROGRESS', 'SUCCESS', 'FAILED', 'PARTIAL_SUCCESS')) -- 'PARTIAL_SUCCESS' es útil si algunos registros fallan pero la extracción general continuó
);

CREATE TABLE IF NOT EXISTS extracted_data_sellout (
    id SERIAL PRIMARY KEY,
    sellout_configuration_id INT REFERENCES sellout_configuration(id) ON DELETE CASCADE, -- De qué fuente provienen los datos
    extraction_log_id INT REFERENCES extraction_logs_sellout(id) ON DELETE SET NULL, -- <--- NUEVO CAMPO: Referencia a la ejecución de log que generó estos datos
    extraction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha/hora en que se extrajeron estos datos (puede ser igual al start_time del log)
    data_content JSONB NOT NULL, -- Contenido extraído en formato JSON (ej: un array de objetos/filas)
    record_count INT DEFAULT 0, -- Número de registros contenidos en data_content
    is_processed BOOLEAN DEFAULT FALSE, -- Indica si este lote de datos ya fue procesado/cargado al destino
    processed_date TIMESTAMP, -- Fecha/hora en que se procesó este lote
    processed_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Quién procesó este lote (si aplica) -- Campo adicional sugerido para auditoría del procesamiento
    processing_details JSONB, -- Detalles/logs del procesamiento de este lote (ej: errores por registro) -- Campo adicional sugerido
    data_name VARCHAR(255), -- Nombre de datos extraídos
    calculate_date DATE, -- Fecha de cálculo
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Quién inició (o el sistema que creó) este registro de datos extraídos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sellout_configuration_column_configs (
    id SERIAL PRIMARY KEY,
    sellout_configuration_id INT REFERENCES sellout_configuration(id) ON DELETE CASCADE, -- Enlace a la fuente
    column_name VARCHAR(255), -- Nombre del encabezado en el archivo/fuente (puede ser null si se usa index/letter)
    column_index INT, -- Índice de la columna (basado en 0 o 1, definir convención)
    column_letter VARCHAR(10), -- Letra de la columna (para Excel, ej: 'A', 'AZ')
    data_type VARCHAR(50) NOT NULL, -- Tipo de dato esperado (INTEGER, DECIMAL, TEXT, DATE, DATETIME, BOOLEAN, EMAIL, PHONE, etc.)
    is_required BOOLEAN DEFAULT FALSE, -- Indica si el campo es obligatorio
    mapping_to_field VARCHAR(255), -- Campo al que se mapea en el sistema de destino (ej: 'nombre_empleado', 'salario_base')
    header_row INT DEFAULT 1, -- Fila donde están los encabezados (para archivos)
    start_row INT DEFAULT 2, -- Fila donde comienzan los datos (para archivos)
    is_active BOOLEAN DEFAULT TRUE, -- Indica si esta configuración de columna está activa
    has_negative_value BOOLEAN DEFAULT FALSE, -- Indica si el valor es negativo
    created_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Auditoría
    updated_by INTEGER REFERENCES users(id) ON DELETE SET NULL, -- Auditoría
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Configuracion de la tabla de consolidacion de datos de stores

-- ALTER TABLE sellout_configuration_column_configs ADD COLUMN has_negative_value BOOLEAN DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS consolidated_data_stores (
    id SERIAL PRIMARY KEY,
    distributor VARCHAR(50) NOT NULL,
    code_store_distributor TEXT,
    code_product_distributor VARCHAR(255),
    description_distributor TEXT,
    units_sold_distributor NUMERIC(12,2) NOT NULL,
    sale_date DATE NOT NULL,
    code_product VARCHAR(255)  NULL,
    code_store VARCHAR(255)  NULL,
    authorized_distributor VARCHAR(255)  NULL,
    store_name VARCHAR(255)  NULL,
    product_model VARCHAR(255)  NULL,
    calculate_date DATE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    matriculation_template_id INT REFERENCES matriculation_templates(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observation TEXT NULL,
);

-- ALTER TABLE consolidated_data_stores ADD COLUMN status BOOLEAN DEFAULT TRUE;

-- ALTER TABLE consolidated_data_stores
-- ADD COLUMN matriculation_template_id INT;

-- ALTER TABLE consolidated_data_stores
-- ADD CONSTRAINT fk_matriculation_template
-- FOREIGN KEY (matriculation_template_id)
-- REFERENCES matriculation_templates(id)
-- ON DELETE SET NULL;

-- ALTER TABLE consolidated_data_stores
-- ADD COLUMN observation TEXT NULL;


CREATE TABLE IF NOT EXISTS stores (
    id SERIAL PRIMARY KEY,
    store_code NUMERIC NOT NULL UNIQUE,
    store_name VARCHAR(255) NOT NULL,
    store_address VARCHAR(255) NOT NULL,
    
    distributor VARCHAR(255) NOT NULL,
    distributor2 VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    agency_manager VARCHAR(255) NOT NULL,
    size VARCHAR(255) NOT NULL,
    ubication VARCHAR(255) NOT NULL,
    sales INT NOT NULL,
    channel VARCHAR(255) NOT NULL,
    distributor_sap VARCHAR(255) NOT NULL,
    end_channel VARCHAR(255) NOT NULL,
    supervisor VARCHAR(255) NOT NULL,
    wholesale_region VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    region VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    province VARCHAR(255) NOT NULL,
    zone VARCHAR(255) NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- CREATE UNIQUE INDEX unique_store_code ON stores(store_code);

CREATE TABLE IF NOT EXISTS product_sic (
    id SERIAL PRIMARY KEY,
    id_product_sic INT NOT NULL UNIQUE,
    jde_code VARCHAR(255) NOT NULL,
    ime_name VARCHAR(255) NOT NULL,
    jde_name VARCHAR(255) NOT NULL,
    sap_code VARCHAR(255) NOT NULL,
    sap_name VARCHAR(255) NOT NULL,
    company_line VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    sub_category VARCHAR(255) NOT NULL,
    mar_model_lm VARCHAR(255) NOT NULL,
    model VARCHAR(255) NULL,
    design_line VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    discontinued BOOLEAN DEFAULT FALSE,
    status BOOLEAN DEFAULT TRUE,
    sheet_visit VARCHAR(255) NOT NULL,
    equivalent_pro_id VARCHAR(255) NOT NULL,
    equivalent VARCHAR(255) NOT NULL,
    validity VARCHAR(255)  NULL,
    repeated_numbers VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE product_sic ADD COLUMN model VARCHAR(255) NULL;

-- CREATE UNIQUE INDEX unique_id_product_sic ON product_sic(id_product_sic);


CREATE TABLE IF NOT EXISTS base_ppto_sellout (
    id SERIAL PRIMARY KEY,
    
    code_supervisor VARCHAR(255) NOT NULL,
    id_employee_supervisor INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    code_zone VARCHAR(255) NOT NULL,
    id_employee_code_zone INT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    store_code VARCHAR(255) NOT NULL,
    id_stores INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    
    promotor_code VARCHAR(255) NOT NULL,
    id_employee_promotor INT REFERENCES employees(id) ON DELETE SET NULL,
    
    code_promotor_pi VARCHAR(255),
    id_employee_promotor_pi INT REFERENCES employees(id) ON DELETE SET NULL,
    
    code_promotor_tv VARCHAR(255),
    id_employee_promotor_tv INT REFERENCES employees(id) ON DELETE SET NULL,
    
    equivalent_code VARCHAR(255) NOT NULL,
    id_product_sic INT NOT NULL REFERENCES product_sic(id) ON DELETE SET NULL,

    product_type VARCHAR(255) NOT NULL,

    units NUMERIC(15,2) NOT NULL,
    unit_base NUMERIC(15,2) NOT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS base_values_sellout (
    id SERIAL PRIMARY KEY,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    unit_base_unitary VARCHAR(255) NULL,
    pvd_unitary VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Base con visitas, exhibiciones y ventas sell out de clientes/distribuidores.	

CREATE TABLE IF NOT EXISTS rotation_base (
    id SERIAL PRIMARY KEY,
    visit_code VARCHAR(50) NOT NULL,                             -- Cod Visita
    visit_sheet_number VARCHAR(100),                             -- Número de Hoja de visita cargada

    visit_date DATE NOT NULL,                                    -- Fecha
    visit_year INT NOT NULL,                                     -- Año obtenido de la fecha de visita
    visit_month INT NOT NULL,                                    -- Mes obtenido de la fecha de visita

    store_code VARCHAR(50) NOT NULL,                             -- Cod almacen (SIC)
    id_stores INT REFERENCES stores(id) ON DELETE SET NULL,
    
    product_code VARCHAR(100) NOT NULL,                          -- Código de homologación de producto
    id_product_sic INT REFERENCES product_sic(id) ON DELETE SET NULL,

    pvd_value NUMERIC(15,2),                                     -- Venta valorada a PDV - Plan promocional
    sellout_units NUMERIC(15,2),                                 -- Unidades venta sell out

    sellout_month INT,                                           -- Mes al que corresponde el Sell Out (≠ visit_month)
    period VARCHAR(6),                                           -- PERIODO = año + mes venta (formato 'YYYYMM')

    less_than_3_months INT DEFAULT 0,                            -- (-) 3: Antigüedad < 3 meses
    between_3_and_6_months INT DEFAULT 0,                        -- (3-6): Antigüedad entre 3 y 6 meses
    more_than_6_months INT DEFAULT 0,                            -- (+) 6: Antigüedad > 6 meses
    more_than_2_years INT DEFAULT 0,                             -- +2A: Antigüedad > 2 años

    total_displayed INT DEFAULT 0,                               -- TOTAL EXHIBI
    mapping_target INT,                                          -- MAPEO

    unit_price NUMERIC(15,2),                                    -- VALOR $$
    total_ub_value NUMERIC(15,2),                                -- VALOR UB = UB * SellOut
    unit_ub NUMERIC(15,2)     
    
    id_employee_promotor INT REFERENCES employees(id) ON DELETE SET NULL,
    
    id_employee_coordinator_zonal INT REFERENCES employees(id) ON DELETE SET NULL,
    
    id_employee_promotor_pi INT REFERENCES employees(id) ON DELETE SET NULL,
    
    sales_account VARCHAR(100),                                  -- CUENTA VENTA
    display_account VARCHAR(100),     

    id_employee_supervisor INT REFERENCES employees(id) ON DELETE SET NULL, 
    id_employee_promotor_tv INT REFERENCES employees(id) ON DELETE SET NULL,

    more_than_9_months INT DEFAULT 0,                            -- > 9 meses
    more_than_1_year INT DEFAULT 0,                              -- > 1 año
    is_consignment INT DEFAULT 0,  

    sellout_year INT,                                            -- Año SO
    sellout_month_number INT,                                    -- Mes SO
    current_ub_value NUMERIC(15,2),                              -- UB Actual
    current_pvd_value NUMERIC(15,2),                             -- Venta Actual
    visit_type VARCHAR(50),                                       -- Visita Tipo ("monthly" / "historical")

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     
);

-- Base que contiene la información de la cobertura de visitas y el cumplimiento de la planificación realizada			

CREATE TABLE IF NOT EXISTS visit_registry_base (
    id SERIAL PRIMARY KEY,
    assigned_promoter_code VARCHAR(50),               -- Cód. promotor asignado a la visita
    id_employee_promotor INT REFERENCES employees(id) ON DELETE SET NULL,

    assigned_coordinator_code VARCHAR(50),            -- Código del coordinador asignado
    id_employee_coordinator_zonal INT REFERENCES employees(id) ON DELETE SET NULL,

    visit_month TEXT,                                 -- Mes de visita
    visit_day_of_week TEXT,                           -- Día de la semana de visita
    visit_date DATE,                                  -- Fecha de planificación

    store_code VARCHAR(50),                           -- Código del almacén (registro)
    id_stores INT REFERENCES stores(id) ON DELETE SET NULL,

    planning_status TEXT,                             -- Estado de la planificación

    planned_schedule TIME,                            -- Horario planificado
    planned_duration INTERVAL,                        -- Duración planificada (puede ser en minutos o HH:MM)
    monthly_frequency INT,                            -- Frecuencia mensual

    actual_schedule TIME,                             -- Horario real
    actual_duration INTERVAL,                         -- Duración real

    compliance_percentage NUMERIC(5,2),               -- Porcentaje de cumplimiento
    compliance_status TEXT,                           -- Estado de cumplimiento

    planned_minutes INT,                              -- Minutos planificados
    actual_minutes INT,                               -- Minutos reales

    not_planned BOOLEAN DEFAULT FALSE,                -- ¿Fue no planificada?

    promoter_observation TEXT,                        -- Observación del promotor
    zonal_observation TEXT,                            -- Observación del zonal

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Base que contiene la información de los productos creados en SAP para su integración con las fuentes Sell Out			

CREATE TABLE IF NOT EXISTS web_services (
    id SERIAL PRIMARY KEY,
    material_code VARCHAR(50),                    -- SAP product code
    ean_code VARCHAR(50),                         -- Product EAN code
    material_status TEXT,                         -- Material status
    product_weight NUMERIC(10,2),                 -- Product weight
    weight_unit TEXT,                             -- Unit of measurement for weight

    product_name TEXT,                            -- Product name
    material_type_code VARCHAR(50),               -- Inventory type code
    material_type_description TEXT,               -- Inventory type description

    sales_org TEXT,                               -- Sales organization / Company
    business_line TEXT,                           -- Product business line
    category TEXT,                                -- Product category
    subcategory TEXT,                             -- Product subcategory

    color TEXT,                                   -- Product color
    design_line TEXT,                             -- Design line
    brand TEXT,                                   -- Product brand
    segment TEXT,                                 -- Product segment
    size TEXT,                                    -- Product size

    model_im TEXT,                                 -- IM model

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matriculation_templates (
    id SERIAL PRIMARY KEY,
    distributor VARCHAR(255) NOT NULL,
    store_name VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    calculate_month DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS matriculation_logs (
    id SERIAL PRIMARY KEY,
    matriculation_id INTEGER NOT NULL REFERENCES matriculation_templates(id) ON DELETE CASCADE,
    user VARCHAR(255) NULL,
    distributor VARCHAR(255) NULL,
    store_name VARCHAR(255) NULL,
    calculate_date DATE NOT NULL,
    upload_total INT NULL,
    upload_count INT NULL,
    rows_count INT NOT NULL,
    product_count INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ALTER TABLE matriculation_logs ADD COLUMN distributor VARCHAR(255) NULL;
-- ALTER TABLE matriculation_logs ADD COLUMN store_name VARCHAR(255) NULL;
-- ALTER TABLE matriculation_logs ADD COLUMN user VARCHAR(255) NULL;

CREATE TABLE IF NOT EXISTS closing_configuration (
    id SERIAL PRIMARY KEY,
    start_date DATE NOT NULL,
    closing_date DATE NOT NULL,
    month DATE NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE closing_configuration ADD COLUMN start_date DATE NOT NULL;

CREATE TABLE IF NOT EXISTS store_ppto_marcimex (
    id SERIAL PRIMARY KEY,
    ceco VARCHAR(50) NOT NULL, -- Ceco de la tienda
    mount INTEGER NOT NULL, -- Mes de la tienda (1-12)
    year INTEGER NOT NULL, -- Año de la tienda
    store_configuration_id INT NULL REFERENCES store_configuration(id) ON DELETE CASCADE, -- ID
    store_ppto NUMERIC(15,9) NOT NULL, -- PPTO de la tienda
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Fecha de actualización
);

CREATE TABLE IF NOT EXISTS grouped_by_store (
    id SERIAL PRIMARY KEY,
    store_principal_id INT NULL REFERENCES store_configuration(id) ON DELETE CASCADE,
    store_secondary_id INT NULL REFERENCES store_configuration(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS grouped_by_advisor (
    id SERIAL PRIMARY KEY,
    store_principal_id INT NULL REFERENCES store_configuration(id) ON DELETE CASCADE,
    store_secondary_id INT NULL REFERENCES store_configuration(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS store_manager_calculation_commission (
    id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES employees(id) ON DELETE SET NULL,
    store_configuration_id INT NULL REFERENCES store_configuration(id) ON DELETE CASCADE,
    fiscal_sale NUMERIC(15,3) default 0.00, -- Venta fiscal
    fiscal_sale_calculate NUMERIC(15,3) default 0.00, -- Venta fiscal
    ppto_sale NUMERIC(15,3) default 0.00, -- Presupuesto de venta
    range_compliance NUMERIC(15,2) default 0.00, -- RANGO DE CUMPLIMIENTO
    range_compliance_apl NUMERIC(15,2) default 0.00, -- RANGO DE CUMPLIMIENTO APLICADO
    sales_compliance_percent NUMERIC(15,2) default 0.00, -- % CUMPLIMIENTO VENTA
    sales_commission NUMERIC(15,2) default 0.00, -- COMISIÓN VENTA
    direct_profit NUMERIC(15,3) default 0.00, -- UTILIDAD DIRECTA
    direct_profit_calculate NUMERIC(15,3) default 0.00, -- UTILIDAD DIRECTA
    direct_profit_pto NUMERIC(15,3) default 0.00, -- PTO UTILIDAD DIRECTA
    profit_compliance NUMERIC(15,2) default 0.00, -- CUMPL UTILIDAD
    profit_compliance_apl NUMERIC(15,2) default 0.00, -- CUMPL UTILIDAD APLICADO
	profit_commission_percent NUMERIC(15,2) default 0.00, -- % COMISIÓN (UTILIDAD)
	profit_commission NUMERIC(15,2) default 0.00, -- COMISIÓN POR UTILIDAD
    performance_commission NUMERIC(15,2) default 0.00, -- COMISIÓN POR RENDIMIENTO
    average_sales_with_performance NUMERIC(15,2) default 0.00, -- VENTAS PROMEDIO CON RENDIMIENTO
    performance_compliance_percent NUMERIC(15,2) default 0.00, -- % CUMPLIMIENTO RENDIMIENTO
	total_payroll_amount NUMERIC(15,2) default 0.00, -- TOTAL A RECIBIR (NÓMINA)
    calculate_date DATE NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- ALTER TABLE store_manager_calculation_commission 
--     ADD COLUMN range_compliance NUMERIC(5,2) default 0.00;

-- ALTER TABLE store_manager_calculation_commission 
--     ADD COLUMN performance_commission NUMERIC(15,2) default 0.00;

--     ALTER TABLE store_manager_calculation_commission 
--     ADD COLUMN average_sales_with_performance NUMERIC(15,2) default 0.00;

--         ALTER TABLE store_manager_calculation_commission 
--     ADD COLUMN performanceCompliancePercent NUMERIC(15,2) default 0.00;
-- ALTER TABLE store_manager_calculation_commission ADD COLUMN fiscal_sale_calculate NUMERIC(15,2) default 0.00;
-- ALTER TABLE store_manager_calculation_commission ADD COLUMN range_compliance_apl NUMERIC(15,2) default 0.00;
-- ALTER TABLE store_manager_calculation_commission ADD COLUMN profit_compliance_apl NUMERIC(15,2) default 0.00;
-- ALTER TABLE store_manager_calculation_commission ADD COLUMN direct_profit_calculate NUMERIC(15,2) default 0.00;

CREATE TABLE IF NOT EXISTS column_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS column_keyword (
    id SERIAL PRIMARY KEY,
    category_id INT NOT NULL REFERENCES column_category(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


