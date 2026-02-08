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
const inputField = document.getElementById('user-input'); // El input real (invisible)
const displayText = document.getElementById('display-text'); // El texto que el usuario ve mientras escribe
const consoleContent = document.getElementById('typing-text'); // El área donde se imprime el historial
const contentDiv = document.querySelector('.content'); // El contenedor principal para manejar el scroll
const themeToggle = document.getElementById('theme-toggle'); // El botón de interruptor de luz/oscuridad

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    // Si aún quedan letras por escribir en el string terminalText
    if (i < terminalText.length) {
        let char = terminalText.charAt(i); // Obtiene el carácter actual
        // Si el carácter es un salto de línea (\n), añade un <br>, si no, añade la letra
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++; // Avanza al siguiente carácter
        setTimeout(typeWriter, speed); // Llama a la función de nuevo tras el tiempo definido
        contentDiv.scrollTop = contentDiv.scrollHeight; // Desplaza el scroll al fondo automáticamente
    } else {
        finishLoading(); // Al terminar de escribir, habilita la terminal
    }
}

// Función para preparar la interfaz tras la carga inicial
function finishLoading() {
    if (!isTyping) return; // Evita ejecuciones dobles
    isTyping = false; // Cambia el estado a "ya no está cargando"
    consoleContent.innerHTML = terminalText.replace(/\n/g, "<br>"); // Asegura que el texto esté completo
    document.getElementById('input-line').style.display = "flex"; // Muestra la línea de comandos
    inputField.focus(); // Pone el cursor automáticamente en el campo de texto
}

/* --- LÓGICA DE PERSISTENCIA Y CAMBIO DE TEMA --- */

// Función central para cambiar el aspecto visual
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light'); // Activa el modo claro en el CSS
        if (themeToggle) themeToggle.innerText = 'MODO OSCURO'; // Cambia la etiqueta del botón
    } else {
        document.documentElement.removeAttribute('data-theme'); // Elimina el atributo para volver a oscuro
        if (themeToggle) themeToggle.innerText = 'MODO CLARO'; // Cambia la etiqueta del botón
    }
}

// Al cargar el archivo, busca si el usuario ya tenía un tema preferido guardado
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme); // Si existe, lo aplica de inmediato

// Escuchador de clics para el botón de cambio de tema
if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el clic se propague a otros elementos
        // Comprueba si el tema actual es claro
        const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isCurrentlyLight ? 'dark' : 'light'; // Define el siguiente estado
        
        applyTheme(nextTheme); // Aplica el nuevo tema visualmente
        localStorage.setItem('theme', nextTheme); // Guarda la elección en la memoria del navegador
        inputField.focus(); // Devuelve el foco a la terminal para seguir escribiendo
    });
}

/* --- EVENTOS DE TECLADO --- */

// Permite saltarse la intro presionando la tecla Enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) finishLoading();
});

// Actualiza el texto visible en pantalla cada vez que el usuario escribe en el input invisible
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Manejador principal de comandos cuando se presiona Enter
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim(); // Obtiene el texto sin espacios extras
        const parts = rawInput.split(' '); // Divide el comando de los argumentos
        const cmd = parts[0].toLowerCase(); // La primera palabra es el comando
        const arg = parts[1] ? parts[1].toLowerCase() : null; // La segunda palabra (si existe) es el argumento

        // Imprime el comando que acabas de escribir en el historial de la terminal
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        /* --- LÓGICA DE COMANDOS --- */
        
        if (cmd === 'ls') {
            // Muestra los nombres de los temas configurados en el objeto 'temas'
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        
        else if (cmd === 'cd') {
            // Verifica si el argumento existe y está en nuestra lista de temas
            if (arg && temas[arg]) {
                consoleContent.innerHTML += `<span style="color: #27c93f;">Abriendo entorno de ${arg}...</span>`;
                setTimeout(() => { 
                    window.location.href = arg + ".html"; // Redirige al archivo .html correspondiente
                }, 800); 
            } else {
                // Mensaje de error si el directorio no existe
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado.</span>`;
            }
        }
        
        else if (cmd === 'clear') {
            // Resetea el contenido de la consola
            consoleContent.innerHTML = "Terminal limpia.<br>";
        }
        
        else if (cmd === 'help') {
            // Lista de comandos útiles para el usuario
            consoleContent.innerHTML += "Comandos: ls, cd [tema], clear, help";
        }
        
        else if (rawInput !== "") {
            // Respuesta para cualquier texto que no sea un comando válido
            consoleContent.innerHTML += `<span style="color: #ff5f56;">Comando '${cmd}' no reconocido.</span>`;
        }

        // Limpia el input y el texto visual para el siguiente comando
        inputField.value = "";
        displayText.textContent = "";
        
        // Pequeño delay para asegurar que el scroll baje después de que el DOM se actualice
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- ANIMACIÓN DE FONDO (MATRIX) --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Configura el lienzo para ocupar toda la ventana del navegador
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    const binary = "01"; // Caracteres que caerán en la lluvia
    const fontSize = 16; // Tamaño de la fuente de los caracteres
    const columns = canvas.width / fontSize; // Número de columnas basado en el ancho
    const drops = []; // Array para rastrear la posición Y de cada columna
    
    // Inicializa todas las columnas en la posición Y = 1 (arriba)
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        // Pinta un fondo negro muy transparente para crear el efecto de "estela" o rastro
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#003300"; // Color verde oscuro para los bits
        ctx.font = fontSize + "px monospace"; // Fuente estilo consola
        
        // Itera sobre cada columna para dibujar el carácter
        for (let i = 0; i < drops.length; i++) {
            // Elige un carácter aleatorio (0 o 1)
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            // Dibuja el carácter en la posición X, Y actual
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Si la gota pasa el final de la pantalla, tiene una probabilidad de volver al inicio
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++; // Incrementa la posición Y para la siguiente iteración
        }
    }
    // Ejecuta la función de dibujo cada 50 milisegundos
    setInterval(drawMatrix, 50);
}

// Acción final cuando la ventana termina de cargar todos los recursos
window.onload = () => {
    typeWriter(); // Inicia la secuencia de bienvenida
    inputField.setAttribute("maxlength", "15"); // Limita la longitud de los comandos por estética
};
