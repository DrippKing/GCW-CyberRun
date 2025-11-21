<?php
session_start(); // Inicia o reanuda la sesión. ¡Esto es crucial!

// Definimos las páginas válidas para evitar que se incluyan archivos no deseados.
$paginas_permitidas = [
    'home' => 'home.php',
    'level1' => 'nivel_1.html',
    'level2' => 'nivel_2.html', // Asumiendo que existen
    'level3' => 'nivel_3.html'  // Asumiendo que existen
];

// Determinamos qué página cargar. Por defecto, será 'home'.
$pagina_a_cargar = 'home.php'; // Página por defecto

if (isset($_GET['page']) && array_key_exists($_GET['page'], $paginas_permitidas)) {
    // Si se pide una página y está en nuestra lista de permitidas...
    $pagina_a_cargar = $paginas_permitidas[$_GET['page']];
}

// Ahora, simplemente incluimos el archivo de la página solicitada.
// Todo el contenido de ese archivo se insertará aquí.

/*
 * NOTA IMPORTANTE:
 * Este es un sistema de plantillas muy básico. El archivo incluido (ej. home.php)
 * debe contener una estructura HTML completa (<html>, <head>, <body>).
 * Una mejora futura sería que este index.php tuviera la cabecera y el pie de página,
 * y solo se incluyera el "contenido" de la página. Por ahora, esto funciona.
 */

include $pagina_a_cargar;
?>