# Medicamentos PWA - API de Autenticación

API REST para la gestión de autenticación de usuarios en una aplicación PWA de medicamentos, construida con NestJS, Prisma y MySQL.

## 🚀 Características

- ✅ Autenticación JWT completa
- ✅ Registro y login de usuarios
- ✅ Validación de datos con class-validator
- ✅ Base de datos MySQL con Prisma ORM
- ✅ TypeScript para type safety
- ✅ Guards de autenticación
- ✅ Validación de tokens JWT

## 📋 Prerrequisitos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clona el repositorio:**

```bash
git clone <url-del-repositorio>
cd medicamentos-pwa
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura la base de datos:**

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita el archivo .env con tus configuraciones
nano .env
```

4. **Configura Prisma:**

```bash
# Genera el cliente de Prisma
npx prisma generate

# Ejecuta las migraciones
npx prisma migrate dev --name init
```

5. **Inicia el servidor:**

```bash
# Modo desarrollo
npm run start:dev

# Modo producción
npm run start:prod
```

## 📚 API Endpoints

### Autenticación

| Método | Endpoint         | Descripción                                         |
| ------ | ---------------- | --------------------------------------------------- |
| POST   | `/auth/register` | Registrar nuevo usuario                             |
| POST   | `/auth/login`    | Iniciar sesión                                      |
| GET    | `/auth/profile`  | Obtener perfil del usuario (requiere autenticación) |

### Ejemplos de uso

**Registro:**

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123",
    "name": "Nombre Usuario"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@example.com",
    "password": "password123"
  }'
```

**Perfil (con token):**

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🏗️ Estructura del Proyecto

```txt
src/
├── auth/
│   ├── dto/
│   │   ├── login-auth.dto.ts      # DTO para login
│   │   └── register-auth.dto.ts   # DTO para registro
│   ├── auth.controller.ts         # Controlador de autenticación
│   ├── auth.service.ts            # Lógica de negocio
│   ├── auth.module.ts             # Módulo de autenticación
│   ├── jwt.strategy.ts            # Estrategia JWT de Passport
│   └── jwt-auth.guard.ts          # Guard para proteger rutas
├── prisma/
│   └── schema.prisma              # Esquema de base de datos
└── app.module.ts                  # Módulo principal
```

## 🔐 Seguridad

- **JWT**: Tokens con expiración de 24 horas
- **Hash de contraseñas**: bcrypt con 12 salt rounds
- **Validación de entrada**: class-validator para sanitización
- **Guards**: Protección automática de rutas con JWT

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## 📝 Variables de Entorno

| Variable         | Descripción             | Valor por defecto |
| ---------------- | ----------------------- | ----------------- |
| `DATABASE_URL`   | URL de conexión a MySQL | -                 |
| `JWT_SECRET`     | Clave secreta para JWT  | -                 |
| `JWT_EXPIRATION` | Expiración del token    | 7d                |

## 🤝 Contribución

Si deseas contribuir en esta API, deberás hacier lo siguiente:

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 🆘 Soporte

Si tienes problemas o preguntas, por favor abre un issue en GitHub.
