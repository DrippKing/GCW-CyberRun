// Elementos
const btnPausa = document.getElementById("btn-pausa");
const menuPausa = document.getElementById("menu-pausa");
const btnContinuar = document.getElementById("btn-continuar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnMenu = document.getElementById("btn-menu");
const musicaJuego = document.getElementById("musica-juego");

let juegoPausado = false;


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