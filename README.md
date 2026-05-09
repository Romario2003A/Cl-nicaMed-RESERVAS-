# 🏥 ClínicaMed — Sistema Web de Reservas Médicas

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Licencia](https://img.shields.io/badge/licencia-MIT-lightgrey)

> Sistema web seguro para la gestión de citas médicas, desarrollado como proyecto parcial del curso de **Desarrollo de Aplicaciones Web**.

---

## 📋 Tabla de Contenidos


- [Descripción](#-descripción)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura-del-proyecto)
- [Instalación](#-instalación-y-configuración)
- [Base de Datos](#-base-de-datos)
- [Uso](#-uso)
- # [Equipo](#-equipo-de-desarrollo)
  | Nombre    | Rol                     |
  | --------- | ----------------------- |
  | Daniel    | Backend & Base de Datos |
  | Romario   | Frontend & CSS          |
  | David     | Seguridad & Middleware  |
  | Paolo     | Documentación & Testing |

## 📌 Descripción

**ClínicaMed** es una plataforma web que permite a los pacientes registrarse, iniciar sesión y reservar citas médicas con diferentes especialistas. El sistema implementa buenas prácticas de seguridad como hashing de contraseñas con **bcrypt**, validación de entradas y protección contra ataques comunes (XSS, SQL Injection).

### ✨ Funcionalidades principales

- ✅ Registro e inicio de sesión de pacientes
- ✅ Visualización de especialidades médicas disponibles
- ✅ Reserva de citas con fecha, hora y motivo de consulta
- ✅ Historial de citas por paciente
- ✅ Cancelación de citas pendientes
- ✅ Panel de perfil del usuario
- ✅ Validación de formularios en el cliente y el servidor

---

## 🛠 Tecnologías

| Capa              | Tecnología                         | Versión |
| ----------------- | ---------------------------------- | ------- |
| **Frontend**      | HTML5, CSS3, JavaScript (Vanilla)  | —       |
| **Backend**       | Node.js + Express.js               | v18+    |
| **Base de Datos** | MySQL                              | 8.0     |
| **Seguridad**     | bcrypt, express-validator, dotenv  | —       |
| **Arquitectura**  | MVC (Modelo - Vista - Controlador) | —       |

---

## 📁 Arquitectura del Proyecto

```
ClínicaMed/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Conexión MySQL (Patrón Singleton)
│   │   ├── controllers/
│   │   │   ├── usuario.controller.js
│   │   │   └── reserva.controller.js
│   │   ├── middlewares/
│   │   │   └── validacion.middleware.js  # Sanitización XSS/SQLi
│   │   ├── models/
│   │   │   ├── Usuario.js            # POO + bcrypt
│   │   │   ├── Reserva.js
│   │   │   └── Servicio.js
│   │   └── routes/
│   │       ├── usuario.routes.js
│   │       └── reserva.routes.js
│   ├── .env                          # Variables de entorno (no incluido en git)
│   ├── package.json
│   └── server.js                     # Punto de entrada del servidor
└── frontend/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── app.js                    # Lógica del cliente (fetch, validaciones)
    └── index.html                    # SPA principal
```

---

## ⚙ Instalación y Configuración

### Requisitos previos

Asegúrate de tener instalado en tu sistema:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) 8.0
- npm (incluido con Node.js)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/Romario2003A/Cl-nicaMed-RESERVAS-.git
cd Cl-nicaMed-RESERVAS-
```

**2. Instalar dependencias del backend**

```bash
cd backend
npm install
```

**3. Configurar variables de entorno**

Crea un archivo `.env` dentro de la carpeta `backend/` con el siguiente contenido:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=sistema_reservas
JWT_SECRET=clave_super_secreta_reservas_2024
NODE_ENV=development
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Ya está incluido en el `.gitignore`.

**4. Configurar la base de datos**

Ejecuta el siguiente script en **MySQL Workbench** o tu cliente preferido:

```sql
CREATE DATABASE IF NOT EXISTS sistema_reservas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sistema_reservas;

CREATE TABLE IF NOT EXISTS usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,
    dni         VARCHAR(20),
    telefono    VARCHAR(20),
    rol         ENUM('admin', 'paciente') DEFAULT 'paciente',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS especialidades (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    descripcion       TEXT,
    duracion_minutos  INT NOT NULL,
    precio            DECIMAL(10,2) NOT NULL,
    icono             VARCHAR(50),
    activo            BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS reservas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id       INT NOT NULL,
    especialidad_id  INT NOT NULL,
    fecha            DATE NOT NULL,
    hora             TIME NOT NULL,
    estado           ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    motivo           TEXT,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

INSERT INTO especialidades (nombre, descripcion, duracion_minutos, precio, icono) VALUES
('Medicina General', 'Consulta médica general y diagnóstico básico', 30, 80.00, '🩺'),
('Odontología',      'Limpieza dental, caries y tratamientos bucales', 45, 120.00, '🦷'),
('Pediatría',        'Atención médica especializada para niños', 30, 90.00, '👶'),
('Psicología',       'Sesiones de salud mental y bienestar emocional', 60, 150.00, '🧠'),
('Cardiología',      'Evaluación y diagnóstico del sistema cardiovascular', 45, 200.00, '❤️'),
('Nutrición',        'Planes alimenticios y control de peso', 40, 100.00, '🥗');
```

**5. Iniciar el servidor**

```bash
node server.js
```

**6. Abrir en el navegador**

```
http://localhost:3000
```

---

## 🗃 Base de Datos

### Diagrama de tablas

```
usuarios          especialidades        reservas
─────────         ──────────────        ────────
id (PK)           id (PK)               id (PK)
nombre            nombre                usuario_id (FK)
email             descripcion           especialidad_id (FK)
password          duracion_minutos      fecha
dni               precio                hora
telefono          icono                 estado
rol               activo                motivo
created_at                              created_at
```

---

## 🚀 Uso

1. Abre `http://localhost:3000` en tu navegador.
2. Regístrate como nuevo paciente.
3. Inicia sesión con tu correo y contraseña.
4. Selecciona una especialidad, fecha y hora para reservar tu cita.
5. Consulta tu historial en la pestaña **"Mis Citas"**.
6. Cancela citas pendientes si es necesario.

---

## 👥 Equipo de Desarrollo

| Nombre  | Usuario GitHub                                   | Rol                     |
| ------- | ------------------------------------------------ | ----------------------- |
| Daniel  | [@JoosX](https://github.com/JoosX)               | Backend & Base de Datos |
| Romario | [@Romario2003A](https://github.com/Romario2003A) | Frontend & CSS          |
| David   | [@METAGROSSP](https://github.com/METAGROSSP)     | Seguridad & Middleware  |
| Paolo   | [@Devoldt1998](https://github.com/Devoldt1998)   | Documentación & Testing |

---

## 📄 Licencia

Este proyecto fue desarrollado con fines académicos para el curso de **Desarrollo de Aplicaciones Web**.

---

<p align="center">Hecho con ❤️ por el equipo ClínicaMed</p>
