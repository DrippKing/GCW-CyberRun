// Elementos
const btnPausa = document.getElementById("btn-pausa");
const menuPausa = document.getElementById("menu-pausa");
const btnContinuar = document.getElementById("btn-continuar");
const btnReiniciar = document.getElementById("btn-reiniciar");
const btnMenu = document.getElementById("btn-menu");
const musicaJuego = document.getElementById("musica-juego");

let juegoPausado = false;

// Función para pausar
function pausarJuego() {
  juegoPausado = true;
  menuPausa.classList.remove("oculto");
  musicaJuego.pause();
  // se detiene todo lo dle nivel
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