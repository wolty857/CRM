-- Actualizar tabla users para añadir nombre completo y plan
ALTER TABLE `users` 
ADD COLUMN `nombre_completo` varchar(255) DEFAULT NULL AFTER `username`,
ADD COLUMN `plan` enum('básico','premium','empresarial') DEFAULT 'básico' AFTER `email`;

-- Insertar un usuario de prueba con plan
INSERT INTO users (username, nombre_completo, password_hash, email, plan) 
VALUES ('admin', 'Administrador del Sistema', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@cordovaia.com', 'premium')
ON DUPLICATE KEY UPDATE 
nombre_completo = 'Administrador del Sistema',
plan = 'premium';
