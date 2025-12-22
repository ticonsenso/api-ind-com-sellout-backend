# Documentación del Proyecto Backend (READMEIA)

Este documento ha sido generado para que un Asistente IA (y desarrolladores humanos) entienda rápidamente la estructura, arquitectura y lógica de negocio de este proyecto backend.

## 1. Visión General del Proyecto

**Nombre**: `back-concenso`
**Propósito**: Backend para la gestión de sellout, comisiones, tiendas y usuarios.
**Tecnologías Principales**:
-   **Runtime**: Node.js
-   **Framework Web**: Express.js
-   **Lenguaje**: TypeScript
-   **Base de Datos**: PostgreSQL
-   **ORM**: TypeORM
-   **Autenticación**: Passport (SAML y JWT)
-   **Documentación API**: Swagger

## 2. Arquitectura de Software

El proyecto sigue una arquitectura de capas bien definida, separando las responsabilidades de recepción de peticiones, lógica de negocio y acceso a datos.

### Diagrama de Flujo
`Request` -> `Route` -> `Middleware (Auth/Validation)` -> `Controller` -> `Service` -> `Repository/Entity` -> `Database`

### Detalles de Implementación
-   **Inyección de Dependencias**: Es manual. El `DataSource` de TypeORM se inicializa en el arranque (`server.ts`/`app.ts` flow) y se pasa a los controladores, quienes a su vez instancian los servicios inyectándoles el `dataSource`.
-   **DTOs**: Se utilizan Data Transfer Objects para validar y tipar los datos de entrada, transformándolos con `class-transformer`.

## 3. Estructura de Directorios (`src/`)

-   **`config/`**: Configuración de variables de entorno (`env.ts`), base de datos y otras constantes globales.
-   **`controllers/`**: Manejadores de las rutas. Reciben `req` y `res`, extraen datos, llaman a servicios y devuelven respuestas HTTP estandarizadas.
    -   *Convención*: `[nombre].controller.ts`
-   **`models/`**: Entidades de TypeORM. Definen el esquema de la base de datos mediante decoradores `@Entity`, `@Column`, etc.
    -   *Convención*: `[nombre].model.ts`
-   **`services/`**: Lógica de negocio pura. Interactúan con los repositorios para manipular datos.
    -   *Convención*: `[nombre].service.ts`
-   **`routes/`**: Definición de endpoints y asociación con métodos de controladores.
    -   *Convención*: `[nombre].routes.ts`
-   **`dtos/`**: Clases para definir la forma de los datos de entrada/salida y validaciones.
-   **`middleware/`**: Middlewares de Express (Autenticación, manejo de errores, interceptores).
-   **`repository/`**: Repositorios personalizados si la lógica de acceso a datos es compleja (patrón Repository de TypeORM).
-   **`docs/`**: Configuración de Swagger.
-   **`app.ts`**: Configuración de la aplicación Express (registra rutas y middlewares globales).

## 4. Base de Datos

-   **Motor**: PostgreSQL.
-   **ORM**: TypeORM.
-   **Esquema Principal**: Configurado por variable de entorno (default: `db-sellout`).
-   **Entidades**: Las tablas se generan/sincronizan a partir de los modelos en `src/models`.

## 5. Autenticación y Seguridad

-   Soporta autenticación via SAML (para SSO) y JWT.
-   Usa `passport` para estrategias de autenticación.
-   Las rutas protegidas verifican el token JWT en el header `Authorization`.

## 6. Variables de Entorno Clave (.env)

El archivo `src/config/env.ts` centraliza la lectura. Las principales son:
-   `PORT`: Puerto del servidor (default 3008).
-   `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`: Credenciales de BD.
-   `DB_DEFAULT_SCHEMA`: Esquema de postgres.
-   `JWT_SECRET`: Clave para firmar tokens.

## 7. Comandos Útiles

-   `npm run dev`: Levanta el servidor en modo desarrollo con `nodemon`.
-   `npm run build`: Compila TypeScript a JavaScript en `dist/`.
-   `npm run start`: Ejecuta el servidor compilado.

## 8. Notas para el Agente IA

-   Al crear una nueva funcionalidad **Vertical** (ej. "Nuevos Reportes"):
    1.  Crear la Entidad en `models/` (si requiere tabla nueva).
    2.  Crear el DTO en `dtos/`.
    3.  Crear el Service en `services/` con la lógica.
    4.  Crear el Controller en `controllers/`.
    5.  Registrar la Ruta en `routes/`.
    6.  Añadir la ruta principal en `app.ts`.
-   Revisar siempre `package.json` para ver versiones de librerías (ej. TypeORM v0.3.x cambia la forma de inicializar DataSources respecto a v0.2.x).
