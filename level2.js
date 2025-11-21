// level.js - versión con obstáculos GLB y hitboxes ajustables
import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { GLTFLoader } from "./GLTFLoader.js";

// =====================================================
// INTERFAZ Y LÓGICA JUEGO
// =====================================================

const btnPausa = document.getElementById("btn-pausa");
const menuPausa = document.getElementById("menu-pausa");
const btnContinuar = document.getElementById("btn-continuar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnMenu = document.getElementById("btn-menu");
const musicaJuego = document.getElementById("musica-juego");
const contadorElement = document.getElementById("contador");
const puntosElement = document.getElementById("puntos") || { textContent: "" };
const gameOverPanel = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const btnReiniciarGO = document.getElementById("btn-reiniciar-go");
const btnMenuGO = document.getElementById("btn-menu-go");
// Detectar la dificultad seleccionada desde el menú
const dificultad = localStorage.getItem("dificultadSeleccionada") || "normal";
console.log("Dificultad seleccionada:", dificultad);
// Detectar glitch seleccionado desde el menú principal
const glitchSeleccionado = localStorage.getItem("glitchSeleccionado") || "ninguno";
console.log("Glitch activo:", glitchSeleccionado);

// =====================================================
// ESTADOS DE GLITCHES
// =====================================================
let faseFantasmaActiva = glitchSeleccionado === "Fase Fantasma";
let overclockNeuralActivo = glitchSeleccionado === "Overclock Neural";
let reescrituraCodigoActiva = glitchSeleccionado === "Reescritura del Código";
let reescrituraUsada = false; // solo se puede usar una vez


let juegoPausado = false;

// Sonidos
const sonidoHover = document.getElementById("sonido-hover");
const sonidoClick = document.getElementById("sonido-click");
const sonidoSalto = document.getElementById("sonido-salto");
const sonidoChoque = document.getElementById("sonido-choque");
if (sonidoHover) sonidoHover.volume = 0.1;
if (sonidoClick) sonidoClick.volume = 0.2;
if (musicaJuego) musicaJuego.volume = 0.3;

// Botones
document.querySelectorAll(".btn").forEach(boton => {
  boton.addEventListener("mouseenter", () => {
    if (sonidoHover) { sonidoHover.currentTime = 0; sonidoHover.play().catch(()=>{}); }
  });
  boton.addEventListener("mousedown", () => {
    if (sonidoClick) { sonidoClick.currentTime = 0; sonidoClick.play().catch(()=>{}); }
  });
});

// Pausa / Continuar
function pausarJuego() {
  if (juegoPausado) continuarJuego();
  else {
    juegoPausado = true;
    menuPausa.classList.remove("oculto");
    if (musicaJuego) musicaJuego.pause();
  }
}
function continuarJuego() {
  juegoPausado = false;
  menuPausa.classList.add("oculto");
  if (musicaJuego) musicaJuego.play().catch(()=>{});
}

btnPausa.addEventListener("click", pausarJuego);
btnContinuar.addEventListener("click", continuarJuego);
btnReiniciar.addEventListener("click", () => location.reload());
btnMenu.addEventListener("click", () => window.location.href = "index.php?page=home"); // Corregido
btnReiniciarGO.addEventListener("click", () => location.reload());
btnMenuGO.addEventListener("click", () => window.location.href = "index.php?page=home"); // Corregido

function iniciarMusicaJuego() {
  if (musicaJuego && musicaJuego.paused) musicaJuego.play().catch(()=>{});
}
window.addEventListener("click", iniciarMusicaJuego, { once: true });
window.addEventListener("keydown", iniciarMusicaJuego, { once: true });
// =====================================================
// ESCENA Y OBJETOS
// =====================================================

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader();

// === Fondo tipo skybox (cúpula envolvente) ===
textureLoader.load("cielo_level2.png", tex => {
  tex.colorSpace = THREE.SRGBColorSpace;

  // Creamos una esfera invertida que envuelve toda la escena
  const skyGeo = new THREE.SphereGeometry(500, 60, 40);
  const skyMat = new THREE.MeshBasicMaterial({
    map: tex,
    side: THREE.BackSide // muestra la textura desde adentro
  });

  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.rotation.y = Math.PI; // rota para que la ciudad quede al frente
  scene.add(sky);
});

// Cámara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 22);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("three-container").appendChild(renderer.domElement);


// Luces
scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 0.9));
const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
dirLight.position.set(5,10,5);
scene.add(dirLight);

const cameraControl = new OrbitControls(camera, renderer.domElement);
cameraControl.enabled = false;

// Piso
let pisoTexture;
textureLoader.load("piso_level2.png", texture => {
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 25); // repite más la textura para que no se vea estirada
  pisoTexture = texture;
  const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 1000),
  new THREE.MeshStandardMaterial({ map: texture, side: THREE.DoubleSide })
);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
scene.add(plane);

});

// =====================================================
// JUGADOR
// =====================================================
const player = {
  mesh: null,
  model: null,
  width: 1.2,
  height: 2.2,
  depth: 1.0,
  x: 0,
  y: 1.1,
  z: 0,
  speedForward: 1.0,
  laneWidth: 3.0,
  moveSpeed: 60,
  velocityY: 0,
  gravity: -28,
  jumpStrength: 15,
  onGround: true,
  boundingBox: new THREE.Box3(),
  mixer: null
};
  if (overclockNeuralActivo) {
  player.speedForward *= 1.3; // 30% más rápido
  }

// Hitbox del jugador
const playerMesh = new THREE.Mesh(
  new THREE.BoxGeometry(player.width, player.height, player.depth),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
);
playerMesh.position.set(player.x, player.y, player.z);
playerMesh.visible = false;
scene.add(playerMesh);
player.mesh = playerMesh;

// Cargar modelo del jugador
const gltfLoader = new GLTFLoader();
gltfLoader.load("Robot.glb", (gltf) => {
  const model = gltf.scene;
  model.scale.set(0.6, 0.6, 0.6);
  model.position.set(playerMesh.position.x, playerMesh.position.y - 1.1, playerMesh.position.z);
  model.rotation.y = Math.PI;
  scene.add(model);
  player.model = model;

  if (gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();
    player.mixer = mixer;
  }
}, undefined, err => console.error("Error cargando modelo:", err));

// =====================================================
// OBSTÁCULOS
// =====================================================

// Mostrar o no las hitboxes (true = visible, false = ocultas)
const mostrarHitboxObstaculos = false;

const obstaclePool = [];
const activeObstacles = [];
const MAX_OBSTACLES = 10;

// Modelos de obstáculos y recolectables
let modelLarge = null;
let modelWide = null;
let modelBox = null; // nuevo modelo para cajas de puntos

const gltfLoaderObs = new GLTFLoader();
gltfLoaderObs.load("level2_air_drone.glb", gltf => { modelLarge = gltf.scene; });
gltfLoaderObs.load("level2_ground_drone.glb", gltf => { modelWide = gltf.scene; });
gltfLoaderObs.load("box.glb", gltf => { modelBox = gltf.scene; }); // nueva carga


function createObstacle() {
    // Probabilidad dinámica según dificultad
  const rand = Math.random();
  let type = "large";

  // 🔧 Controla la proporción de aparición
  if (rand < boxChance) type = "box";           // caja de puntos
  else if (rand < 0.5 + boxChance / 2) type = "large"; // obstáculo grande
  else type = "wide";                           // obstáculo ancho

  const laneX = lanesX[Math.floor(Math.random() * lanesX.length)];
  let obsGroup = new THREE.Group();
  let modelClone = null;

  if (type === "large" && modelLarge) {
    modelClone = modelLarge.clone();
    modelClone.scale.set(1, 1, 1);
  } else if (type === "wide" && modelWide) {
    modelClone = modelWide.clone();
    modelClone.scale.set(0.8, 0.8, 1);
  } else if (type === "box" && modelBox) {
    modelClone = modelBox.clone();
    modelClone.scale.set(1.2, 1.2, 1.2); // tamaño de la caja de puntos
  } else {
    // Si no hay modelo cargado aún, usa un cubo temporal
    const temp = new THREE.Mesh(
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.MeshStandardMaterial({ color: type === "box" ? 0xffff00 : 0xff0000 })
    );
    modelClone = temp;
  }

  // Hitbox
  const boxMesh = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshBasicMaterial({ color: type === "box" ? 0xffff00 : 0x00ffff, wireframe: true })
  );
  boxMesh.visible = mostrarHitboxObstaculos;

  obsGroup.add(modelClone);
  obsGroup.add(boxMesh);
  obsGroup.userData.type = type;
  obsGroup.userData._box = new THREE.Box3();
  obsGroup.position.set(laneX, 1, -220 - Math.random() * 40);
  scene.add(obsGroup);

  activeObstacles.push(obsGroup);
  return obsGroup;
}



function recycleObstacle(obs) {
  const idx = activeObstacles.indexOf(obs);
  if (idx !== -1) activeObstacles.splice(idx, 1);
  scene.remove(obs);
}

// =====================================================
// CONTROLES, HUD Y LÓGICA
// =====================================================
// Configuracion de dificultad..............................................................
let puntos = 0, spawnTimer = 0, distancia = 0, gameOver = false;

// 🔧 Ajustes base (puedes modificarlos manualmente)
let spawnInterval = 1.4; // cada cuánto aparece un obstáculo
let obstacleSpeed = 40;  // velocidad a la que se acercan
let boxChance = 0.15;    // probabilidad de que aparezca una caja
let maxObstacles = 10;   // límite simultáneo
let difficultyScale = 0.0003; // cuánto aumenta la dificultad con el tiempo (solo normal)

// Aplicar según dificultad
if (dificultad === "dificil") {
  spawnInterval = 0.9;  // 🔧 obsts. aparecen más rápido
  obstacleSpeed = 52;   // 🔧 obstáculos más rápidos
  boxChance = 0.25;     // 🔧 más cajas de puntos
  maxObstacles = 15;
  difficultyScale =  0.0006;  // sin progresión, es difícil desde el inicio
}

const lanesX = [-player.laneWidth, 0, player.laneWidth];
const keyState = { left:false, right:false };

function updateHUD() {
  contadorElement.textContent = Math.floor(distancia);
  puntosElement.textContent = `Puntos: ${puntos}`;
}

window.addEventListener("keydown", e => {
  if (e.code === "KeyA") keyState.left = true;
  if (e.code === "KeyD") keyState.right = true;
  if (e.code === "Space" && player.onGround && !juegoPausado && !gameOver) {
    player.velocityY = player.jumpStrength;
    player.onGround = false;
    if (sonidoSalto) { sonidoSalto.currentTime = 0; sonidoSalto.play().catch(()=>{}); }
  }
});
window.addEventListener("keyup", e => {
  if (e.code === "KeyA") keyState.left = false;
  if (e.code === "KeyD") keyState.right = false;
});

// Colisiones
function checkCollisions() {
  player.boundingBox.setFromObject(player.mesh);

  for (let i = activeObstacles.length - 1; i >= 0; i--) {
    const obs = activeObstacles[i];
    obs.userData._box.setFromObject(obs);

    if (player.boundingBox.intersectsBox(obs.userData._box)) {
      if (obs.userData.type === "box") {
        // Colisión con caja de puntos → +100 distancia y eliminar caja
        distancia += 100;
        recycleObstacle(obs);
        continue;
      } else {
  // 🧩 FASE FANTASMA: permite atravesar 1 obstáculo sin morir
  if (faseFantasmaActiva) {
    console.log("⚡ Fase Fantasma activada: colisión ignorada.");
    faseFantasmaActiva = false; // se consume el poder
    recycleObstacle(obs); // eliminar el obstáculo atravesado
    return false; // no muere
  } else {
    return true; // muere normalmente
  }
}

    }
  }
  return false;
}



// =====================================================
// GAME OVER con soporte para Reescritura del Código
// =====================================================
function triggerGameOver() {
  // Evitar múltiples ejecuciones simultáneas
  if (gameOver) return;

  const glitchSeleccionado = localStorage.getItem("glitchSeleccionado");
  console.log("Glitch activo:", glitchSeleccionado);

  // 🔹 Si el jugador tiene el glitch "Reescritura del Código" activo
  if (glitchSeleccionado === "Reescritura del Código" && !player.hasRespawned) {
    player.hasRespawned = true; // evita reaparecer infinitamente
    console.log("⚡ Activando glitch: Reescritura del Código");

    // Reproducir sonido de reparación (puedes usar sonidoChoque o uno propio)
    if (sonidoChoque) { 
      sonidoChoque.currentTime = 0; 
      sonidoChoque.play().catch(()=>{}); 
    }

    // 🔄 Efecto visual opcional: parpadeo del modelo del jugador
    if (player.model) {
      player.model.traverse(child => {
        if (child.material) {
          const oldEmissive = child.material.emissive?.clone?.();
          child.material.emissive = new THREE.Color(0x00ffff);
          setTimeout(() => {
            if (oldEmissive) child.material.emissive.copy(oldEmissive);
          }, 1000);
        }
      });
    }

    // 🧹 Limpia TODOS los obstáculos actuales de la escena correctamente
    while (activeObstacles.length > 0) {
      const o = activeObstacles.pop();
      try { scene.remove(o); } catch(e){}

      // Limpieza opcional de memoria
      o.traverse(child => {
        if (child.isMesh) {
          if (child.geometry) child.geometry.dispose?.();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose?.());
            } else {
              child.material.dispose?.();
            }
          }
        }
      });

      obstaclePool.push(o); // recicla el obstáculo
    }

    // 🔁 Reinicia el estado de juego
    spawnTimer = 0;
    obstacleSpeed = Math.max(obstacleSpeed * 0.9, 20);
    player.mesh.position.set(0, player.height / 2, 0);
    player.velocityY = 0;
    player.onGround = true;
    distancia = Math.max(0, distancia - 50); // penalización leve
    console.log("Jugador restaurado. Continuando partida...");
    return; // 🚫 NO termina el juego, continúa
  }

  // =====================================================
  // Si NO hay glitch de reaparición → Game Over normal
  // =====================================================
  localStorage.removeItem("dificultadSeleccionada"); // limpia para la próxima sesión

  gameOver = true;
  juegoPausado = true;
  if (musicaJuego) musicaJuego.pause();
  if (sonidoChoque) { sonidoChoque.currentTime = 0; sonidoChoque.play().catch(()=>{}); }

  finalScoreEl.textContent = `Puntuación: ${Math.floor(distancia)} pts`;
  gameOverPanel.style.display = "block";
  menuPausa.classList.add("oculto");

  // Guardar la puntuación en la base de datos
  guardarPuntuacion(distancia);
}

async function guardarPuntuacion(puntos) {
  // Solo intentamos guardar si hay una sesión de usuario activa (detectado en el PHP)
  try {
    const response = await fetch('guardar_puntos.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ puntos: Math.floor(puntos) }),
    });

    const result = await response.json();
    if (result.success) {
      console.log("Puntuación guardada en la base de datos.");
    } else {
      console.log("No se guardó la puntuación (puede que no hayas iniciado sesión).", result.message);
    }
  } catch (error) {
    console.error('Error al intentar guardar la puntuación:', error);
  }
}


// =====================================================
// ANIMACIÓN PRINCIPAL
// =====================================================
const clock = new THREE.Clock();

function animate() {
  const dt = clock.getDelta(); // 🔹 primero obtenemos el delta de tiempo

  if (!juegoPausado && !gameOver) {
    distancia += player.speedForward * dt * 10;

    if (pisoTexture)
      pisoTexture.offset.y += player.speedForward * 0.02 * dt * 60;

    // ============================
    // Escalado de dificultad
    // ============================
    if (dificultad === "normal") {
      // 🔧 Incrementa la dificultad de forma progresiva
      if (spawnInterval > 0.6)
        spawnInterval -= difficultyScale * dt * distancia;
      obstacleSpeed = 40 + distancia * 0.015; // 🔧 aumenta velocidad poco a poco
      player.speedForward = 1.0 + distancia * 0.002; // 🔧 el jugador corre más rápido
    }

    if (dificultad === "dificil") {
      // 🔥 Dificultad implacable: sube velocidad y baja tiempo entre spawns más rápido
      if (spawnInterval > 0.5)
        spawnInterval -= difficultyScale * dt * distancia * 3; // se reduce más agresivamente
      obstacleSpeed = 52 + distancia * 0.025; // obstáculos más rápidos con el tiempo
      player.speedForward = 1.0 + distancia * 0.003; // jugador un poco más rápido
    }

    // ============================
    // Spawning aleatorio
    // ============================
    spawnTimer += dt;
    if (spawnTimer > spawnInterval && activeObstacles.length < MAX_OBSTACLES) {
      spawnTimer = 0;
      createObstacle();
    }

    // Movimiento de obstáculos
    for (let i = activeObstacles.length - 1; i >= 0; i--) {
      const obs = activeObstacles[i];
      obs.position.z += obstacleSpeed * dt;
      if (obs.position.z > 60) {
        recycleObstacle(obs);
        puntos++;
      }
    }

    // Movimiento jugador
    let targetX = player.x;
    if (keyState.left)
      targetX = Math.max(-player.laneWidth, player.x - player.moveSpeed * dt);
    if (keyState.right)
      targetX = Math.min(player.laneWidth, player.x + player.moveSpeed * dt);
    player.x += (targetX - player.mesh.position.x) * Math.min(1, 12 * dt);
    player.mesh.position.x = player.x;

    // salto
    player.velocityY += player.gravity * dt;
    player.mesh.position.y += player.velocityY * dt;
    if (player.mesh.position.y <= player.height / 2) {
      player.mesh.position.y = player.height / 2;
      player.velocityY = 0;
      player.onGround = true;
    }

    // Sincronizar modelo
    if (player.model) {
      player.model.position.x = player.mesh.position.x;
      player.model.position.y = player.mesh.position.y - 1.1;
      player.model.position.z = player.mesh.position.z;
    }

    if (player.mixer) player.mixer.update(dt);

    // Cámara
    camera.position.x += (player.mesh.position.x - camera.position.x) * 0.12;
    camera.position.y += ((player.mesh.position.y + 4) - camera.position.y) * 0.12;
    camera.position.z += ((player.mesh.position.z + 18) - camera.position.z) * 0.12;
    camera.lookAt(player.mesh.position.x, player.mesh.position.y + 1, player.mesh.position.z);

    if (checkCollisions()) triggerGameOver();
    updateHUD();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
