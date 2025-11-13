INSERT INTO column_category (name, description) VALUES
('saleDate', 'Columnas que representan fechas de venta o emisión'),
('descriptionDistributor', 'Columnas que describen el nombre o detalle del producto'),
('unitsSoldDistributor', 'Columnas que representan unidades o cantidades vendidas'),
('codeProductDistributor', 'Columnas que representan códigos o referencias de producto'),
('distributor', 'Columnas con el nombre del distribuidor o formato'),
('codeStoreDistributor', 'Columnas con información de tienda, local o sucursal'),
('saleDay', 'Columnas con el día de la venta'),
('saleMonth', 'Columnas con el mes de la venta'),
('saleYear', 'Columnas con el año de la venta');

-- =========================================================
-- 🧩 3. Insertar keywords asociados a cada categoría
-- =========================================================

-- ===== saleDate =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'fecha','dia','mes','anio','año','fecha_dia','fechaventa','venta','date',
'sale date','fecha_dia','fecha_movimiento','fecha_compte','fecha de contabilizacion',
'emision','order date','final','fecha sistema','fec.','FECHA DE VENTA','Fecha','fecha_dia'
]) kw WHERE name = 'saleDate';

-- ===== descriptionDistributor =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'articulo','producto','descripcion','Descripcion','detalle producto','detalle','item',
'nombre del producto','codigodescripcion','nomart','descripcion del producto','descripcion distribuidor',
'descripcion de producto','descripcion producto','descripción producto','descripcionarticulo','descripcion_articulo',
'nombre del articulo','codigo descripcion','nombre sku','nombre item','nombre producto','modelo','itemname',
'detalle del producto','des_producto','nombre','articulo indurama','descripcion articulo/servicio',
'lineas de factura/producto/nombre','articulo o servicio','etiquetas de fila','nombre sku','pro_nombre',
'despro','productos','expr1005','descripcion articulo/serv.'
]) kw WHERE name = 'descriptionDistributor';

-- ===== unitsSoldDistributor =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'unidades','cantidad','ventas','total','totales','vendido','vtas','vendidos','units','quantity',
'uni. vendidas','suma de nombre item','suma de cantidad','ing/egr','2025','sold','unidades vendidas',
'suma de total general','suma de cant','electrogold','unidades','cantidad ty','suma de unidades venta distribuidor',
'und','cant','cant.','unidad','vendid','Vta, Período  (u)','seccion','uni vendidas 2025-05','vta, periodo (u)',
'suma de vta, periodo (u)','suma de cantidad ty','suma de unidades','suma de valor','valor','can','canti',
'can_fac','cuenta de articulo','Descripcion de Producto','unidades venta distribuidor','suma de ing/egr','total general'
]) kw WHERE name = 'unitsSoldDistributor';

-- ===== codeProductDistributor =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'sap','codigo','cod p','código','code','codigo producto','codigo de producto','cod articulo','cod_producto',
'pro_codigo','modelo','cod. promart','referencia','numero de articulo','cod. catalogo','cob_ite','cod.prod distribuidor'
]) kw WHERE name = 'codeProductDistributor';

-- ===== distributor =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'distribuidor','formato'
]) kw WHERE name = 'distributor';

-- ===== codeStoreDistributor =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'agencia','local','sucursal','locales','cod almacen','almacen','centro','descripcion_agencia','tienda',
'atributo','alm_nombre','bodega','nombre de serie','nomlocal','cod.almacen distribuidor','AGENCIA','nombre pos','tienda dynamics'
]) kw WHERE name = 'codeStoreDistributor';

-- ===== saleDay =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'dia','día'
]) kw WHERE name = 'saleDay';

-- ===== saleMonth =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'mes','periodo mes'
]) kw WHERE name = 'saleMonth';

-- ===== saleYear =====
INSERT INTO column_keyword (category_id, keyword)
SELECT id, kw FROM column_category, unnest(ARRAY[
'año','anio','periodo año','periodo anio'
]) kw WHERE name = 'saleYear';


