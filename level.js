// Elementos
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

// Función para actualizar el contador
function actualizarContador() {
  if (!juegoPausado) {
    contador++;
    contadorElement.textContent = contador;
  }
}

// Llama a actualizarContador cada segundo (1000)
setInterval(actualizarContador, 250);
//cada cuarto de segundo


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

//para animacion del piso
let pisoX = 0;
let velocidadPiso = 5; //2


function moverFondo() {
  //fondo solo se mueve cuando el juego no está pausado
  if (!juegoPausado) {
    fondoX -= velocidadFondo;
    pisoX -= velocidadPiso;

    document.getElementById("fondo").style.backgroundPosition = `${fondoX}px 0`;//para la imagen de fondo
    document.getElementById("piso").style.backgroundPosition = `${pisoX}px 0`;//para la imagen de piso
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



//conatdor puntos
const puntosElement = document.getElementById("puntos");
let puntos = 0;

// Aumentar puntos con la tecla space
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !juegoPausado) {
    puntos++;
    puntosElement.textContent = `Puntos: ${puntos}`;

    // Reproducir sonido al ganar punto
    sonidoHover.currentTime = 0;
    sonidoHover.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  }
});
