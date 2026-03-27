/* --- CONFIGURACIÓN DE DATOS --- */
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de la Newsletter...\n>> Desencriptando base de datos...\n>> Sistema listo.";
const speed = 40; 
let i = 0; 
let isTyping = true; 

/* --- SELECTORES DEL DOM --- */
const inputField = document.getElementById('user-input'); 
const displayText = document.getElementById('display-text'); 
const consoleContent = document.getElementById('typing-text'); 
const contentDiv = document.querySelector('.content'); 
const newsletterContent = document.getElementById('newsletter-content');
const inputLine = document.getElementById('input-line');
const themeToggle = document.getElementById('theme-toggle'); 
const terminalWindow = document.querySelector('.terminal');

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    if (i < terminalText.length) {
        let char = terminalText.charAt(i); 
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++; 
        setTimeout(typeWriter, speed); 
        contentDiv.scrollTop = contentDiv.scrollHeight; 
    } else {
        setTimeout(finishLoading, 600); // Pausa dramática
    }
}

function finishLoading() {
    if (!isTyping) return; 
    isTyping = false; 
    
    // Ocultar texto de carga y mostrar la newsletter interactiva
    consoleContent.style.display = "none";
    newsletterContent.style.display = "block"; 
    inputLine.style.display = "flex"; 
    
    inputField.focus(); 
    contentDiv.scrollTop = 0; // Volver arriba
}

/* --- LÓGICA DE PERSISTENCIA Y CAMBIO DE TEMA --- */
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light'); 
        if (themeToggle) themeToggle.innerText = 'MODO OSCURO'; 
    } else {
        document.documentElement.removeAttribute('data-theme'); 
        if (themeToggle) themeToggle.innerText = 'MODO CLARO'; 
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) applyTheme(savedTheme); 

if (themeToggle) {
    themeToggle.addEventListener('click', (e) => {
        e.stopPropagation(); 
        const isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        const nextTheme = isCurrentlyLight ? 'dark' : 'light'; 
        
        applyTheme(nextTheme); 
        localStorage.setItem('theme', nextTheme); 
        if(!isTyping) inputField.focus(); 
    });
}

/* --- EVENTOS DE TECLADO E INTERACCIÓN --- */

// Saltar intro al presionar Enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) {
        i = terminalText.length;
        finishLoading();
    }
});

// Sincronizar input oculto con texto visible
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Forzar el focus al input al hacer clic en la terminal (ideal para móviles)
terminalWindow.addEventListener('click', () => {
    if (!isTyping) inputField.focus();
});

// Procesador de comandos
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim(); 
        const cmd = rawInput.toLowerCase(); 

        // Creamos un nuevo elemento div para el registro (log)
        const logEntry = document.createElement('div');
        logEntry.style.marginBottom = "10px";
        logEntry.style.marginTop = "10px";
        logEntry.style.fontFamily = "inherit";
        logEntry.style.fontSize = "13px";
        
        // Imprimimos el comando que el usuario escribió
        const userCommand = document.createElement('div');
        userCommand.innerHTML = `<span class="prompt">nocrutack@news:~$</span> ${rawInput}`;
        newsletterContent.appendChild(userCommand);

        // Lógica de los comandos
        if (cmd === 'clear') {
            document.getElementById('news-feed').innerHTML = ''; // Borra las noticias
            logEntry.innerHTML = "<span style='color: #4599ff;'>Sistema: Interfaz limpiada.</span>";
        } 
        else if (cmd === 'help') {
            logEntry.innerHTML = "<span style='color: #27c93f;'>Comandos: clear, update, whoami, help</span>";
        }
        else if (cmd === 'update') {
            logEntry.innerHTML = "<span style='color: #ffbd2e;'>[!] Conectando al servidor... No hay nuevas publicaciones.</span>";
        }
        else if (cmd === 'whoami') {
            logEntry.innerHTML = "<span>Usuario invitado.</span>";
        }
        else if (rawInput !== "") {
            logEntry.innerHTML = `<span style='color: #ff5f56;'>sh: comando no encontrado: ${rawInput}</span>`;
        }

        // Añadimos la respuesta al final del contenedor de noticias
        if (rawInput !== "") {
            newsletterContent.appendChild(logEntry);
        }

        // Limpiamos la entrada
        inputField.value = "";
        displayText.textContent = "";
        
        // Desplazamiento suave hacia abajo para ver la respuesta
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- ANIMACIÓN DE MATRIX DE FONDO --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d'); 
    
    function resizeCanvas() {
        canvas.height = window.innerHeight;
        canvas.width = window.innerWidth;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const binary = "01"; 
    const fontSize = 16; 
    let columns = canvas.width / fontSize; 
    let drops = []; 
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)"; // Rastro semi-transparente
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#003300"; // Color del texto de fondo
        ctx.font = fontSize + "px monospace"; 
        
        // Recalcular columnas por si se redimensiona la ventana
        if (drops.length !== Math.floor(canvas.width / fontSize)) {
            columns = Math.floor(canvas.width / fontSize);
            drops = [];
            for (let x = 0; x < columns; x++) drops[x] = 1;
        }

        for (let i = 0; i < drops.length; i++) {
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++; 
        }
    }
    setInterval(drawMatrix, 50);
}

// Iniciar aplicación
window.onload = () => {
    typeWriter(); 
};
