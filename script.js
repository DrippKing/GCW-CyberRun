
const musica = document.getElementById("musica-fondo");
const sonido_btn_Hover = document.getElementById("sonido-btn_Hover");
const sonido_btn_Click = document.getElementById("sonido-btn_Click");

// BOTONES
const botones = document.querySelectorAll('.btn');

// OPCIONES --------------------
const menuOpciones = document.getElementById("menu-opciones");
const botonesMenu = document.querySelectorAll(".menu > .btn");
const btnRegresar = document.getElementById("btn-regresar");
const sliderMusica = document.getElementById("volumen-musica");
const sliderSonidos = document.getElementById("volumen-sonidos");

// LOGIN -----------------------
const LoginBtn = document.getElementById("navbar-login");
const menuLogin = document.getElementById("menu-login");
const btnLoginRegresar = document.getElementById("btn-login-regresar");
const btnSubmitLogin = document.getElementById("btn-submit-login");
const inputUsuario = document.getElementById("login-usuario");
const inputPassword = document.getElementById("login-password");
const loginError = document.getElementById("login-error");

// RANKING ---------------------
const menuRanking = document.getElementById("menu-ranking");
const btnRankingRegresar = document.getElementById("btn-ranking-regresar");

// TIENDA ----------------------
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

let datosJugador = 2500;

// NIVEL Y DIFICULTAD -----------
const menuNiveles = document.getElementById("menu-niveles-single");
const menuDificultad = document.getElementById("menu-dificultad");
const btnDificultadRegresar = document.getElementById("btn-dificultad-regresar");

let nivelSeleccionado = null;
let dificultadSeleccionada = null;

// GLITCHES ----------------------
const glitchLista = document.getElementById("glitch-lista");
const glitchSeleccionadoTxt = document.getElementById("glitch-seleccionado");
let glitchSeleccionado = null;

// TRANSMISIONES ------------------
const btnTransmisiones = document.getElementById("btnTransmisiones");
const contenedorTransmisiones = document.getElementById("contenedor-transmisiones");
const btnEnviarTransmision = document.getElementById("btnEnviarTransmision");
const btnCerrarTransmision = document.getElementById("btnCerrarTransmision");
const mensajeTransmision = document.getElementById("mensajeTransmision");
const estadoTransmision = document.getElementById("estadoTransmision");

const WEBHOOK_URL = "https://discord.com/api/webhooks/1427773296291745925/uD5ClVLf_UjT6zsZ5yXxtXIgPP58KN2OMgS9FH7jKQk-HCRdaFjV-c27wd88o6I73KGO";


// =================================================================================================
// MÚSICA / SONIDO
// =================================================================================================

musica.src = "Glitch_Reality.mp3";
musica.volume = .01;
sonido_btn_Hover.volume = .01;

function iniciarMusica() {
  if (musica.paused) musica.play();
}

window.addEventListener("click", iniciarMusica, { once: true });
window.addEventListener("keydown", iniciarMusica, { once: true });

botones.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    sonido_btn_Hover.currentTime = 0;
    sonido_btn_Hover.play();
  });
  btn.addEventListener('mousedown', () => {
    sonido_btn_Click.currentTime = 0;
    sonido_btn_Click.play();
  });
});

btnRegresar.addEventListener('mouseenter', () => {
  sonido_btn_Hover.currentTime = 0;
  sonido_btn_Hover.play();
});

btnRegresar.addEventListener('click', () => {
  sonido_btn_Click.currentTime = 0;
  sonido_btn_Click.play();
});


// =================================================================================================
// OPCIONES
// =================================================================================================

function abrirOpciones() {
  botonesMenu.forEach(btn => btn.classList.add("oculto"));
  menuOpciones.classList.remove("oculto");
}

btnRegresar.addEventListener("click", () => {
  menuOpciones.classList.add("oculto");
  botonesMenu.forEach(btn => btn.classList.remove("oculto"));
});

sliderMusica.addEventListener("input", () => {
  musica.volume = parseFloat(sliderMusica.value);
});

sliderSonidos.addEventListener("input", () => {
  sonido_btn_Hover.volume = parseFloat(sliderSonidos.value) * 0.1;
  sonido_btn_Click.volume = parseFloat(sliderSonidos.value);
});


// =================================================================================================
// LOGIN
// =================================================================================================

function abrirLogin() {
  // Ocultamos el menú principal y mostramos el de login
  botonesMenu.forEach(btn => btn.classList.add("oculto"));
  menuLogin.classList.remove("oculto");
}

btnLoginRegresar.addEventListener("click", () => {
  // Ocultamos el menú de login y mostramos el principal
  menuLogin.classList.add("oculto");
  botonesMenu.forEach(btn => btn.classList.remove("oculto"));
});

btnSubmitLogin.addEventListener("click", async () => {
  const usuario = inputUsuario.value;
  const password = inputPassword.value;
  loginError.textContent = ""; // Limpiar errores previos

  if (!usuario || !password) {
    loginError.textContent = "Usuario y contraseña son requeridos.";
    return;
  }

  loginError.textContent = "Conectando...";
  loginError.style.color = "#00ffe0";

  try {
    // Hacemos la petición a nuestro script PHP.
    // Asegúrate de que la URL coincida con la ubicación de tu proyecto en htdocs.
    const response = await fetch('login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario: usuario, password: password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // La sesión ya está creada en el lado del servidor por login.php.
      // Simplemente recargamos la página. El servidor detectará la sesión activa
      // y renderizará la vista correcta (con el botón de "Cerrar Sesión").
      loginError.textContent = "Login exitoso! Recargando...";
      loginError.style.color = "#00ff9d";
      window.location.reload();
    } else {
      // El backend dijo que las credenciales son incorrectas
      loginError.textContent = data.message || "Credenciales inválidas.";
      loginError.style.color = "#ff8080";
    }

  } catch (error) {
    // Esto ocurre si Apache no está corriendo o hay un problema de red/CORS.
    loginError.textContent = "Error: No se pudo conectar con el servidor.";
    loginError.style.color = "#ff8080";
    console.error("Error en el fetch:", error);
  }
});

// =================================================================================================
// SELECTOR DE NIVELES
// =================================================================================================

function seleccionarNivel() {
  document.querySelector(".menu").classList.add("oculto");
  document.getElementById("titulos").classList.add("oculto");
  menuNiveles.classList.remove("oculto");
}

document.getElementById("btn-niveles-regresar").addEventListener("click", () => {
  menuNiveles.classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
  document.getElementById("titulos").classList.remove("oculto");
});

function iniciarNivel(nivel) {
  nivelSeleccionado = nivel;
  menuNiveles.classList.add("oculto");
  mostrarMenuDificultad();
}

function mostrarMenuDificultad() {
  menuDificultad.classList.remove("oculto");
  cargarGlitchesDisponibles();
}

function iniciarNivelConDificultad(dificultad) {
  dificultadSeleccionada = dificultad;
  localStorage.setItem("dificultadSeleccionada", dificultadSeleccionada);
  localStorage.setItem("glitchSeleccionado", glitchSeleccionado || "ninguno");
  localStorage.setItem("nivelSeleccionado", nivelSeleccionado);
  // Redirigimos a index.php pidiendo la página del nivel correspondiente.
  window.location.href = `index.php?page=level${nivelSeleccionado}`;
}

btnDificultadRegresar.addEventListener("click", () => {
  menuDificultad.classList.add("oculto");
  menuNiveles.classList.remove("oculto");
});


// =================================================================================================
// GLITCHES
// =================================================================================================

function cargarGlitchesDisponibles() {
  glitchLista.innerHTML = "";

  const glitchesDesbloqueados = Array.from(document.querySelectorAll(".perk.desbloqueado"));

  if (glitchesDesbloqueados.length === 0) {
    glitchLista.innerHTML = "<p style='color:#888;'>No tienes glitches desbloqueados.</p>";
    return;
  }

  glitchesDesbloqueados.forEach(perk => {
    const nombre = perk.dataset.nombre;
    const descripcion = perk.dataset.descripcion;
    const imagen = perk.querySelector("img").src;

    const item = document.createElement("div");
    item.className = "glitch-item";
    item.innerHTML = `
      <img src="${imagen}" alt="${nombre}">
      <p><strong>${nombre}</strong></p>
      <small>${descripcion}</small>
    `;

    item.addEventListener("click", () => {
      document.querySelectorAll(".glitch-item").forEach(el => el.classList.remove("seleccionado"));
      item.classList.add("seleccionado");
      glitchSeleccionado = nombre;
      glitchSeleccionadoTxt.textContent = `Glitch seleccionado: ${nombre}`;
      localStorage.setItem("glitchSeleccionado", nombre);
    });

    glitchLista.appendChild(item);
  });
}


// =================================================================================================
// RANKING
// =================================================================================================

function abrirRanking() {
  document.querySelector(".menu").classList.add("oculto");
  menuRanking.classList.remove("oculto");
}

btnRankingRegresar.addEventListener("click", () => {
  menuRanking.classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
});


// =================================================================================================
// TIENDA
// =================================================================================================

function abrirTienda() {
  document.querySelector(".menu").classList.add("oculto");
  menuTienda.classList.remove("oculto");
}

btnTiendaRegresar.addEventListener("click", () => {
  menuTienda.classList.add("oculto");
  document.querySelector(".menu").classList.remove("oculto");
});

listaPerks.forEach(perk => {
  perk.addEventListener("click", () => {
    const nombre = perk.dataset.nombre;
    const descripcion = perk.dataset.descripcion;
    const desbloqueado = perk.classList.contains("desbloqueado");
    const precio = parseInt(perk.dataset.precio || 0);
    const imagen = perk.querySelector("img").src;

    infoNombre.textContent = nombre;
    infoDescripcion.textContent = descripcion;
    infoImagen.src = imagen;

    if (desbloqueado) {
      infoPrecio.textContent = "Desbloqueado ✅";
      btnComprar.classList.add("oculto");
    } else {
      infoPrecio.textContent = `Precio: ${precio} datos`;
      btnComprar.classList.remove("oculto");
      btnComprar.onclick = () => confirmarCompra(perk, precio);
    }

    infoPerk.classList.remove("oculto");
  });
});

cerrarInfo.addEventListener("click", () => {
  infoPerk.classList.add("oculto");
});

function confirmarCompra(perk, precio) {
  if (confirm(`¿Deseas comprar "${perk.dataset.nombre}" por ${precio} datos?`)) {
    comprarPerk(perk, precio);
  }
}

function comprarPerk(perk, precio) {
  if (datosJugador >= precio) {
    datosJugador -= precio;
    cantidadDatos.textContent = datosJugador;

    perk.classList.remove("bloqueado");
    perk.classList.add("desbloqueado");
    perk.querySelector(".candado")?.remove();

    infoPrecio.textContent = "Desbloqueado ✅";
    btnComprar.classList.add("oculto");

    alert("Glitch comprado con éxito.");
  } else {
    alert("No tienes suficientes datos.");
  }
}


// =================================================================================================
// TRANSMISIONES
// =================================================================================================

btnTransmisiones.addEventListener("click", () => {
  sonido_btn_Click.play();
  contenedorTransmisiones.style.display = "flex";
});

btnCerrarTransmision.addEventListener("click", () => {
  sonido_btn_Click.play();
  contenedorTransmisiones.style.display = "none";
  mensajeTransmision.value = "";
  estadoTransmision.textContent = "";
});

btnEnviarTransmision.addEventListener("click", async () => {
  sonido_btn_Click.play();

  const mensaje = mensajeTransmision.value.trim();
  if (!mensaje) {
    estadoTransmision.textContent = "⚠️ Escribe un mensaje antes de transmitir.";
    estadoTransmision.style.color = "#ff8080";
    return;
  }

  estadoTransmision.textContent = "Enviando...";
  estadoTransmision.style.color = "#00ffe0";

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📡 Transmisión desde CyberRun:\n> ${mensaje}`
      })
    });

    if (response.ok) {
      estadoTransmision.textContent = "✓ Enviada";
      estadoTransmision.style.color = "#00ff9d";
      mensajeTransmision.value = "";
    } else {
      estadoTransmision.textContent = "❌ Error";
      estadoTransmision.style.color = "#ff8080";
    }
  } catch {
    estadoTransmision.textContent = "❌ Error de conexión";
    estadoTransmision.style.color = "#ff8080";
  }
});
