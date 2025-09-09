// =================================================================================================
// DECLARACIÓN DE VARIABLES
// =================================================================================================

// ------------------------------------- AUDIO -------------------------------------
// Elemento de audio para la música de fondo
const musica = document.getElementById("musica-fondo");
// Elemento de audio para el sonido de hover sobre los botones
const sonido_btn_Hover = document.getElementById("sonido-btn_Hover");
// Elemento de audio para el sonido de clic en los botones
const sonido_btn_Click = document.getElementById("sonido-btn_Click");


// ------------------------------------- BOTONES GENERALES -------------------------------------
// Colección de todos los elementos con la clase '.btn'
const botones = document.querySelectorAll('.btn');


// ------------------------------------- MENÚ DE OPCIONES -------------------------------------
// Contenedor del menú de opciones
const menuOpciones = document.getElementById("menu-opciones");
// Botones del menú principal
const botonesMenu = document.querySelectorAll(".menu > .btn");
// Botón para regresar desde el menú de opciones
const btnRegresar = document.getElementById("btn-regresar");
// Slider para el volumen de la música
const sliderMusica = document.getElementById("volumen-musica");
// Slider para el volumen de los sonidos
const sliderSonidos = document.getElementById("volumen-sonidos");
// Slider para el brillo (actualmente no utilizado en la lógica)
const sliderBrillo = document.getElementById("brillo");


// ------------------------------------- MENÚ DE RANKING -------------------------------------
// Contenedor del menú de ranking
const menuRanking = document.getElementById("menu-ranking");
// Botón para regresar desde el menú de ranking
const btnRankingRegresar = document.getElementById("btn-ranking-regresar");


// ------------------------------------- MENÚ DE TIENDA -------------------------------------
// Contenedor del menú de la tienda
const menuTienda = document.getElementById("menu-tienda");
// Botón para regresar desde la tienda
const btnTiendaRegresar = document.getElementById("btn-tienda-regresar");
// Colección de todos los perks en la tienda
const listaPerks = document.querySelectorAll(".perk");
// Contenedor de la ventana de información del perk
const infoPerk = document.getElementById("info-perk");
// Botón para cerrar la ventana de información del perk
const cerrarInfo = document.getElementById("cerrar-info");
// Elemento para mostrar el nombre del perk
const infoNombre = document.getElementById("info-nombre");
// Elemento para mostrar la descripción del perk
const infoDescripcion = document.getElementById("info-descripcion");
// Elemento para mostrar la imagen del perk
const infoImagen = document.getElementById("info-imagen");
// Elemento para mostrar el precio del perk
const infoPrecio = document.getElementById("info-precio");
// Botón para comprar un perk
const btnComprar = document.getElementById("btn-comprar");
// Elemento que muestra la cantidad de "datos" (moneda del juego) del jugador
const cantidadDatos = document.getElementById("cantidad-datos");
// Variable para almacenar la moneda del jugador (ejemplo)
let datosJugador = 2500;
// Array para almacenar los perks que el jugador ha comprado
let perksComprados = [];


// =================================================================================================
// LÓGICA DEL SCRIPT
// =================================================================================================

// ------------------------------------- MÚSICA Y SONIDO -------------------------------------
musica.src = "Glitch_Reality.mp3"; // Ruta a tu archivo de música
musica.volume = .01; // Volumen inicial de la música
sonido_btn_Hover.volume = 0.01; // Volumen inicial de los sonidos de botones

// Función para iniciar música (requiere interacción del usuario)
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

// Agregar evento hover (mouseenter) a cada botón para reproducir sonido
botones.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    sonido_btn_Hover.currentTime = 0;
    sonido_btn_Hover.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  });
});

// Agregar evento click a cada botón para reproducir sonido de selección
botones.forEach(btn => {
  btn.addEventListener('mousedown', () => {
    sonido_btn_Click.currentTime = 0;
    sonido_btn_Click.play().catch(() => {
      console.log("Interacción requerida para reproducir sonido.");
    });
  });
});

// Reutilizamos audios para los botones de regresar que no están en la colección 'botones'
btnRegresar.addEventListener('mouseenter', () => {
  sonido_btn_Hover.currentTime = 0;
  sonido_btn_Hover.play();
});

btnRegresar.addEventListener('mouseclick', () => {
  sonido_btn_Click.currentTime = 0;
  sonido_btn_Click.play();
});


// ------------------------------------- FUNCIONES GENERALES DE NAVEGACIÓN -------------------------------------
// Función para cambiar de pantalla (temporal)
function cambiarPantalla(nombre) {
  alert("Cambiar a pantalla: " + nombre);
}

// Simulación de cerrar juego
function cerrarJuego() {
  alert("Gracias por jugar Cyber Run!");
}


// ------------------------------------- LÓGICA DE OPCIONES -------------------------------------
// Mostrar menú de opciones
function abrirOpciones() {
  botonesMenu.forEach(btn => btn.classList.add("oculto"));
  menuOpciones.classList.remove("oculto");
}

// Regresar al menú principal desde opciones
btnRegresar.addEventListener("click", () => {
  menuOpciones.classList.add("oculto");
  botonesMenu.forEach(btn => btn.classList.remove("oculto"));
});

// Ajustar volumen de música con el slider
sliderMusica.addEventListener("input", () => {
  musica.volume = parseFloat(sliderMusica.value);
});

// Ajustar volumen de sonidos con el slider
sliderSonidos.addEventListener("input", () => {
  // Se multiplica por 0.1 para que el sonido de hover no sea tan fuerte
  sonido_btn_Hover.volume = parseFloat(sliderSonidos.value) * 0.1;
  sonido_btn_Click.volume = parseFloat(sliderSonidos.value);
});
// ------------------------------------- LÓGICA DE SELECTOR DE NIVEL -------------------------------------
//Abrir selector de nivel
function seleccionarNivel() {
  document.querySelector(".menu").classList.add("oculto");
  document.getElementById("titulos").classList.add("oculto");
  document.getElementById("menu-niveles").classList.remove("oculto");
}
//Regresar desde selector de nivel
document.getElementById("btn-niveles-regresar").addEventListener("click", () => {
  document.getElementById("menu-niveles").classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
  document.getElementById("titulos").classList.remove("oculto");
});

function iniciarNivel(nivel) {
  alert("Iniciar nivel: " + nivel);
  window.location.href = `nivel_${nivel}.html`;
}

// ------------------------------------- LÓGICA DE RANKING -------------------------------------
// Abrir Ranking
function abrirRanking() {
  document.querySelector(".menu").classList.add("oculto");
  menuRanking.classList.remove("oculto");
}

// Regresar desde Ranking
btnRankingRegresar.addEventListener("click", () => {
  menuRanking.classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
});


// ------------------------------------- LÓGICA DE TIENDA -------------------------------------
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

// Mostrar información de un perk al hacer clic
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

// Cerrar ventana de información del perk
cerrarInfo.addEventListener("click", () => {
  infoPerk.classList.add("oculto");
});

// Función para comprar un perk
function comprarPerk(perk, precio) {
  precio = parseInt(precio);
  if (datosJugador >= precio) {
    datosJugador -= precio;
    cantidadDatos.textContent = datosJugador;

    perk.classList.remove("bloqueado");
    perk.classList.add("desbloqueado");
    perk.querySelector(".candado")?.remove(); // '?. remove' evita error si no hay candado

    infoPrecio.textContent = "";
    btnComprar.classList.add("oculto");
    infoPerk.querySelector(".contenido-info").style.border = "2px solid #00ffe0";
  } else {
    alert("No tienes suficientes datos.");
  }
}
