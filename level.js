// INTERFAZ Y LÓGICA JUEGO

// Elementos del DOM
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

function actualizarContador() {
  if (!juegoPausado) {
    contador++;
    contadorElement.textContent = contador;
  }
}
setInterval(actualizarContador, 250);

// Sonidos
const sonidoHover = document.getElementById("sonido-hover");
const sonidoClick = document.getElementById("sonido-click");
sonidoHover.volume = 0.1;
sonidoClick.volume = 0.2;
musicaJuego.volume = 0.3;

const botones = document.querySelectorAll(".btn");
botones.forEach(boton => {
  boton.addEventListener("mouseenter", () => {
    sonidoHover.currentTime = 0;
    sonidoHover.play().catch(() => {});
  });
  boton.addEventListener("mousedown", () => {
    sonidoClick.currentTime = 0;
    sonidoClick.play().catch(() => {});
  });
});

// Funciones pausa
function pausarJuego() {
  if (juegoPausado) {
    continuarJuego();
  } else {
    juegoPausado = true;
    menuPausa.classList.remove("oculto");
    musicaJuego.pause();
  }
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

function iniciarMusicaJuego() {
  if (musicaJuego.paused) {
    musicaJuego.play().catch(() => {});
  }
}
window.addEventListener("click", iniciarMusicaJuego, { once: true });
window.addEventListener("keydown", iniciarMusicaJuego, { once: true });

// Puntos
const puntosElement = document.getElementById("puntos");
let puntos = 0;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !juegoPausado) {
    puntos++;
    puntosElement.textContent = `Puntos: ${puntos}`;
    sonidoHover.currentTime = 0;
    sonidoHover.play().catch(() => {});
  }
});


// ============================
//apartir de aqui se hace lo de three.js y modelos

import * as THREE from "./three.module.js";
import { OrbitControls } from "./OrbitControls.js";
import { STLLoader } from "./STLLoader.js";
import { GLTFLoader } from "./GLTFLoader.js";

// Escena
const scene = new THREE.Scene();

// Fondo con textura
const loader = new THREE.TextureLoader();
loader.load("cielo.jpg", function (texture) {
  scene.background = texture;
});

// Cámara
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight);
camera.position.set(0, 5, 40);//0,5,20

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("three-container").appendChild(renderer.domElement);

// Luces
const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemisphereLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 5, -1);
scene.add(directionalLight);

// Controles
const cameraControl = new OrbitControls(camera, renderer.domElement);

// Piso animado
let pisoTexture;

const textureLoader = new THREE.TextureLoader();
textureLoader.load("piso3 (2).png", function (texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  pisoTexture = texture;

  //plano para piso
  const planeGeometry = new THREE.PlaneGeometry(70, 100);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
});

// cubo
/*
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
  new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
);
cube.position.set(0, 5, 0);
scene.add(cube);*/

// STL
const textureLoader2 = new THREE.TextureLoader();
textureLoader2.load("metal.jpg", function (texture) {
  const material2 = new THREE.MeshPhongMaterial({ map: texture });
  const loaderSTL2 = new STLLoader();
  loaderSTL2.load("obs.stl", function (geometry) {
    const mesh2 = new THREE.Mesh(geometry, material2);
    mesh2.scale.set(0.05, 0.05, 0.05);
    mesh2.position.set(-28, 0, 15);
    mesh2.rotateX(-Math.PI / 2);
    scene.add(mesh2);
  });
});

const loaderSTL = new STLLoader();
loaderSTL.load("obs.stl", function (geometry) {
  const material = new THREE.MeshPhongMaterial({ color: "#00BFFF" });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.set(0.05, 0.05, 0.05);
  mesh.position.set(22, 6.2, -15);
  mesh.rotateX(Math.PI / 2);
  scene.add(mesh);
});
/*
const textureLoader3 = new THREE.TextureLoader();
textureLoader3.load("top.png", function (texture) {
  const material3 = new THREE.MeshPhongMaterial({ map: texture });
const loaderSTL3 = new STLLoader();
loaderSTL3.load("parking.stl", function (geometry) {
 // const material = new THREE.MeshPhongMaterial({ color: "00BFFF" });
  const mesh8 = new THREE.Mesh(geometry, material3);
  mesh8.scale.set(0.005, 0.005, 0.005);
  mesh8.position.set(15, 0.2, 25);
  mesh8.rotateY(-Math.PI / 2);
  mesh8.rotateX(-Math.PI / 2);
   mesh8.rotateZ(-Math.PI / 2);
  scene.add(mesh8);
});
});*/
const textureLoader5 = new THREE.TextureLoader();
textureLoader5.load("Texture_Metal.png", function (texture) {
  const material4 = new THREE.MeshPhongMaterial({ map: texture });
  const loaderSTL3 = new STLLoader();
  loaderSTL3.load("cubo.stl", function (geometry) {
    const mesh6 = new THREE.Mesh(geometry, material4);
    mesh6.scale.set(0.5, 0.5, 0.5);
    mesh6.position.set(0, 5, 20);
    mesh6.rotateX(-Math.PI / 2);
    scene.add(mesh6);
  });
});

const loaderSTL6 = new STLLoader();
loaderSTL6.load("car.stl", function (geometry) {
  const material6 = new THREE.MeshPhongMaterial({ //color: "#00BFFF" 

  });
  const mesh7 = new THREE.Mesh(geometry, material6);
  mesh7.scale.set(2.0, 2.0, 2.0);
  mesh7.position.set(-32, 4.2, 35);
  mesh7.rotateY(Math.PI / 2);
  mesh7.rotateX(-Math.PI / 2);
  scene.add(mesh7);
});

const loaderSTL9 = new STLLoader();
loaderSTL9.load("SKM_Robot.stl", function (geometry) {
  const material9 = new THREE.MeshPhongMaterial({ color: "#00BFFF" });
  const mesh9 = new THREE.Mesh(geometry, material9);
  mesh9.scale.set(0.5, 0.5, 0.5);
  mesh9.position.set(-5, 2.2, 25);
 //   mesh9.rotateX(Math.PI / 2);
 mesh9.rotation.x = -Math.PI / 2; //a vertical
mesh9.rotation.z = Math.PI; // 

  scene.add(mesh9);
});


//SKM_Robot
// Modelos GLTF
//asi no se repite el bloque de cod por cada mod
const gltfModels = [
  { file: "machine.glb", scale: [1, 1, 1], position: [-30, 1, 18] },
  { file: "STREET.glb", scale: [3, 3, 3], position: [-20, 3, -18], rotationY: -Math.PI / 2 },
 // { file: "station.glb", scale: [1, 1, 1], position: [25, 0, 25], rotationX: -Math.PI / 2,rotationY: Math.PI / 2 },
  { file: "city.glb", scale: [4.5, 4.5, 4.5], position: [18, -0.98, -35] },
  { file: "hotel.glb", scale: [11.5, 11.5, 11.5], position: [18, -0.98, 20] },//18, -0.98, 0
  { file: "robot.glb", scale: [3.9, 3.9, 3.9], position: [8, 1.8, 20] },
  { file: "cilindro.glb", scale: [0.03, 0.03, 0.03], position: [7, 0, 30],rotationZ: -Math.PI / 2  },
  { file: "char.glb", scale: [2.8, 2.8, 2.8], position: [-18, 1.5, 20] }
];

//loaders
const loaderGLB = new GLTFLoader();
gltfModels.forEach(model => {
  loaderGLB.load(model.file, (gltf) => {
    const mesh = gltf.scene;
    mesh.scale.set(...model.scale);
    mesh.position.set(...model.position);
    if (model.rotationY) mesh.rotation.y = model.rotationY;
    scene.add(mesh);
  });
});

// Animación
function animate() {
  if (pisoTexture && !juegoPausado) {//mueve textura piso
    pisoTexture.offset.y += 0.01;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
