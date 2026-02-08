/* --- CONFIGURACIÓN DE DATOS --- */
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 30; // Velocidad de la animación de escritura
let i = 0;
let isTyping = true; // Estado para saber si el sistema está en carga inicial

// Contenido que se mostrará en el Monitor al usar 'cd'
const temas = {
    "redes": "<h1>📁 Laboratorio de Redes</h1><p>Dominando protocolos TCP/IP y configuración Cisco.</p>",
    "linux": "<h1>📁 Sistema Linux</h1><p>Administración de servidores y scripting en Bash.</p>",
    "seguridad": "<h1>📁 Seguridad Informática</h1><p>Análisis de vulnerabilidades y defensa activa.</p>"
};

/* --- SELECTORES DEL DOM --- */
const inputField = document.getElementById('user-input'); // El input real oculto
const displayText = document.getElementById('display-text'); // Lo que el usuario ve que escribe
const consoleContent = document.getElementById('typing-text'); // El área de historial de la terminal
const contentDiv = document.querySelector('.content'); // Contenedor para hacer scroll automático

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    if (i < terminalText.length) {
        let char = terminalText.charAt(i);
        // Convierte saltos de línea en etiquetas <br> para HTML
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++;
        setTimeout(typeWriter, speed);
        contentDiv.scrollTop = contentDiv.scrollHeight; // Mantiene el scroll al final
    } else {
        finishLoading(); // Activa la terminal cuando termina de escribir
    }
}

// Finaliza la carga y muestra el prompt de escritura
function finishLoading() {
    if (!isTyping) return;
    isTyping = false;
    consoleContent.innerHTML = terminalText.replace(/\n/g, "<br>");
    document.getElementById('input-line').style.display = "flex"; // Muestra la línea de entrada
    inputField.focus(); // Pone el cursor listo para escribir
}

/* --- EVENTOS DE TECLADO --- */

// Saltar la intro si el usuario presiona Enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) finishLoading();
});

// Sincroniza el input oculto con el texto visual de la terminal
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Procesador de comandos al presionar Enter
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim(); // Entrada limpia de espacios
        const parts = rawInput.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        // Escribe el comando que el usuario acaba de enviar en la consola
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        /* --- LÓGICA ESTRICTA DE COMANDOS --- */
        
        // 1. Comando LS: Solo funciona si escribes exactamente 'ls'
        if (rawInput === 'ls') {
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        
        // 2. Comando CD: Requiere el comando + un tema válido (ej: cd redes)
        else if (cmd === 'cd') {
            if (parts.length === 2 && temas[arg]) {
                consoleContent.innerHTML += `Accediendo a ${arg}...`;
                setTimeout(() => { abrirMonitor(arg); }, 500);
            } else {
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado.</span>`;
            }
        }
        
        // 3. Otros comandos básicos
        else if (rawInput === 'clear') {
            consoleContent.innerHTML = "Terminal limpia.<br>";
        }
        else if (rawInput === 'help') {
            consoleContent.innerHTML += "Comandos: ls, cd [tema], clear";
        }
        else if (rawInput !== "") {
            consoleContent.innerHTML += `<span style="color: #ff5f56;">Comando no reconocido.</span>`;
        }

        // Limpia el input para el siguiente comando
        inputField.value = "";
        displayText.textContent = "";
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- FUNCIONES DE INTERFAZ (MONITOR) --- */
function abrirMonitor(tema) {
    const monitor = document.getElementById('monitor');
    const monitorBody = document.getElementById('monitor-body');
    const titleElem = document.getElementById('monitor-title');

    if (titleElem) titleElem.innerText = `Explorando: ${tema}`;
    monitorBody.innerHTML = temas[tema];
    monitor.style.display = "flex";
}

function closeMonitor() {
    document.getElementById('monitor').style.display = "none";
    inputField.focus(); // Devuelve el foco a la terminal al cerrar
}

/* --- ANIMACIÓN DE FONDO (MATRIX BINARIO) --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const binary = "01"; // Caracteres de la lluvia
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    // Inicializa la posición de las gotas
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)"; // Efecto de rastro
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#003300"; // Color verde oscuro tenue
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Reinicia la gota al llegar al final de la pantalla aleatoriamente
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50); // Velocidad de la lluvia
}

/* --- INICIALIZACIÓN AL CARGAR LA PÁGINA --- */
window.onload = () => {
    typeWriter();
    inputField.setAttribute("maxlength", "15"); // Seguridad estética
};
