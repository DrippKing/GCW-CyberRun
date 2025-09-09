// Elementos
const btnPausa = document.getElementById("btn-pausa");
const menuPausa = document.getElementById("menu-pausa");
const btnContinuar = document.getElementById("btn-continuar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnMenu = document.getElementById("btn-menu");
const musicaJuego = document.getElementById("musica-juego");

let juegoPausado = false;

//variables para sonido
const sonidoHover = document.getElementById("sonido-hover");
const sonidoClick = document.getElementById("sonido-click");

// Configuración de volúmenes
sonidoHover.volume = 0.1;
sonidoClick.volume = 0.2;
musicaJuego.volume = 0.3; // 0.05 volumen bajo por defecto

const botones = document.querySelectorAll(".btn");

botones.forEach(boton => {
  boton.addEventListener("mouseenter", () => {
    sonidoHover.currentTime = 0;
    sonidoHover.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  });

  boton.addEventListener("mousedown", () => {
    sonidoClick.currentTime = 0;
    sonidoClick.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  });
});


//para animacion del fondo
let fondoX = 0;
let velocidadFondo = 1; // píxeles por frame

function moverFondo() {
  //fondo solo se mueve cuando el juego no está pausado
  if (!juegoPausado) {
    fondoX -= velocidadFondo;
    document.body.style.backgroundPosition = `${fondoX}px 0`;
  }
  requestAnimationFrame(moverFondo);//bucle se ejecuta con esto
}
moverFondo();



// Función para pausar
function pausarJuego() {
  if (juegoPausado) {//Si ya está pausado
    continuarJuego(); //continua con el boton pausa
  } else {
    juegoPausado = true;
    menuPausa.classList.remove("oculto");
    musicaJuego.pause();
    // reanuda juego
  }
}


// Función para continuar
function continuarJuego() {
  juegoPausado = false;
  menuPausa.classList.add("oculto");
  musicaJuego.play();
  // vuelve a moverse nivel
}

// eventos
btnPausa.addEventListener("click", pausarJuego);
btnContinuar.addEventListener("click", continuarJuego);

// simula reinicio recargando la página
btnReiniciar.addEventListener("click", () => location.reload());

// regresa al menu inicio (redirecciona al index)
btnMenu.addEventListener("click", () => window.location.href = "index.html");

//audio
// Iniciar música de fondo en la primera interacción
//esto evita errores en la consola si el navegador bloquea autoplay
function iniciarMusicaJuego() {
  if (musicaJuego.paused) {
    musicaJuego.play().catch(() => {
      console.log("Interacción requerida para iniciar la música.");
    });
  }
}

window.addEventListener("click", iniciarMusicaJuego, { once: true });
window.addEventListener("keydown", iniciarMusicaJuego, { once: true });
