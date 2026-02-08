/* --- CONFIGURACIÓN DE DATOS --- */
// Texto inicial que aparecerá con efecto de máquina de escribir
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 30; // Velocidad de la animación (milisegundos entre letras)
let i = 0; // Índice rastreador para el carácter actual de la intro
let isTyping = true; // Booleano para bloquear el uso de la terminal durante la carga

// Diccionario de rutas permitidas para el comando 'cd'
const temas = {
    "redes": true,
    "linux": true,
    "seguridad": true
};

/* --- SELECTORES DEL DOM --- */
const inputField = document.getElementById('user-input'); // El input real (invisible) que captura el teclado
const displayText = document.getElementById('display-text'); // El texto que el usuario ve reflejado mientras escribe
const consoleContent = document.getElementById('typing-text'); // El área donde se imprime todo el historial de la consola
const contentDiv = document.querySelector('.content'); // El contenedor principal que necesitamos para controlar el scroll
const themeToggle = document.getElementById('theme-toggle'); // El botón físico para cambiar entre modo luz y oscuridad

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    // Si aún quedan caracteres por procesar en el string de bienvenida
    if (i < terminalText.length) {
        let char = terminalText.charAt(i); // Capturamos el carácter en la posición i
        // Convertimos saltos de línea de código (\n) en saltos de línea visuales (<br>)
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++; // Incrementamos el contador para la siguiente letra
        setTimeout(typeWriter, speed); // Re-ejecutamos la función tras una pequeña pausa (30ms)
        contentDiv.scrollTop = contentDiv.scrollHeight; // Forzamos el scroll hacia abajo mientras aparece el texto
    } else {
        finishLoading(); // Una vez terminado el texto, activamos la funcionalidad de la terminal
    }
}

// Función para finalizar el estado de carga y habilitar la interacción
function finishLoading() {
    if (!isTyping) return; // Si ya no estamos en modo "escribiendo", salimos para evitar errores
    isTyping = false; // Marcamos el estado global como "interactivo"
    consoleContent.innerHTML = terminalText.replace(/\n/g, "<br>"); // Nos aseguramos de que el texto esté completo en pantalla
    document.getElementById('input-line').style.display = "flex"; // Hacemos visible la línea del cursor (prompt)
    inputField.focus(); // Ponemos el foco del teclado automáticamente en el input invisible
}

/* --- LÓGICA DE PERSISTENCIA Y CAMBIO DE TEMA --- */

// Función encargada de aplicar las clases visuales de CSS
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light'); // Aplicamos el atributo que lee el CSS
        if (themeToggle) themeToggle.innerText = 'MODO OSCURO'; // Cambiamos el texto del botón al opuesto
    } else {
        document.documentElement.removeAttribute('data-theme'); // Quitamos el atributo para volver al default (oscuro)
        if (themeToggle) themeToggle.innerText = 'MODO CLARO'; // Actualizamos el texto del botón
    }
}

// Al arrancar, verificamos si el navegador recuerda una preferencia anterior del usuario
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme); // Si existe un tema guardado, lo aplicamos inmediatamente

// Listener para detectar el clic en el botón de cambio de tema
if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitamos que el clic afecte a otros elementos del DOM
        // Verificamos si el modo actual es claro consultando el atributo del HTML
        const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isCurrentlyLight ? 'dark' : 'light'; // Elegimos el tema contrario
        
        applyTheme(nextTheme); // Aplicamos el cambio visual
        localStorage.setItem('theme', nextTheme); // Guardamos la preferencia en el LocalStorage
        inputField.focus(); // Re-enfocamos el input para no perder la capacidad de escribir
    });
}

/* --- EVENTOS DE TECLADO --- */

// Permite al usuario saltarse la animación de intro pulsando la tecla 'Enter'
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) finishLoading();
});

// Sincroniza en tiempo real lo que el usuario escribe con lo que se muestra en el display visual
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Procesador principal de comandos al pulsar 'Enter'
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim(); // Limpiamos espacios en blanco al inicio y final
        const parts = rawInput.split(' '); // Dividimos la entrada por espacios (Comando + Argumento)
        const cmd = parts[0].toLowerCase(); // El primer elemento es el comando (siempre en minúsculas)
        const arg = parts[1] ? parts[1].toLowerCase() : null; // El segundo es el argumento (si existe)

        // Imprimimos la línea que el usuario acaba de escribir en el historial
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        /* --- LOGICA DEL INTERPRETE DE COMANDOS --- */
        
        if (cmd === 'ls') {
            // Mapeamos los temas permitidos y los mostramos con un color azul brillante
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; '); // Separamos los nombres con espacios HTML
            consoleContent.innerHTML += lista;
        } 
        
        else if (cmd === 'cd') {
            // Verificamos si el usuario escribió un destino y si ese destino es válido
            if (arg && temas[arg]) {
                consoleContent.innerHTML += `<span style="color: #27c93f;">Abriendo entorno de ${arg}...</span>`;
                setTimeout(() => { 
                    window.location.href = arg + ".html"; // Redirigimos al archivo correspondiente (ej: linux.html)
                }, 800); // Pequeña pausa de 800ms para dar sensación de carga
            } else {
                // Si el directorio no existe o no se especificó, lanzamos error en rojo
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado.</span>`;
            }
        }
        
        else if (cmd === 'clear') {
            // Vaciamos el contenido del div para limpiar la pantalla
            consoleContent.innerHTML = "Terminal limpia.<br>";
        }
        
        else if (cmd === 'help') {
            // Mostramos el manual de usuario básico
            consoleContent.innerHTML += "Comandos: ls, cd [tema], clear, help";
        }
        
        else if (rawInput !== "") {
            // Si escribió algo que no existe en nuestra lógica, avisamos del error
            consoleContent.innerHTML += `<span style="color: #ff5f56;">Comando '${cmd}' no reconocido.</span>`;
        }

        // Limpiamos los campos de entrada para que queden listos para el siguiente comando
        inputField.value = "";
        displayText.textContent = "";
        
        // Desplazamos el scroll al final para que el nuevo texto siempre sea visible
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- ANIMACIÓN DE FONDO (MATRIX) --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d'); // Obtenemos el contexto de dibujo 2D
    
    // Ajustamos el lienzo para que cubra exactamente el tamaño de la ventana
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    const binary = "01"; // Definimos los caracteres de la lluvia (estética binaria)
    const fontSize = 16; // Definimos el tamaño de cada "bit"
    const columns = canvas.width / fontSize; // Calculamos cuántas columnas caben en pantalla
    const drops = []; // Array que guardará la posición Y actual de cada columna
    
    // Inicializamos cada columna en la parte superior (1)
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        // Pintamos un rectángulo negro semitransparente para crear el rastro de luz
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#003300"; // Color verde oscuro para los caracteres
        ctx.font = fontSize + "px monospace"; // Definimos fuente monoespaciada
        
        // Iteramos por cada columna para dibujar el carácter correspondiente
        for (let i = 0; i < drops.length; i++) {
            // Seleccionamos 0 o 1 al azar
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            // Dibujamos el texto en su coordenada X e Y
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Si la gota llega al final y se cumple el factor aleatorio, la reiniciamos al inicio (0)
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++; // Movemos la gota una fila hacia abajo
        }
    }
    // Ejecutamos el dibujo a 20 FPS (cada 50ms)
    setInterval(drawMatrix, 50);
}

// Acción de inicio al cargar completamente la página
window.onload = () => {
    typeWriter(); // Lanzamos la intro automática
    inputField.setAttribute("maxlength", "25"); // Evitamos que escriban comandos demasiado largos
};
