# Proyecto UCompensar — Marketplace de Tecnología

Aplicación full-stack de un marketplace de productos tecnológicos, compuesta por una **API REST** (NestJS + Prisma + PostgreSQL) y un **frontend SPA** (React + Vite + Tailwind CSS). Permite gestionar usuarios, publicaciones de productos, marcas, comentarios y likes, con autenticación JWT y sistema de roles.

---

## Tabla de contenidos

- [Estructura del proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Modelo de datos](#modelo-de-datos)
- [Requisitos previos](#requisitos-previos)
- [Instalación del Backend](#instalación-del-backend)
  - [1. Configurar variables de entorno](#1-configurar-variables-de-entorno)
  - [2. Levantar PostgreSQL con Docker](#2-levantar-postgresql-con-docker)
  - [3. Instalar dependencias del backend](#3-instalar-dependencias-del-backend)
  - [4. Configurar Prisma y base de datos](#4-configurar-prisma-y-base-de-datos)
  - [5. Cargar datos de prueba (Seed)](#5-cargar-datos-de-prueba-seed)
  - [6. Iniciar el servidor backend](#6-iniciar-el-servidor-backend)
- [Instalación del Frontend](#instalación-del-frontend)
  - [1. Instalar dependencias del frontend](#1-instalar-dependencias-del-frontend)
  - [2. Iniciar el servidor frontend](#2-iniciar-el-servidor-frontend)
- [Resumen rápido — Todo el proyecto](#resumen-rápido--todo-el-proyecto)
- [Datos de prueba y credenciales](#datos-de-prueba-y-credenciales)
- [Backend — Arquitectura y módulos](#backend--arquitectura-y-módulos)
- [Backend — Endpoints de la API](#backend--endpoints-de-la-api)
- [Backend — Ejemplos de uso con curl](#backend--ejemplos-de-uso-con-curl)
- [Frontend — Arquitectura y componentes](#frontend--arquitectura-y-componentes)
- [Frontend — Páginas y rutas](#frontend--páginas-y-rutas)
- [Frontend — Autenticación y estado](#frontend--autenticación-y-estado)
- [Comandos útiles](#comandos-útiles)
- [Documentación Swagger](#documentación-swagger)
- [CORS](#cors)

---

## Estructura del proyecto

```
Proyecto_Backend_Ucompensar/
│
├── Backend_app_tec/              # API REST (NestJS)
│   ├── prisma/
│   │   ├── schema.prisma         # Esquema de base de datos
│   │   ├── seed.ts               # Datos iniciales de prueba
│   │   └── migrations/           # Historial de migraciones
│   ├── src/
│   │   ├── main.ts               # Bootstrap, CORS, Swagger
│   │   ├── app.module.ts         # Módulo raíz
│   │   ├── auth/                 # Autenticación JWT (login, guard)
│   │   ├── user/                 # Gestión de usuarios (CRUD, roles)
│   │   ├── publication/          # Publicaciones de productos
│   │   ├── brand/                # Marcas de productos
│   │   ├── comment/              # Comentarios en publicaciones
│   │   ├── like/                 # Sistema de likes (toggle)
│   │   └── prisma/               # PrismaService global
│   ├── docker-compose.yml        # PostgreSQL en Docker
│   ├── package.json
│   └── tsconfig.json
│
└── frontend_app_tec/             # SPA (React + Vite)
    ├── src/
    │   ├── main.tsx              # Punto de entrada
    │   ├── App.tsx               # Router y layout principal
    │   ├── index.css             # Estilos globales (Tailwind v4)
    │   ├── components/           # Componentes reutilizables
    │   │   ├── Login.tsx         # Formulario login/registro
    │   │   ├── Navbar.tsx        # Barra de navegación
    │   │   ├── ProductCard.tsx   # Tarjeta de producto
    │   │   ├── CreateProduct.tsx # Formulario crear producto
    │   │   └── CreateBrand.tsx   # Formulario crear marca
    │   ├── pages/                # Páginas/vistas
    │   │   ├── ProductCatalog.tsx # Catálogo de productos
    │   │   ├── ProductDetail.tsx  # Detalle con likes y comentarios
    │   │   ├── MyProducts.tsx     # Mis productos (admin)
    │   │   └── EditProduct.tsx    # Editar producto (admin)
    │   ├── context/
    │   │   └── AuthContext.tsx    # Contexto de autenticación
    │   ├── services/
    │   │   └── api.ts            # Cliente Axios con interceptor JWT
    │   └── types/
    │       └── index.ts          # Tipos TypeScript compartidos
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

---

## Tecnologías

### Backend

| Tecnología | Versión | Propósito |
|---|---|---|
| NestJS | 11.x | Framework backend |
| Prisma | 6.x | ORM y migraciones |
| PostgreSQL | 15 | Base de datos relacional |
| JWT (@nestjs/jwt) | 11.x | Autenticación con tokens |
| bcrypt | 6.x | Hash de contraseñas |
| Swagger | 11.x | Documentación interactiva de API |
| Docker / Docker Compose | - | Contenedor de PostgreSQL |
| pnpm | 10.x | Gestor de paquetes |
| TypeScript | 5.x | Lenguaje tipado |
| tsx | 4.x | Ejecución de TypeScript (seed) |

### Frontend

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 19.x | Librería de UI |
| Vite | 7.x | Bundler y dev server |
| TypeScript | 5.x | Tipado estático |
| Tailwind CSS | 4.x | Framework de estilos (utility-first) |
| React Router DOM | 7.x | Enrutamiento SPA |
| Axios | 1.x | Cliente HTTP para consumir la API |
| Lucide React | 0.5x | Iconos SVG |
| Motion (Framer Motion) | 12.x | Animaciones |
| npm | - | Gestor de paquetes |

---

## Modelo de datos

```
User (1) ──── (N) Publication (N) ──── (1) Brand
 │                    │
 │ (1:N)              │ (1:N)
 ├── Like ────────────┘
 └── Comment ─────────┘
```

| Modelo | Campos principales |
|---|---|
| **User** | id (UUID), email (único), name, password (bcrypt), rol (`user` \| `admin`), photo, description, city, createdAt |
| **Publication** | id (UUID), name, description, img, price (entero, COP), brandId, userId, createAt |
| **Brand** | id (UUID), name (único), createAt |
| **Comment** | id (UUID), content, userId, publicationId, createdAt |
| **Like** | id (UUID), userId, publicationId, Isliked, createdAt — constraint único: `[userId, publicationId]` |

### Sistema de roles

- **`user`**: Rol asignado automáticamente al registrarse. No requiere enviar el campo desde el frontend.
- **`admin`**: Solo se puede asignar modificando directamente la base de datos. No es posible cambiarlo desde la API.

---

## Requisitos previos

| Herramienta | Versión mínima | Instalación |
|---|---|---|
| **Node.js** | >= 20 | [nodejs.org](https://nodejs.org/) |
| **pnpm** | >= 10 | `npm install -g pnpm` |
| **npm** | >= 10 | Incluido con Node.js |
| **Docker** | Última estable | [docker.com](https://www.docker.com/) |
| **Docker Compose** | Incluido en Docker Desktop | Viene con Docker Desktop |

> **Nota:** El backend usa `pnpm` y el frontend usa `npm` como gestores de paquetes.

---

## Instalación del Backend

Todos los comandos de esta sección se ejecutan desde la carpeta `Backend_app_tec/`:

```bash
cd Backend_app_tec
```

### 1. Configurar variables de entorno

Crea un archivo `.env` dentro de `Backend_app_tec/`:

```bash
touch .env
```

Agrega el siguiente contenido:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5436/app_cars"
PORT=3000
```

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL. Formato: `postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/NOMBRE_BD` |
| `PORT` | Puerto en el que correrá el servidor NestJS (por defecto 3000) |

> Este archivo **no está incluido en el repositorio** por seguridad (está en `.gitignore`). Debes crearlo manualmente.

### 2. Levantar PostgreSQL con Docker

```bash
docker compose up -d
```

Esto crea y ejecuta un contenedor de PostgreSQL 15:

| Parámetro | Valor |
|---|---|
| **Imagen** | `postgres:15` |
| **Contenedor** | `postgres_db_cars` |
| **Usuario** | `postgres` |
| **Contraseña** | `postgres` |
| **Base de datos** | `app_cars` |
| **Puerto host** | `5436` |
| **Puerto contenedor** | `5432` |
| **Volumen** | `cars_volumen` (persistencia de datos) |

Para verificar que el contenedor está corriendo:

```bash
docker ps
```

### 3. Instalar dependencias del backend

```bash
pnpm install
```

### 4. Configurar Prisma y base de datos

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

El primer comando genera el cliente tipado de Prisma. El segundo crea las tablas en PostgreSQL.

> Si es la primera vez, Prisma te pedirá un nombre para la migración. Puedes dejarlo vacío o escribir `init`.

### 5. Cargar datos de prueba (Seed)

```bash
npx prisma db seed
```

Carga en la base de datos:
- **5 usuarios** (1 admin + 4 users)
- **7 marcas** de tecnología
- **20 publicaciones** de productos (celulares, portátiles, consolas, tablets, auriculares)

> El seed limpia todos los datos existentes antes de insertar los nuevos. Puedes ejecutarlo cuantas veces quieras para reiniciar la base de datos.

### 6. Iniciar el servidor backend

```bash
pnpm run start:dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## Instalación del Frontend

Todos los comandos de esta sección se ejecutan desde la carpeta `frontend_app_tec/`:

```bash
cd frontend_app_tec
```

### 1. Instalar dependencias del frontend

```bash
npm install
```

### 2. Iniciar el servidor frontend

```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

> **Importante:** El backend debe estar corriendo en `http://localhost:3000` para que el frontend pueda consumir la API correctamente.

---

## Resumen rápido — Todo el proyecto

```bash
# ── BACKEND ──
cd Backend_app_tec

# Crear archivo .env con:
#   DATABASE_URL="postgresql://postgres:postgres@localhost:5436/app_cars"
#   PORT=3000

docker compose up -d          # Levantar PostgreSQL
pnpm install                  # Instalar dependencias
pnpm prisma generate          # Generar cliente Prisma
pnpm prisma migrate dev       # Ejecutar migraciones
npx prisma db seed            # Cargar datos de prueba
pnpm run start:dev            # Iniciar backend en http://localhost:3000

# ── FRONTEND (en otra terminal) ──
cd frontend_app_tec
npm install                   # Instalar dependencias
npm run dev                   # Iniciar frontend en http://localhost:5173
```

---

## Datos de prueba y credenciales

Después de ejecutar el seed, la base de datos contiene los siguientes datos:

### Usuarios

> **Contraseña para todos los usuarios:** `123456`

| Nombre | Email | Rol | Ciudad | Descripción |
|---|---|---|---|---|
| Andres Fonseca | `admin@gmail.com` | **admin** | Bogotá | Administrador de la plataforma |
| Maria García | `maria@gmail.com` | user | Medellín | Apasionada por la tecnología y los gadgets |
| Carlos López | `carlos@gmail.com` | user | Cali | Gamer y entusiasta de hardware |
| Laura Martínez | `laura@gmail.com` | user | Barranquilla | Desarrolladora y amante de Apple |
| Diego Rodríguez | `diego@gmail.com` | user | Cartagena | Fotógrafo y creador de contenido tech |

### Marcas

Apple, Samsung, Sony, Lenovo, Asus, Xiaomi, Nintendo

### Publicaciones (20 productos de tecnología)

| Producto | Marca | Precio (COP) | Categoría |
|---|---|---|---|
| iPhone 15 Pro Max | Apple | $5.199.000 | Celular |
| MacBook Air M3 | Apple | $5.799.000 | Portátil |
| iPad Pro M4 12.9" | Apple | $4.500.000 | Tablet |
| Samsung Galaxy S24 Ultra | Samsung | $4.899.000 | Celular |
| Samsung Galaxy Tab S9 FE | Samsung | $1.799.000 | Tablet |
| Samsung Galaxy Book4 Pro | Samsung | $5.299.000 | Portátil |
| PlayStation 5 Slim | Sony | $2.299.000 | Consola |
| Sony WH-1000XM5 | Sony | $1.499.000 | Auriculares |
| Sony Xperia 1 VI | Sony | $4.199.000 | Celular |
| Lenovo ThinkPad X1 Carbon | Lenovo | $6.200.000 | Portátil |
| Lenovo Legion Pro 5 16" | Lenovo | $7.500.000 | Portátil Gaming |
| Lenovo Tab P12 Pro | Lenovo | $2.100.000 | Tablet |
| ASUS ROG Phone 8 Pro | Asus | $3.900.000 | Celular Gaming |
| ASUS ZenBook 14 OLED | Asus | $4.200.000 | Portátil |
| ASUS ROG Strix G16 | Asus | $5.800.000 | Portátil Gaming |
| Xiaomi 14 Ultra | Xiaomi | $3.200.000 | Celular |
| Xiaomi Redmi Note 13 Pro+ | Xiaomi | $1.350.000 | Celular |
| Nintendo Switch OLED | Nintendo | $1.799.000 | Consola |
| Nintendo Switch Lite | Nintendo | $899.000 | Consola |

---

## Backend — Arquitectura y módulos

El backend sigue una **arquitectura limpia por capas** (Clean Architecture). Cada módulo separa dominio, infraestructura y casos de uso:

```
src/modulo/
├── domain/
│   ├── entity/          # Entidades de dominio
│   ├── repositories/    # Interfaces de repositorio
│   └── value-objects/   # Objetos de valor (Email, Password)
├── infraestructure/
│   └── prisma-*.repository.ts   # Implementación con Prisma
├── use-cases/           # Casos de uso independientes
├── dto/                 # Data Transfer Objects con validación
├── *.controller.ts      # Controlador HTTP
└── *.module.ts          # Módulo NestJS
```

### Módulos

| Módulo | Estado | Descripción |
|---|---|---|
| **AuthModule** | Activo | Login con email/password, generación de JWT (1h de expiración), guard de autenticación. Retorna `access_token` + datos del usuario con rol. |
| **UsersModule** | Activo | CRUD de usuarios. Registro con asignación automática de rol `user`. Value objects para Email y Password. |
| **PublicationModule** | Activo | CRUD de publicaciones. Incluye `likesCount` y `commentsCount` calculados. Relación con Brand y User (autor). |
| **BrandModule** | Activo | CRUD de marcas de productos. |
| **CommentModule** | Activo | Crear, listar y eliminar comentarios en publicaciones. |
| **LikeModule** | Activo | Sistema de likes con endpoint de toggle (dar/quitar like). Protección contra duplicados. |
| **PrismaModule** | Activo (global) | Servicio compartido de conexión a base de datos. |

---

## Backend — Endpoints de la API

### Auth

| Método | Ruta | Auth | Body / Params | Descripción |
|---|---|---|---|---|
| POST | `/auth/login` | No | `{ email, password }` | Iniciar sesión. Retorna `access_token` y datos del usuario con rol. |
| GET | `/auth/profile` | Bearer Token | - | Verificar token y obtener perfil. |

**Respuesta de login:**

```json
{
  "access_token": "eyJhbGciOi...",
  "user": {
    "id": "uuid",
    "name": "Andres Fonseca",
    "email": "admin@gmail.com",
    "rol": "admin"
  }
}
```

### Users

| Método | Ruta | Auth | Body / Params | Descripción |
|---|---|---|---|---|
| GET | `/users` | Bearer Token | - | Listar todos los usuarios. |
| GET | `/users/:id` | No | `:id` (UUID) | Obtener usuario por ID. |
| POST | `/users` | No | `{ email, name, password, photo?, description?, city? }` | Registrar nuevo usuario (rol `user` automático). |
| PATCH | `/users/:id` | No | `{ email, name?, password?, photo?, description?, city? }` | Actualizar usuario (no permite cambiar rol). |
| DELETE | `/users/:id` | No | `:id` (UUID) | Eliminar usuario. |

### Publications

| Método | Ruta | Auth | Body / Params | Descripción |
|---|---|---|---|---|
| GET | `/publication` | Bearer Token | Query: `?userId=uuid` (opcional) | Listar publicaciones con `likesCount`, `commentsCount`, autor y marca. |
| GET | `/publication/:id` | No | `:id` (UUID) | Obtener publicación por ID. |
| POST | `/publication` | No | `{ name, description, img, price, brandId, userId }` | Crear publicación. |
| PATCH | `/publication/:id` | No | `{ name?, description?, img?, price?, brandId? }` | Actualizar publicación. |
| DELETE | `/publication/:id` | No | `:id` (UUID) | Eliminar publicación. |

### Brands

| Método | Ruta | Auth | Body / Params | Descripción |
|---|---|---|---|---|
| GET | `/brand` | No | - | Listar todas las marcas. |
| GET | `/brand/:id` | No | `:id` (UUID) | Obtener marca por ID. |
| POST | `/brand` | No | `{ name }` | Crear marca. |
| PATCH | `/brand/:id` | No | `{ name? }` | Actualizar marca. |
| DELETE | `/brand/:id` | No | `:id` (UUID) | Eliminar marca. |

### Comments

| Método | Ruta | Auth | Body / Params | Descripción |
|---|---|---|---|---|
| GET | `/comment` | Bearer Token | Query: `?publicationId=uuid` | Listar comentarios de una publicación. |
| GET | `/comment/:id` | No | `:id` (UUID) | Obtener comentario por ID. |
| POST | `/comment` | No | `{ content, userId, publicationId }` | Crear comentario. |
| DELETE | `/comment/:id` | No | `:id` (UUID) | Eliminar comentario. |

### Likes

| Método | Ruta | Auth | Body / Params | Descripción |
|---|---|---|---|---|
| **POST** | **`/like/toggle`** | **No** | `{ userId, publicationId }` | **Toggle de like** (dar o quitar like). Endpoint principal. |
| GET | `/like` | No | Query: `?publicationId=uuid` | Listar todos los likes de una publicación. |
| GET | `/like/:id` | No | `:id` (UUID) | Obtener un like por ID. |
| POST | `/like` | No | `{ userId, publicationId }` | Crear like (retorna 409 si ya existe). |
| PATCH | `/like/:id` | No | `{ Isliked }` | Actualizar un like. |
| DELETE | `/like/:id` | No | `:id` (UUID) | Eliminar un like. |

**Respuesta de toggle (dar like):**

```json
{
  "liked": true,
  "like": {
    "id": "uuid",
    "userId": "uuid",
    "Isliked": true,
    "publicationId": "uuid",
    "createdAt": "2026-03-07T..."
  }
}
```

**Respuesta de toggle (quitar like):**

```json
{
  "liked": false
}
```

---

## Backend — Ejemplos de uso con curl

### Registrar un usuario

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@gmail.com",
    "name": "Usuario Nuevo",
    "password": "123456"
  }'
```

### Iniciar sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "123456"
  }'
```

### Obtener publicaciones (con token)

```bash
curl http://localhost:3000/publication \
  -H "Authorization: Bearer <tu_access_token>"
```

### Dar / quitar like a una publicación

```bash
curl -X POST http://localhost:3000/like/toggle \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "<uuid_del_usuario>",
    "publicationId": "<uuid_de_la_publicacion>"
  }'
```

---

## Frontend — Arquitectura y componentes

El frontend es una **Single Page Application (SPA)** construida con React 19 y Vite 7. Usa Tailwind CSS v4 para estilos y React Router DOM v7 para navegación.

### Estructura

```
src/
├── components/           # Componentes reutilizables de UI
├── pages/                # Vistas/páginas completas
├── context/              # Estado global (React Context)
├── services/             # Comunicación con la API
├── types/                # Tipos TypeScript compartidos
├── App.tsx               # Router y protección de rutas
├── main.tsx              # Punto de entrada
└── index.css             # Tailwind CSS v4
```

### Componentes

| Componente | Descripción |
|---|---|
| `Login.tsx` | Formulario dual de login y registro. Alterna entre ambos modos. Al registrar, automáticamente hace login. |
| `Navbar.tsx` | Barra de navegación superior. Muestra opciones según rol (admin ve enlaces de gestión). Botón de logout. |
| `ProductCard.tsx` | Tarjeta de producto con imagen, nombre, marca, precio, botón de like y conteo. Usa animaciones con Motion. |
| `CreateProduct.tsx` | Formulario para crear un nuevo producto. Selecciona marca de un dropdown. Solo visible para admin. |
| `CreateBrand.tsx` | Formulario para crear una nueva marca. Solo visible para admin. |

### Páginas

| Página | Descripción |
|---|---|
| `ProductCatalog.tsx` | Catálogo principal. Muestra todos los productos en un grid con tarjetas. |
| `ProductDetail.tsx` | Vista detallada de un producto. Muestra likes, permite comentar y ver comentarios con foto y nombre del autor. |
| `MyProducts.tsx` | Lista de productos del usuario admin. Permite editar y eliminar. |
| `EditProduct.tsx` | Formulario de edición de un producto existente. |

### Comunicación con la API

El archivo `services/api.ts` configura un cliente Axios con:

- **Base URL:** `http://localhost:3000`
- **Interceptor de request:** Adjunta automáticamente el header `Authorization: Bearer <token>` si existe un token en `localStorage`.
- **Content-Type:** `application/json` por defecto.

### Tipos TypeScript

El archivo `types/index.ts` define los tipos compartidos:

| Tipo | Campos |
|---|---|
| `AuthUser` | id, name, email, rol |
| `Brand` | id, name, createAt |
| `Publication` | id, name, description, img, price, brandId, userId, createAt |
| `PublicationWithMeta` | Publication + author, brand, likesCount, commentsCount |
| `Like` | id, userId, publicationId, Isliked, createdAt |
| `Comment` | id, content, userId, publicationId, createdAt |

---

## Frontend — Páginas y rutas

| Ruta | Componente | Acceso | Descripción |
|---|---|---|---|
| `/` | `Login` | Público | Login y registro. Si ya está autenticado, redirige a `/catalog`. |
| `/catalog` | `ProductCatalog` | Autenticado | Catálogo de todos los productos con likes. |
| `/products/:id` | `ProductDetail` | Autenticado | Detalle del producto con comentarios y likes. |
| `/products/new` | `CreateProduct` | Admin | Crear un nuevo producto. |
| `/products/:id/edit` | `EditProduct` | Admin | Editar un producto existente. |
| `/brands/new` | `CreateBrand` | Admin | Crear una nueva marca. |
| `/my-products` | `MyProducts` | Admin | Ver, editar y eliminar mis productos. |

### Protección de rutas

- **Rutas públicas:** Solo `/` (login/registro).
- **Rutas autenticadas:** Requieren `isAuthenticated === true`. Si no, redirige a `/`.
- **Rutas admin:** Requieren `isAuthenticated === true` e `isAdmin === true` (`user.rol === "admin"`). Si no, redirige a `/catalog`.

---

## Frontend — Autenticación y estado

### AuthContext

El estado de autenticación se gestiona con **React Context** (`AuthContext`), disponible globalmente en toda la aplicación.

**Estado expuesto:**

| Propiedad | Tipo | Descripción |
|---|---|---|
| `user` | `AuthUser \| null` | Datos del usuario logueado (id, name, email, rol) |
| `isAuthenticated` | `boolean` | `true` si hay un usuario logueado |
| `isAdmin` | `boolean` | `true` si `user.rol === "admin"` |
| `login(data)` | `function` | Guarda token y usuario en `localStorage` y actualiza estado |
| `logout()` | `function` | Limpia `localStorage` y resetea estado |

**Almacenamiento persistente (localStorage):**

| Clave | Valor |
|---|---|
| `access_token` | JWT string |
| `auth_user` | Usuario serializado en JSON |

Al recargar la página, `AuthContext` lee `auth_user` de `localStorage` para restaurar la sesión sin necesidad de re-autenticarse.

### Flujo de login

1. El usuario ingresa email y password en el formulario.
2. Se envía `POST /auth/login` al backend.
3. El backend responde con `{ access_token, user: { id, name, email, rol } }`.
4. El frontend guarda ambos valores en `localStorage` y actualiza el contexto.
5. La aplicación redirige a `/catalog`.

### Flujo de registro

1. El usuario llena el formulario de registro (nombre, email, password, ciudad).
2. Se envía `POST /users` al backend (el rol `user` se asigna automáticamente).
3. Si el registro es exitoso, se ejecuta automáticamente el flujo de login.

---

## Comandos útiles

### Backend (desde `Backend_app_tec/`)

| Comando | Descripción |
|---|---|
| `pnpm run start:dev` | Iniciar en modo desarrollo (hot-reload) |
| `pnpm run start` | Iniciar en modo producción |
| `pnpm run start:debug` | Iniciar con debugger |
| `pnpm run build` | Compilar el proyecto |
| `pnpm run lint` | Ejecutar linter (ESLint) |
| `pnpm run format` | Formatear código (Prettier) |
| `pnpm run test` | Ejecutar tests unitarios |
| `pnpm run test:e2e` | Ejecutar tests end-to-end |
| `pnpm run test:cov` | Tests con reporte de cobertura |
| `pnpm prisma studio` | Abrir Prisma Studio (GUI para la BD) |
| `pnpm prisma generate` | Regenerar cliente Prisma |
| `pnpm prisma migrate dev` | Crear/ejecutar migraciones |
| `npx prisma db seed` | Cargar datos de prueba |
| `docker compose up -d` | Levantar PostgreSQL |
| `docker compose down` | Detener PostgreSQL |
| `docker compose down -v` | Detener PostgreSQL y borrar volumen de datos |

### Frontend (desde `frontend_app_tec/`)

| Comando | Descripción |
|---|---|
| `npm run dev` | Iniciar en modo desarrollo (hot-reload en `http://localhost:5173`) |
| `npm run build` | Compilar para producción (salida en `dist/`) |
| `npm run preview` | Previsualizar build de producción |
| `npm run lint` | Ejecutar linter (ESLint) |

---

## Documentación Swagger

Con el backend corriendo, la documentación interactiva de la API está disponible en:

```
http://localhost:3000/api
```

Desde allí puedes explorar y probar todos los endpoints directamente desde el navegador.

---

## CORS

El backend acepta peticiones desde `http://localhost:5173` (frontend Vite). Si el frontend corre en otro puerto, actualiza la configuración en `Backend_app_tec/src/main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});
```
