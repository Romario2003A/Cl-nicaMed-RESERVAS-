# 🏥 ClínicaMed — Sistema Web de Reservas Médicas

Sistema web seguro para la gestión de citas médicas, desarrollado como proyecto parcial del curso de Desarrollo de Aplicaciones Web.

---

## 👥 Integrantes

| Nombre | Rol |
|--------|-----|
<<<<<<< HEAD
| Romario | Backend & Base de Datos |
| Integrante 2 | Frontend & CSS |
| Integrante 3 | Seguridad & Middleware |
| Integrante 4 | Documentación & Testing |
=======
| Daniel | Backend & Base de Datos |
| Romario 2 | Frontend & CSS |
| David  3 | Seguridad & Middleware |
| Paolo 4 | Documentación & Testing |
>>>>>>> 1fe38186ac011e214831b5fce26f21fa02881468

---

## 🛠 Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla JS) |
| Backend | Node.js + Express.js |
| Base de Datos | MySQL 8.0 |
| Seguridad | bcrypt, express-validator, dotenv |
| Arquitectura | MVC (Modelo - Vista - Controlador) |



## ⚙️ Requisitos previos

Asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://www.mysql.com/) 8.0
- npm (incluido con Node.js)

---

 🚀 Instrucciones para levantar el proyecto

 1. Clonar el repositorio

```bash
git clone https://github.com/Romario2003A/Cl-nicaMed-RESERVAS-.git
cd Cl-nicaMed-RESERVAS-
```

 2. Crear la base de datos

Abre MySQL Workbench y ejecuta el siguiente script:

```sql
CREATE DATABASE IF NOT EXISTS sistema_reservas;
USE sistema_reservas;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    dni VARCHAR(20),
    telefono VARCHAR(20),
    rol ENUM('admin', 'paciente') DEFAULT 'paciente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE especialidades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_minutos INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    icono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    especialidad_id INT NOT NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    motivo TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

INSERT INTO especialidades (nombre, descripcion, duracion_minutos, precio, icono) VALUES
('Medicina General', 'Consulta médica general y diagnóstico básico', 30, 80.00, '🩺'),
('Odontología', 'Limpieza dental, caries y tratamientos bucales', 45, 120.00, '🦷'),
('Pediatría', 'Atención médica especializada para niños', 30, 90.00, '👶'),
('Psicología', 'Sesiones de salud mental y bienestar emocional', 60, 150.00, '🧠'),
('Cardiología', 'Evaluación y diagnóstico del sistema cardiovascular', 45, 200.00, '❤️'),
('Nutrición', 'Planes alimenticios y control de peso', 40, 100.00, '🥗');
```

3. Configurar variables de entorno

Dentro de la carpeta `backend/` crea un archivo `.env`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=sistema_reservas
JWT_SECRET=clave_super_secreta_reservas_2024
NODE_ENV=development
```
 4. Instalar dependencias

```bash
cd backend
npm install
```

 5. Iniciar el servidor

```bash
node server.js
```


 6. Abrir en el navegador


