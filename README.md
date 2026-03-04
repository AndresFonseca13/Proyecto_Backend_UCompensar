# Proyecto Backend UCompensar — Marketplace de Tecnología

API REST construida con **NestJS 11**, **Prisma ORM** y **PostgreSQL**, diseñada como un marketplace de productos tecnológicos. Permite gestionar usuarios, publicaciones de productos, marcas, comentarios y likes, con autenticación basada en JWT.

---

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Modelo de datos](#modelo-de-datos)
- [Módulos y funcionalidades](#módulos-y-funcionalidades)
- [Endpoints de la API](#endpoints-de-la-api)
- [Requisitos previos](#requisitos-previos)
- [Archivos que debes crear](#archivos-que-debes-crear)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Documentación Swagger](#documentación-swagger)

---

## Arquitectura

El proyecto sigue una **arquitectura limpia por capas**:

```
src/
├── auth/                  # Autenticación JWT (login, guard, profile)
├── user/                  # Gestión de usuarios
│   ├── domain/            # Entidades, repositorios (interfaces), value objects
│   ├── infraestructure/   # Implementación Prisma del repositorio
│   ├── use-cases/         # Casos de uso (crear, obtener, actualizar, eliminar)
│   └── dto/               # Data Transfer Objects con validación
├── publication/           # Publicaciones de productos
├── brand/                 # Marcas de productos
├── comment/               # Comentarios en publicaciones
├── like/                  # Likes en publicaciones (módulo deshabilitado)
└── prisma/                # Módulo global de Prisma (PrismaService)
```

Cada módulo de dominio implementa el patrón **Repository** con interfaces en `domain/` e implementaciones con Prisma en `infraestructure/`, conectados mediante **casos de uso** independientes.

---

## Tecnologías

| Tecnología | Versión | Propósito |
|---|---|---|
| NestJS | 11.x | Framework backend |
| Prisma | 6.x | ORM y migraciones |
| PostgreSQL | 15 | Base de datos |
| JWT | - | Autenticación |
| bcrypt | 6.x | Hash de contraseñas |
| Swagger | 11.x | Documentación de API |
| Docker | - | Contenedor de PostgreSQL |
| pnpm | 10.x | Gestor de paquetes |

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
| **User** | id, email (único), name, password, rol, photo, description, city, createdAt |
| **Publication** | id, name, description, img, price, brandId, userId, createAt |
| **Brand** | id, name (único), createAt |
| **Comment** | id, content, userId, publicationId, createdAt |
| **Like** | id, userId, publicationId, Isliked, createdAt (único: userId + publicationId) |

---

## Módulos y funcionalidades

| Módulo | Estado | Descripción |
|---|---|---|
| **AuthModule** | Activo | Login con email/password, generación de JWT (1h), guard de autenticación, perfil protegido |
| **UsersModule** | Activo | CRUD completo de usuarios con value objects (Email, Password, Rol) |
| **PublicationModule** | Activo | CRUD de publicaciones de productos tecnológicos, relación con Brand y User |
| **BrandModule** | Activo | CRUD de marcas de productos |
| **CommentModule** | Activo | Crear, listar y eliminar comentarios en publicaciones |
| **LikeModule** | Deshabilitado | Sistema de likes (código presente pero no registrado en AppModule) |
| **PrismaModule** | Activo (global) | Servicio compartido de conexión a base de datos |

---

## Endpoints de la API

### Auth

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/login` | No | Iniciar sesión (devuelve `access_token` y datos del usuario) |
| GET | `/auth/profile` | Sí | Verificar token y obtener perfil |

### Users

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/users` | Sí | Listar todos los usuarios |
| GET | `/users/:id` | No | Obtener usuario por ID |
| POST | `/users` | No | Registrar nuevo usuario |
| PATCH | `/users/:id` | No | Actualizar usuario |
| DELETE | `/users/:id` | No | Eliminar usuario |

### Publications

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/publication` | Sí | Listar publicaciones (query param: `userId`) |
| GET | `/publication/:id` | No | Obtener publicación por ID |
| POST | `/publication` | No | Crear publicación |
| PATCH | `/publication/:id` | No | Actualizar publicación |
| DELETE | `/publication/:id` | No | Eliminar publicación |

### Brands

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/brand` | No | Listar marcas |
| GET | `/brand/:id` | No | Obtener marca por ID |
| POST | `/brand` | No | Crear marca |
| PATCH | `/brand/:id` | No | Actualizar marca |
| DELETE | `/brand/:id` | No | Eliminar marca |

### Comments

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/comment` | Sí | Listar comentarios (query param: `publicationId`) |
| GET | `/comment/:id` | No | Obtener comentario por ID |
| POST | `/comment` | No | Crear comentario |
| DELETE | `/comment/:id` | No | Eliminar comentario |

---

## Requisitos previos

- **Node.js** >= 20
- **pnpm** >= 10 (`npm install -g pnpm`)
- **Docker** y **Docker Compose** (para la base de datos PostgreSQL)

---

## Archivos que debes crear

### 1. Archivo `.env`

Debes crear un archivo `.env` dentro de la carpeta `Backend_app_tec/` con el siguiente contenido:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5436/app_cars"
PORT=3000
```

> Este archivo es necesario para que Prisma se conecte a la base de datos y para definir el puerto del servidor. **No está incluido en el repositorio** por razones de seguridad (.gitignore).

---

## Instalación y ejecución

Todos los comandos se ejecutan desde la carpeta `Backend_app_tec/`.

```bash
cd Backend_app_tec
```

### 1. Levantar la base de datos con Docker

```bash
docker compose up -d
```

Esto inicia un contenedor de PostgreSQL 15 con:
- **Usuario:** `postgres`
- **Contraseña:** `postgres`
- **Base de datos:** `app_cars`
- **Puerto:** `5436` (host) → `5432` (contenedor)

Para verificar que el contenedor está corriendo:

```bash
docker ps
```

Para detener la base de datos:

```bash
docker compose down
```

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Generar el cliente de Prisma

```bash
pnpm prisma generate
```

### 4. Ejecutar las migraciones de base de datos

```bash
pnpm prisma migrate dev
```

> Esto crea las tablas necesarias en PostgreSQL según el schema de Prisma.

### 5. Iniciar el servidor en modo desarrollo

```bash
pnpm run start:dev
```

El servidor estará disponible en `http://localhost:3000`.

### Resumen rápido (todos los pasos)

```bash
cd Backend_app_tec
docker compose up -d
pnpm install
pnpm prisma generate
pnpm prisma migrate dev
pnpm run start:dev
```

### Otros comandos útiles

| Comando | Descripción |
|---|---|
| `pnpm run start` | Iniciar en modo producción |
| `pnpm run start:debug` | Iniciar con debugger |
| `pnpm run build` | Compilar el proyecto |
| `pnpm run lint` | Ejecutar linter (ESLint) |
| `pnpm run format` | Formatear código (Prettier) |
| `pnpm run test` | Ejecutar tests unitarios |
| `pnpm run test:e2e` | Ejecutar tests end-to-end |
| `pnpm run test:cov` | Tests con reporte de cobertura |
| `pnpm prisma studio` | Abrir Prisma Studio (GUI para la BD) |

---

## Documentación Swagger

Una vez que el servidor esté corriendo, la documentación interactiva de la API está disponible en:

```
http://localhost:3000/api
```

Desde allí puedes probar todos los endpoints directamente desde el navegador.

---

## CORS

El backend está configurado para aceptar peticiones desde `http://localhost:5173` (frontend React/Vite). Si el frontend corre en otro puerto, se debe actualizar la configuración en `src/main.ts`.
