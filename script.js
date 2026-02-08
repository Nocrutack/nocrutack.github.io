/* --- CONFIGURACIÓN DE DATOS --- */
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 30; // Velocidad de la animación de escritura
let i = 0;
let isTyping = true; // Estado para saber si el sistema está en carga inicial

// Temas válidos para redirección (deben coincidir con nombres de archivos .html)
const temas = {
    "redes": true,
    "linux": true,
    "seguridad": true
};

/* --- SELECTORES DEL DOM --- */
const inputField = document.getElementById('user-input');
const displayText = document.getElementById('display-text');
const consoleContent = document.getElementById('typing-text');
const contentDiv = document.querySelector('.content');
const themeToggle = document.getElementById('theme-toggle');

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    if (i < terminalText.length) {
        let char = terminalText.charAt(i);
        // Inserta un salto de línea HTML si detecta \n, de lo contrario inserta el carácter
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++;
        setTimeout(typeWriter, speed);
        // Auto-scroll hacia abajo mientras escribe
        contentDiv.scrollTop = contentDiv.scrollHeight;
    } else {
        finishLoading();
    }
}

// Finaliza la animación y habilita la interacción del usuario
function finishLoading() {
    if (!isTyping) return;
    isTyping = false;
    consoleContent.innerHTML = terminalText.replace(/\n/g, "<br>");
    document.getElementById('input-line').style.display = "flex";
    inputField.focus();
}

/* --- LÓGICA DE PERSISTENCIA Y CAMBIO DE TEMA --- */

/**
 * Aplica el tema visual y actualiza el botón
 * @param {string} theme - 'light' o 'dark'
 */
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeToggle) themeToggle.innerText = 'MODO OSCURO';
    } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeToggle) themeToggle.innerText = 'MODO CLARO';
    }
}

// Al cargar el script, recuperamos la preferencia guardada en el navegador
const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme);

// Evento para el botón de cambio de modo
if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
        // Evitamos que el click "salga" del botón y dispare otros eventos
        e.stopPropagation(); 
        
        const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isCurrentlyLight ? 'dark' : 'light';
        
        applyTheme(nextTheme);
        localStorage.setItem('theme', nextTheme); // Guardamos la elección para otras páginas
        inputField.focus(); // Mantenemos el foco en la terminal
    });
}

/* --- EVENTOS DE TECLADO --- */

// Saltar la animación de intro al presionar Enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) finishLoading();
});

// Sincronizar el input invisible con lo que se ve en pantalla
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Procesador de comandos de la terminal
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim();
        const parts = rawInput.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        // Mostrar el comando ejecutado en la consola
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        /* --- LÓGICA DE COMANDOS --- */
        
        if (cmd === 'ls') {
            // Genera la lista de temas disponibles con colores
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        
        else if (cmd === 'cd') {
            // Navegación a las páginas de los módulos
            if (arg && temas[arg]) {
                consoleContent.innerHTML += `<span style="color: #27c93f;">Abriendo entorno de ${arg}...</span>`;
                setTimeout(() => { 
                    window.location.href = arg + ".html"; 
                }, 800); 
            } else {
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado.</span>`;
            }
        }
        
        else if (cmd === 'clear') {
            // Limpia el historial visual
            consoleContent.innerHTML = "Terminal limpia.<br>";
        }
        
        else if (cmd === 'help') {
            consoleContent.innerHTML += "Comandos: ls, cd [tema], clear, help";
        }
        
        else if (rawInput !== "") {
            consoleContent.innerHTML += `<span style="color: #ff5f56;">Comando '${cmd}' no reconocido.</span>`;
        }

        // Limpiar entrada
        inputField.value = "";
        displayText.textContent = "";
        
        // Scroll automático al final después de cada comando
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- ANIMACIÓN DE FONDO (MATRIX) --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    
    // Ajustar el canvas al tamaño de la ventana
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    
    const binary = "01";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    // Inicializar posiciones de las gotas
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        // Fondo semitransparente para crear el efecto de rastro (trail)
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#003300"; // Color del texto matrix
        ctx.font = fontSize + "px monospace";
        
        for (let i = 0; i < drops.length; i++) {
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            // Si llega al final de la pantalla, vuelve arriba con probabilidad aleatoria
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50);
}

// Inicialización al cargar la ventana
window.onload = () => {
    typeWriter();
    inputField.setAttribute("maxlength", "15");
};
