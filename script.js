/* --- CONFIGURACIÓN DE DATOS --- */
const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 30;
let i = 0;
let isTyping = true; 

const temas = {
    "redes": "<h1>📁 Laboratorio de Redes</h1><p>Dominando protocolos TCP/IP y configuración Cisco.</p>",
    "linux": "<h1>📁 Sistema Linux</h1><p>Administración de servidores y scripting en Bash.</p>",
    "seguridad": "<h1>📁 Seguridad Informática</h1><p>Análisis de vulnerabilidades y defensa activa.</p>"
};

/* --- SELECTORES --- */
const inputField = document.getElementById('user-input');
const displayText = document.getElementById('display-text');
const consoleContent = document.getElementById('typing-text');
const contentDiv = document.querySelector('.content');

/* --- MOTOR DE ESCRITURA --- */
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
window.addEventListener('keydown', (e) => {
    // Permite saltar la intro con Enter
    if (e.key === 'Enter' && isTyping) finishLoading();
});

inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !isTyping) {
        const rawInput = inputField.value.trim();
        const parts = rawInput.split(' ');
        const cmd = parts[0].toLowerCase();
        const arg = parts[1] ? parts[1].toLowerCase() : null;

        // Imprimir comando en terminal
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${rawInput}<br>`;

        // LÓGICA DE COMANDOS ESTRICTA
        if (rawInput === 'ls') {
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        else if (cmd === 'cd') {
            // Validación: Solo 'cd' + 'tema' (exactamente 2 partes)
            if (parts.length === 2 && temas[arg]) {
                consoleContent.innerHTML += `Accediendo a ${arg}...`;
                setTimeout(() => { abrirMonitor(arg); }, 500);
            } else {
                consoleContent.innerHTML += `<span style="color: #ff5f56;">Error: Directorio '${arg || ""}' no encontrado o comando inválido.</span>`;
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

        // Reset de input
        inputField.value = "";
        displayText.textContent = "";
        setTimeout(() => { contentDiv.scrollTop = contentDiv.scrollHeight; }, 10);
    }
});

/* --- FUNCIONES DE INTERFAZ --- */
function abrirMonitor(tema) {
    const monitor = document.getElementById('monitor');
    const monitorBody = document.getElementById('monitor-body');
    const monitorTitle = document.getElementById('monitor-title');

    if(monitorTitle) monitorTitle.innerText = `Explorador: /${tema}`;
    monitorBody.innerHTML = temas[tema];
    monitor.style.display = "flex";
}

function closeMonitor() {
    document.getElementById('monitor').style.display = "none";
    inputField.focus();
}

/* --- INICIO --- */
window.onload = () => {
    typeWriter();
    inputField.setAttribute("maxlength", "15"); // Límite de caracteres
};
