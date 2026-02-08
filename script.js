/* --- CONFIGURACIÓN DE DATOS --- */
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 30; // Velocidad de la animación de escritura
let i = 0;
let isTyping = true; // Estado para saber si el sistema está en carga inicial

// Temas válidos para redirección
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

/* --- MOTOR DE ESCRITURA (INTRO) --- */
function typeWriter() {
    if (i < terminalText.length) {
        let char = terminalText.charAt(i);
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++;
        setTimeout(typeWriter, speed);
        contentDiv.scrollTop = contentDiv.scrollHeight;
    } else {
        finishLoading();
    }
}

function finishLoading() {
    if (!isTyping) return;
    isTyping = false;
    consoleContent.innerHTML = terminalText.replace(/\n/g, "<br>");
    document.getElementById('input-line').style.display = "flex";
    inputField.focus();
}

/* --- EVENTOS DE TECLADO --- */

// Saltar intro con Enter
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && isTyping) finishLoading();
});

// Sincronizar input visual
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Procesador de comandos
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim();
        const parts = rawInput.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        /* --- LÓGICA DE NAVEGACIÓN --- */
        
        if (rawInput === 'ls') {
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        
        else if (cmd === 'cd') {
            if (parts.length === 2 && temas[arg]) {
                consoleContent.innerHTML += `<span style="color: #27c93f;">Abriendo entorno de ${arg}...</span>`;
                
                // REDIRECCIÓN REAL A OTRA PÁGINA
                setTimeout(() => { 
                    window.location.href = arg + ".html"; 
                }, 800); 

            } else {
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado.</span>`;
            }
        }
        
        else if (rawInput === 'clear') {
            consoleContent.innerHTML = "Terminal limpia.<br>";
        }
        else if (rawInput === 'help') {
            consoleContent.innerHTML += "Comandos: ls, cd [tema], clear";
        }
        else if (rawInput !== "") {
            consoleContent.innerHTML += `<span style="color: #ff5f56;">Comando no reconocido.</span>`;
        }

        inputField.value = "";
        displayText.textContent = "";
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- ANIMACIÓN DE FONDO (MATRIX) --- */
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    const binary = "01";
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let x = 0; x < columns; x++) drops[x] = 1;

    function drawMatrix() {
        ctx.fillStyle = "rgba(13, 13, 13, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#003300";
        ctx.font = fontSize + "px monospace";
        for (let i = 0; i < drops.length; i++) {
            const text = binary.charAt(Math.floor(Math.random() * binary.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50);
}

window.onload = () => {
    typeWriter();
    inputField.setAttribute("maxlength", "15");
};
