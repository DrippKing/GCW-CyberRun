-- Renombrado a 'comprar_buff' para coincidir con el script PHP.
-- Eliminado el procedimiento anterior si existe para evitar errores al volver a ejecutar el script.
DROP PROCEDURE IF EXISTS `comprar_buff`;

DELIMITER $$

CREATE PROCEDURE `comprar_buff`(
    IN `p_id_user` INT,
    IN `p_id_buff` INT
)
BEGIN
    -- Declaración de variables para almacenar datos
    DECLARE v_user_points INT;
    DECLARE v_buff_price INT;
    DECLARE v_buff_exists INT;

    -- Obtener los puntos actuales del usuario
    SELECT current_points INTO v_user_points FROM `users` WHERE id_user_PK = p_id_user;

    -- Obtener el precio del buff
    SELECT price INTO v_buff_price FROM `buffs` WHERE id_buff_PK = p_id_buff;

    -- [MEJORA] Verificar si el usuario ya tiene el buff para evitar compras duplicadas
    SELECT COUNT(*) INTO v_buff_exists FROM `users-buffs` WHERE id_user_FK = p_id_user AND id_buff_FK = p_id_buff;

    -- [MEJORA] Iniciar transacción para asegurar la integridad de los datos
    START TRANSACTION;

    -- Lógica de la compra
    IF v_buff_exists > 0 THEN
        -- El usuario ya tiene el buff. Devolvemos un error y revertimos cualquier cambio.
        SELECT FALSE AS success, 'Ya posees este glitch.' AS message;
        ROLLBACK;
    ELSEIF v_user_points >= v_buff_price THEN
        -- El usuario tiene suficientes puntos, proceder con la compra
        UPDATE users SET current_points = current_points - v_buff_price WHERE id_user_PK = p_id_user;
        INSERT INTO `users-buffs` (id_user_FK, id_buff_FK) VALUES (p_id_user, p_id_buff);
        COMMIT; -- Confirmar la transacción si todo fue bien
        SELECT TRUE AS success, 'Compra realizada con éxito.' AS message;
    ELSE
        -- El usuario no tiene suficientes puntos. Devolvemos un error y revertimos.
        SELECT FALSE AS success, 'No tienes suficientes datos para comprar este glitch.' AS message;
        ROLLBACK;
    END IF;
END$$

DELIMITER ;