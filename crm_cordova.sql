-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2025 a las 22:33:38
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `crm_cordova`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agenda_actividades`
--

CREATE TABLE `agenda_actividades` (
  `id_agenda` int(11) NOT NULL,
  `titulo_actividad` text NOT NULL,
  `fecha_actividad` date NOT NULL,
  `hora_actividad` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes_leads`
--

CREATE TABLE `clientes_leads` (
  `id_cliente` int(11) NOT NULL,
  `nombre_cliente` text NOT NULL,
  `id_estado` int(11) NOT NULL,
  `id_planes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes_leads`
--

INSERT INTO `clientes_leads` (`id_cliente`, `nombre_cliente`, `id_estado`, `id_planes`) VALUES
(1, 'Jorge Riel', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados`
--

CREATE TABLE `estados` (
  `id_estados` int(11) NOT NULL,
  `tipo_estado` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estados`
--

INSERT INTO `estados` (`id_estados`, `tipo_estado`) VALUES
(1, 'Frío'),
(2, 'Tibio'),
(3, 'Caliente'),
(4, 'Cliente Perdido');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gestion_datos`
--

CREATE TABLE `gestion_datos` (
  `id_datos` int(11) NOT NULL,
  `nombre_dato` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id_planes` int(11) NOT NULL,
  `Tipo_plan` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id_planes`, `Tipo_plan`) VALUES
(1, 'Plan Básico'),
(2, 'Plan Pro'),
(3, 'Plan Premium');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL UNIQUE,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agenda_actividades`
--
ALTER TABLE `agenda_actividades`
  ADD PRIMARY KEY (`id_agenda`);

--
-- Indices de la tabla `clientes_leads`
--
ALTER TABLE `clientes_leads`
  ADD PRIMARY KEY (`id_cliente`),
  ADD KEY `fk_estados` (`id_estado`),
  ADD KEY `fk_planes` (`id_planes`);

--
-- Indices de la tabla `estados`
--
ALTER TABLE `estados`
  ADD PRIMARY KEY (`id_estados`);

--
-- Indices de la tabla `gestion_datos`
--
ALTER TABLE `gestion_datos`
  ADD PRIMARY KEY (`id_datos`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id_planes`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agenda_actividades`
--
ALTER TABLE `agenda_actividades`
  MODIFY `id_agenda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes_leads`
--
ALTER TABLE `clientes_leads`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `estados`
--
ALTER TABLE `estados`
  MODIFY `id_estados` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `gestion_datos`
--
ALTER TABLE `gestion_datos`
  MODIFY `id_datos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id_planes` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clientes_leads`
--
ALTER TABLE `clientes_leads`
  ADD CONSTRAINT `clientes_leads_ibfk_2` FOREIGN KEY (`id_planes`) REFERENCES `planes` (`id_planes`),
  ADD CONSTRAINT `clientes_leads_ibfk_3` FOREIGN KEY (`id_estado`) REFERENCES `estados` (`id_estados`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
