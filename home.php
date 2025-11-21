<?php session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cyber Run: Escape del Mainframe</title>
  <link rel="stylesheet" href="styles.css"> <!-- Ruta relativa, ¡correcto! -->
</head>
<body>

  <div id="contenedor-principal">  
    <div id="navbar">      
      <div class="user-info">
        <?php if (isset($_SESSION['user'])): ?>
            <img src="avatar-default.jpg" alt="Avatar" id="navbar-avatar">
            <span id="navbar-username"><?php echo htmlspecialchars($_SESSION['user']['u_name']); ?></span>
        <?php endif; ?>
      </div>
      
      <?php if (!isset($_SESSION['user'])): ?>
        <button id="navbar-login" class="btn" onclick="abrirLogin()">Iniciar Sesión</button>
      <?php else: ?>
        <a href="logout.php" id="navbar-logout" class="btn">Cerrar Sesión</a>
      <?php endif; ?>
    </div>


    <!-- Música y audios -->
    <audio id="musica-fondo" loop></audio> <!-- Ruta relativa, ¡correcto! -->
    <audio id="sonido-btn_Hover" src="Button-Sound.mp3"></audio> <!-- Ruta relativa, ¡correcto! -->
    <audio id="sonido-btn_Click" src="Select-button-sound(Fixed).mp3"></audio> <!-- Ruta relativa, ¡correcto! -->

    <!-- Pantalla de Inicio -->
    <section id="pantalla-inicio" class="pantalla activa">
      <div class="contenedor">
        <div id="titulos">
          <h1 class="titulo-juego">Cyber Run</h1>
          <h2 class="titulo-juego">Escape from the Mainframe</h2> 
        </div>

        <div class="menu">
          <button class="btn" onclick="seleccionarNivel()">Single Player</button>
          <button class="btn" onclick="seleccionarNivel('multijugador')">Multiplayer</button>
          <button class="btn" onclick="abrirTienda()">Tienda</button>
          <button class="btn" onclick="abrirRanking()">Ranking</button>
          <button id="btnTransmisiones" class="btn">Transmisiones</button>
          <button class="btn" onclick="abrirOpciones()">Opciones</button>
          <button class="btn salir" onclick="cerrarJuego()">Salir</button>
        </div>
      </div>

      <!-- Contenedor de Opciones -->
      <div id="menu-opciones" class="menu-opciones oculto">
        <h2>Opciones</h2>
        <div class="opcion">
          <label for="volumen-musica">Volumen Música:</label>
          <input type="range" id="volumen-musica" min="0" max="1" step="0.01" value="0.01">
        </div>
        <div class="opcion">
          <label for="volumen-sonidos">Volumen Efectos:</label>
          <input type="range" id="volumen-sonidos" min="0" max="1" step="0.01" value="1">
        </div>
        <button class="btn" id="btn-regresar">Regresar</button>
      </div>
    </section>

    <!-- Contenedor de Login -->
    <div id="menu-login" class="menu-opciones oculto">
      <h2>Iniciar Sesión</h2>
      <div class="opcion">
        <input type="text" id="login-usuario" placeholder="Usuario" class="input-login">
      </div>
      <div class="opcion">
        <input type="password" id="login-password" placeholder="Contraseña" class="input-login">
      </div>
      <p id="login-error" class="error-msg"></p>
      <button class="btn" id="btn-submit-login">Entrar</button>
      <hr style="margin: 12px 0; border-color: #555;">
      <button class="btn" id="btn-login-regresar">Regresar</button>
    </div>

    <!-- Contenedor de selector de niveles SinglePlayer -->
    <div id="menu-niveles-single" class="menu-niveles oculto">
      <h2>Selecciona un Nivel</h2>

      <div class="niveles">
        <button class="btn nivel" onclick="iniciarNivel(1, 'single')">Nivel 1</button>
        <button class="btn nivel" onclick="iniciarNivel(2, 'single')">Nivel 2</button>
        <button class="btn nivel" onclick="iniciarNivel(3, 'single')">Nivel 3</button>
      </div>

      <!-- Botón regresar a menú principal (faltaba) -->
      <div style="margin-top:16px;">
        <button class="btn" id="btn-niveles-regresar">Regresar</button>
      </div>
    </div>

    <!-- Contenedor de selección de dificultad -->
    <div id="menu-dificultad" class="menu-opciones oculto">
      <h2>Selecciona la Dificultad</h2>
      <div class="opcion">
        <p>Elige cómo quieres jugar este nivel:</p>
      </div>

      <div class="niveles">
        <button class="btn dificultad" onclick="iniciarNivelConDificultad('normal')">Normal</button>
        <button class="btn dificultad" onclick="iniciarNivelConDificultad('dificil')">Difícil</button>
      </div>

      <hr style="margin: 20px 0; border-color: #00ffe0;">

      <!-- Submenú de selección de glitch -->
      <h3>Selecciona un Glitch (opcional)</h3>
      <p style="font-size: 0.9rem; color: #aaa;">Solo puedes usar un glitch por run.</p>

      <div id="glitch-lista" class="lista-glitches">
        <!-- Los glitches desbloqueados se insertarán aquí dinámicamente -->
      </div>

      <p id="glitch-seleccionado" style="margin-top:10px; color:#00ffe0;">Ningún glitch seleccionado</p>

      <button class="btn" id="btn-dificultad-regresar">Regresar</button>
    </div>

    <!-- Contenedor de Ranking -->
    <div id="menu-ranking" class="menu-ranking oculto">
      <h2>Ranking</h2>
      <ul id="lista-ranking">
        <li>1. JugadorPro - 15000 pts</li>
        <li>2. NeoRunner - 12340 pts</li>
        <li>3. CyberX - 9870 pts</li>
        <li>4. ByteMaster - 8650 pts</li>
        <li>5. PixelHero - 7540 pts</li>
      </ul>
      <button class="btn" id="btn-ranking-regresar">Regresar</button>
    </div>

    <!-- Contenedor de Tienda -->
    <div id="menu-tienda" class="menu-tienda oculto">
      <h2>Tienda de Glitches</h2>
      <!-- Lista scrollable de glitches -->
      <div class="lista-perks">
        <?php
          // --- Configuración de la Base de Datos ---
          $db_host = 'localhost';
          $db_name = 'gcw_cyber_run';
          $db_user = 'root';
          $db_pass = '';

          try {
              $pdo = new PDO("mysql:host=$db_host;port=3307;dbname=$db_name;charset=utf8", $db_user, $db_pass);
              $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

              // --- OBTENER PUNTOS DEL USUARIO ---
              $current_points = 0;
              if (isset($_SESSION['user']) && isset($_SESSION['user']['id_user_PK'])) {
                  $stmt_user = $pdo->prepare("SELECT current_points FROM users WHERE id_user_PK = ?");
                  $stmt_user->execute([$_SESSION['user']['id_user_PK']]);
                  $user_data = $stmt_user->fetch(PDO::FETCH_ASSOC);
                  if ($user_data) {
                      $current_points = $user_data['current_points'];
                      $_SESSION['user']['current_points'] = $current_points; // Actualizar sesión
                  }
              }
              
              // --- MOSTRAR PUNTOS ---
              echo '<p class="datos-total">Datos disponibles: <span id="cantidad-datos">' . $current_points . '</span></p>';


              // --- OBTENER Y MOSTRAR BUFFS ---
              // 1. Obtener los IDs de los buffs que el usuario ya tiene
              $unlocked_buffs_ids = [];
              if (isset($_SESSION['user']) && isset($_SESSION['user']['id_user_PK'])) {
                  $stmt_unlocked = $pdo->prepare("SELECT id_buff_FK FROM `users-buffs` WHERE id_user_FK = ?");
                  $stmt_unlocked->execute([$_SESSION['user']['id_user_PK']]);
                  $unlocked_buffs_ids = $stmt_unlocked->fetchAll(PDO::FETCH_COLUMN, 0); // Obtiene solo la columna id_buff_FK
              }

              // 2. Obtener todos los buffs de la tienda
              $stmt = $pdo->prepare("SELECT id_buff_PK, nombre, descripcion, price, picture FROM buffs");
              $stmt->execute();
              $buffs = $stmt->fetchAll(PDO::FETCH_ASSOC);

              foreach ($buffs as $buff) {
                  $id_buff = $buff['id_buff_PK'];
                  $nombre = htmlspecialchars($buff['nombre']);
                  $descripcion = htmlspecialchars($buff['descripcion']);
                  $precio = htmlspecialchars($buff['price']);
                  $imagen = 'data:image/jpeg;base64,' . base64_encode($buff['picture']);

                  // 3. Determinar si el buff está desbloqueado
                  $esDesbloqueado = in_array($id_buff, $unlocked_buffs_ids);
                  $estado = $esDesbloqueado ? 'desbloqueado' : 'bloqueado';
                  $candado = $esDesbloqueado ? '' : '<div class="candado">🔒</div>';

                  echo "<div class='perk {$estado}' data-id='{$id_buff}' data-nombre='{$nombre}' data-descripcion='{$descripcion}' data-precio='{$precio}'>";
                  echo "  <div class='imagen-perk'>";
                  echo "    <img src='{$imagen}' alt='{$nombre}'>";
                  echo "    {$candado}";
                  echo "  </div>";
                  echo "  <p>{$nombre}</p>";
                  echo "</div>";
              }

          } catch (PDOException $e) {
              // Si la BD falla, al menos muestra los puntos que pueda haber en la sesión
              $current_points = $_SESSION['user']['current_points'] ?? 0;
              echo '<p class="datos-total">Datos disponibles: <span id="cantidad-datos">' . $current_points . '</span></p>';
              echo "Error al conectar con la base de datos para cargar la tienda: " . $e->getMessage();
          }
        ?>
      </div>

      <!-- Ventana de información del perk -->
      <div id="info-perk" class="info-perk oculto">
        <div class="contenido-info">
          <button id="cerrar-info" class="btn-cerrar">✖</button>
          <h3 id="info-nombre">Nombre del Glitch</h3>
          <img id="info-imagen" src="" alt="Imagen del glitch">
          <p id="info-descripcion">Descripción del glitch...</p>
          <p id="info-precio">Precio: 0 datos</p>
          <button id="btn-comprar" class="btn">Comprar</button>
        </div>
      </div>

      <button class="btn" id="btn-tienda-regresar">Regresar</button>
    </div>

    <!-- Contenedor de la Terminal de Transmisiones -->
    <div id="contenedor-transmisiones" class="contenedor-oculto">
      <div class="transmisiones-caja">
        <h2>Terminal de Transmisiones</h2>
        <p>Envía una señal a la red global 🌐</p>

        <textarea id="mensajeTransmision" placeholder="Escribe tu mensaje aquí..." maxlength="200"></textarea>

        <div class="botones-transmision">
          <button id="btnCerrarTransmision" class="btn">Volver</button>
          <button id="btnEnviarTransmision" class="btn">Enviar transmisión</button>
        </div>

        <p id="estadoTransmision" class="estado-transmision"></p>
      </div>
    </div>

  </div> <!-- Div contenedor-principal -->

  <video muted autoplay loop id="video-bg">
    <source src="CyberVideo.mp4" type="video/mp4"> <!-- Ruta relativa simplificada -->
  </video>

  <div class="filtro-negro"></div>

  <!-- <script type="module" src="script.js"></script> -->
  <script src="script.js"></script> <!-- Ruta relativa, ¡correcto! -->
</body>
</html>
