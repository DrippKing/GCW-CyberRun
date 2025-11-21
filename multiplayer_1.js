// === COPIA ADAPTADA DEL SINGLEPLAYER ===
// Puedes añadir aquí lógica para varios jugadores, sincronización, etc.

import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { STLLoader } from "./STLLoader.js";
import { GLTFLoader } from "./GLTFLoader.js";

const btnPausa = document.getElementById("btn-pausa");
const menuPausa = document.getElementById("menu-pausa");
const btnContinuar = document.getElementById("btn-continuar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnMenu = document.getElementById("btn-menu");
const musicaJuego = document.getElementById("musica-juego");

let juegoPausado = false;

// Contador
const contadorElement = document.getElementById("contador");
let contador = 0;
setInterval(() => {
  if (!juegoPausado) {
    contador++;
    contadorElement.textContent = contador;
  }
}, 250);

// Sonidos
const sonidoHover = document.getElementById("sonido-hover");
const sonidoClick = document.getElementById("sonido-click");
sonidoHover.volume = 0.1;
sonidoClick.volume = 0.2;
musicaJuego.volume = 0.3;

document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("mouseenter", () => {
    sonidoHover.currentTime = 0;
    sonidoHover.play();
  });
  btn.addEventListener("mousedown", () => {
    sonidoClick.currentTime = 0;
    sonidoClick.play();
  });
});

// Pausa
function pausarJuego() {
  juegoPausado = true;
  menuPausa.classList.remove("oculto");
  musicaJuego.pause();
}

function continuarJuego() {
  juegoPausado = false;
  menuPausa.classList.add("oculto");
  musicaJuego.play();
}

btnPausa.addEventListener("click", pausarJuego);
btnContinuar.addEventListener("click", continuarJuego);
btnReiniciar.addEventListener("click", () => location.reload());
btnMenu.addEventListener("click", () => window.location.href = "index.html");

window.addEventListener("click", () => musicaJuego.play(), { once: true });

// =========================
//   THREE.JS IGUAL QUE EN SINGLEPLAYER
// =========================

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();

loader.load("cielo.jpg", tex => scene.background = tex);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 5, 40);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
const dir = new THREE.DirectionalLight(0xffffff, 1);
dir.position.set(1, 5, -1);
scene.add(dir);

const cameraControl = new OrbitControls(camera, renderer.domElement);

// Piso animado
let pisoTexture = null;
loader.load("piso3 (2).png", tex => {
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  pisoTexture = tex;

  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(70, 100),
    new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide })
  );
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
});

// Carga de modelos igual que en level.js
// (puedes copiar todo el bloque tal cual para mantener los mismos objetos)

// Animación
function animate() {
  if (pisoTexture && !juegoPausado) {
    pisoTexture.offset.y += 0.01;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
