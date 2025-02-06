CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombres TEXT NOT NULL,
    correo TEXT NOT NULL,
    celular TEXT NOT NULL,
    contrasenia TEXT NOT NULL
);