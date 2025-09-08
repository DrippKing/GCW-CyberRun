//Musica**************************************************************************************************************************************************
// Selección de audio
const musica = document.getElementById("musica-fondo");
musica.src = "Glitch_Reality.mp3"; // Ruta a tu archivo de música
musica.volume = .9; // Volumen medio

// Función para iniciar música
function iniciarMusica() {
  if (musica.paused) {
    musica.play().catch(() => {
      console.log("Interacción requerida para reproducir música.");
    });
  }
}

// Iniciar música con cualquier clic o tecla (solo la primera vez)
window.addEventListener("click", iniciarMusica, { once: true });
window.addEventListener("keydown", iniciarMusica, { once: true });


//*******************************************************************************************************************************************/
//Audio de los botones
const sonidoBoton = document.getElementById("sonido-boton");

// Seleccionar todos los botones
const botones = document.querySelectorAll('.btn');

// Agregar evento hover (mouseenter) a cada botón
botones.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    // Reiniciar el audio si ya estaba sonando
    sonidoBoton.currentTime = 0;
    sonidoBoton.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  });
});

//************************************************************************************************************************************/
// Selección del audio de selección
const sonidoSelect = document.getElementById("sonido-select");

// Agregar evento click a cada botón
botones.forEach(btn => {
  btn.addEventListener('click', () => {
    // Reiniciar audio si ya estaba sonando
    sonidoSelect.currentTime = 0;
    sonidoSelect.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  });
});

// Función para cambiar de pantalla (temporal esto aparece cada boton no programado. Una ves Todo tenga su funcion esta parte del codigo debe eliminarse)
function cambiarPantalla(nombre) {
  alert("Cambiar a pantalla: " + nombre);
}

// Simulación de cerrar juego 
function cerrarJuego() {
  alert("Gracias por jugar Cyber Run!");
}

//OPCIONES    *********************************************************************************************************************************************/
// Contenedores y botones
const menuOpciones = document.getElementById("menu-opciones");
const botonesMenu = document.querySelectorAll(".menu > .btn");
const btnRegresar = document.getElementById("btn-regresar");

// Sliders
const sliderMusica = document.getElementById("volumen-musica");
const sliderSonidos = document.getElementById("volumen-sonidos");
const sliderBrillo = document.getElementById("brillo");

// Mostrar menú de opciones
function abrirOpciones() {
  botonesMenu.forEach(btn => btn.classList.add("oculto"));
  menuOpciones.classList.remove("oculto");
}

// Regresar al menú principal
btnRegresar.addEventListener("click", () => {
  menuOpciones.classList.add("oculto");
  botonesMenu.forEach(btn => btn.classList.remove("oculto"));
});

// Ajustar volúmenes
sliderMusica.addEventListener("input", () => {
  musica.volume = parseFloat(sliderMusica.value);
});

sliderSonidos.addEventListener("input", () => {
  sonidoBoton.volume = parseFloat(sliderSonidos.value);
  sonidoSelect.volume = parseFloat(sliderSonidos.value);
});


// Reutilizamos audios para los botones
btnRegresar.addEventListener('mouseenter', () => {
  sonidoBoton.currentTime = 0;
  sonidoBoton.play();
});

btnRegresar.addEventListener('click', () => {
  sonidoSelect.currentTime = 0;
  sonidoSelect.play();
});

//RANKING **************************************************************************************************************************************/
const menuRanking = document.getElementById("menu-ranking");
const btnRankingRegresar = document.getElementById("btn-ranking-regresar");

// Abrir Ranking
function abrirRanking() {
  document.querySelector(".menu").classList.add("oculto"); // ocultar menú principal
  menuRanking.classList.remove("oculto"); // mostrar ranking
}

// Regresar desde Ranking
btnRankingRegresar.addEventListener("click", () => {
  menuRanking.classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
});

// TIENDA ******************************************************************************************************************************************** */
const menuTienda = document.getElementById("menu-tienda");
const btnTiendaRegresar = document.getElementById("btn-tienda-regresar");
const listaPerks = document.querySelectorAll(".perk");
const infoPerk = document.getElementById("info-perk");
const cerrarInfo = document.getElementById("cerrar-info");

const infoNombre = document.getElementById("info-nombre");
const infoDescripcion = document.getElementById("info-descripcion");
const infoImagen = document.getElementById("info-imagen");
const infoPrecio = document.getElementById("info-precio");
const btnComprar = document.getElementById("btn-comprar");
const cantidadDatos = document.getElementById("cantidad-datos");

let datosJugador = 2500; // ejemplo currency
let perksComprados = [];

// Abrir Tienda
function abrirTienda() {
  document.querySelector(".menu").classList.add("oculto");
  menuTienda.classList.remove("oculto");
}

// Regresar desde Tienda
btnTiendaRegresar.addEventListener("click", () => {
  menuTienda.classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
});

// Mostrar info de perk
listaPerks.forEach(perk => {
  perk.addEventListener("click", () => {
    const nombre = perk.dataset.nombre;
    const descripcion = perk.dataset.descripcion;
    const precio = perk.dataset.precio;
    const imagen = perk.querySelector("img").src;
    const desbloqueado = perk.classList.contains("desbloqueado");

    infoNombre.textContent = nombre;
    infoDescripcion.textContent = descripcion;
    infoImagen.src = imagen;

    if (desbloqueado) {
      infoPrecio.textContent = "";
      btnComprar.classList.add("oculto");
      infoPerk.querySelector(".contenido-info").style.border = "2px solid #00ffe0";
    } else {
      infoPrecio.textContent = `Precio: ${precio} datos`;
      btnComprar.classList.remove("oculto");
      btnComprar.onclick = () => comprarPerk(perk, precio);
      infoPerk.querySelector(".contenido-info").style.border = "2px solid #777";
    }

    infoPerk.classList.remove("oculto");
  });
});

// Cerrar info de perk
cerrarInfo.addEventListener("click", () => {
  infoPerk.classList.add("oculto");
});

// Comprar perk
function comprarPerk(perk, precio) {
  precio = parseInt(precio);
  if (datosJugador >= precio) {
    datosJugador -= precio;
    cantidadDatos.textContent = datosJugador;

    perk.classList.remove("bloqueado");
    perk.classList.add("desbloqueado");
    perk.querySelector(".candado")?.remove();

    infoPrecio.textContent = "";
    btnComprar.classList.add("oculto");
    infoPerk.querySelector(".contenido-info").style.border = "2px solid #00ffe0";
  } else {
    alert("No tienes suficientes datos.");
  }
}
