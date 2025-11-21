--
-- Script para crear y mantener la tabla de ranking (`top_ranking`)
--

--
-- 1. Estructura para la tabla `top_ranking`
--
-- Esta tabla almacenará una copia de los datos relevantes de los usuarios para el ranking.
-- Se mantiene actualizada automáticamente mediante triggers.
--

DROP TABLE IF EXISTS `top_ranking`;
CREATE TABLE `top_ranking` (
  `id_user_FK` int(11) NOT NULL,
  `u_name` varchar(30) NOT NULL,
  `max_score` int(11) NOT NULL,
  PRIMARY KEY (`id_user_FK`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- 2. Triggers para sincronizar `users` con `top_ranking`
--

-- Se ejecuta después de que un nuevo usuario es insertado.
DROP TRIGGER IF EXISTS `after_users_insert`;
DELIMITER $$
CREATE TRIGGER `after_users_insert` AFTER INSERT ON `users` FOR EACH ROW BEGIN
    INSERT INTO `top_ranking` (id_user_FK, u_name, max_score)
    VALUES (NEW.id_user_PK, NEW.u_name, COALESCE(NEW.max_score, 0));
END$$
DELIMITER ;

-- Se ejecuta después de que los datos de un usuario son actualizados.
-- Solo actúa si el puntaje máximo o el nombre han cambiado.
DROP TRIGGER IF EXISTS `after_users_update`;
DELIMITER $$
CREATE TRIGGER `after_users_update` AFTER UPDATE ON `users` FOR EACH ROW BEGIN
    IF OLD.max_score <> NEW.max_score OR OLD.u_name <> NEW.u_name THEN
        UPDATE `top_ranking`
        SET u_name = NEW.u_name, max_score = COALESCE(NEW.max_score, 0)
        WHERE id_user_FK = NEW.id_user_PK;
    END IF;
END$$
DELIMITER ;

-- Se ejecuta después de que un usuario es eliminado.
DROP TRIGGER IF EXISTS `after_users_delete`;
DELIMITER $$
CREATE TRIGGER `after_users_delete` AFTER DELETE ON `users` FOR EACH ROW BEGIN
    DELETE FROM `top_ranking` WHERE id_user_FK = OLD.id_user_PK;
END$$
DELIMITER ;