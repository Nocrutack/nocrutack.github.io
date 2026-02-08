/* --- CONFIGURACIÓN DE DATOS --- */
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 30; // Milisegundos entre cada letra
let i = 0;
let isTyping = true; // Bloquea el input mientras se escribe la intro

// Directorios válidos que existen como archivos .html separados
const temas = {
    "redes": true,
    "linux": true,
    "seguridad": true
};

/* --- SELECTORES DEL DOM --- */
const inputField = document.getElementById('user-input'); // Input oculto que captura las teclas
const displayText = document.getElementById('display-text'); // Lo que el usuario ve en pantalla
const consoleContent = document.getElementById('typing-text'); // Historial de la terminal
const contentDiv = document.querySelector('.content'); // Contenedor para controlar el scroll
const themeToggle = document.getElementById('theme-toggle'); // Botón de cambio de modo

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    if (i < terminalText.length) {
        let char = terminalText.charAt(i);
        // Convierte los saltos de línea del string en etiquetas HTML <br>
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++;
        setTimeout(typeWriter, speed);
        // Baja el scroll automáticamente mientras escribe
        contentDiv.scrollTop = contentDiv.scrollHeight;
    } else {
        finishLoading(); // Activa la terminal al terminar
    }
}

function finishLoading() {
    if (!isTyping) return;
    isTyping = false;
    // Asegura que todo el texto de la intro esté visible
    consoleContent.innerHTML = terminalText.replace(/\n/g, "<br>");
    // Muestra la línea de prompt (nocrutack@lab:~$ )
    document.getElementById('input-line').style.display = "flex";
    inputField.focus(); // Pone el cursor listo para escribir
}

/* --- LÓGICA DE CAMBIO DE MODO (CLARO/OSCURO) --- */
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        // Obtenemos el estado actual del atributo 'data-theme' en el HTML
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        
        // Si estaba en claro, ponemos oscuro (null). Si estaba oscuro, ponemos claro ('light')
        document.documentElement.setAttribute('data-theme', isLight ? '' : 'light');
        
        // Cambiamos el texto del botón para que el usuario sepa qué pasará al hacer clic
        themeToggle.innerText = isLight ? 'MODO CLARO' : 'MODO OSCURO';
        
        // Devolvemos el foco al input para que el usuario pueda seguir escribiendo sin cliquear
        inputField.focus();
    });
}

/* --- EVENTOS DE TECLADO --- */

// Si el usuario presiona Enter durante la intro, esta se completa instantáneamente
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) finishLoading();
});

// Refleja en tiempo real lo que se escribe en el input oculto hacia el span visual
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Procesador de comandos cuando se presiona Enter
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim();
        const parts = rawInput.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        // Imprime el comando ejecutado en el historial de la consola
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        /* --- LÓGICA DE COMANDOS --- */
        
        // COMANDO: ls (Listar temas)
        if (rawInput === 'ls') {
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        
        // COMANDO: cd [tema] (Navegar a otra página)
        else if (cmd === 'cd') {
            if (parts.length === 2 && temas[arg]) {
                consoleContent.innerHTML += `<span style="color: #27c93f;">Abriendo entorno de ${arg}...</span>`;
                
                // Espera 800ms para que el usuario lea el mensaje antes de cambiar de página
                setTimeout(() => { 
                    window.location.href = arg + ".html"; 
                }, 800); 

            } else {
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado.</span>`;
            }
        }
        
        // COMANDO: clear (Limpiar pantalla)
        else if (rawInput === 'clear') {
            consoleContent.innerHTML = "Terminal limpia.<br>";
        }
        // COMANDO: help (Ayuda rápida)
        else if (rawInput === 'help') {
            consoleContent.innerHTML += "Comandos disponibles: ls, cd [tema], clear, help";
        }
        // CASO: Comando no válido
        else if (rawInput !== "") {
            consoleContent.innerHTML += `<span style="color: #ff5f56;">Comando '${cmd}' no reconocido.</span>`;
        }

        // Resetea el input para el siguiente comando
        inputField.value = "";
        displayText.textContent = "";
        // Mantiene el scroll al fondo después de la respuesta
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- ANIMACIÓN DE FONDO (MATRIX BINARIO) --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const binary = "01";
    const fontSize = 16;
    const columns = canvas.width / fontSize; // Número de columnas basado en el ancho
    const drops = [];
    
    // Inicializa la altura de cada columna de gotas
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        // Crea el rastro de desvanecimiento
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Color de los bits
        ctx.fillStyle = "#003300"; 
        ctx.font = fontSize + "px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Si la gota llega al final o por azar, regresa arriba
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50); // Velocidad de la lluvia (50ms)
}

// Se ejecuta al terminar de cargar la página
window.onload = () => {
    typeWriter(); // Inicia la intro
    inputField.setAttribute("maxlength", "15"); // Límite estético de comandos
};
