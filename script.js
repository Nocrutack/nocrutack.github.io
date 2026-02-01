const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 40;
let i = 0;

// Base de datos de temas (Info rápida para la terminal)
const temas = {
    "redes": "Abriendo interfaz gráfica de Redes...",
    "linux": "Abriendo interfaz gráfica de Linux...",
    "seguridad": "Abriendo interfaz gráfica de Seguridad..."
};

const inputField = document.getElementById('user-input');
const displayText = document.getElementById('display-text');
const consoleContent = document.getElementById('typing-text');
const contentDiv = document.querySelector('.content');

function typeWriter() {
    if (i < terminalText.length) {
        let char = terminalText.charAt(i);
        consoleContent.innerHTML += (char === "\n") ? "<br>" : char;
        i++;
        setTimeout(typeWriter, speed);
    } else {
        document.getElementById('input-line').style.display = "flex";
        inputField.focus();
    }
}

inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fullCommand = inputField.value.toLowerCase().trim();
        const parts = fullCommand.split(' ');
        const cmd = parts[0];
        const arg = parts[1];
        
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${fullCommand}<br>`;

        if (cmd === 'ls') {
            const lista = Object.keys(temas)
                .map(t => `<span style="color: #5cb3ff; font-weight: bold;">${t}</span>`)
                .join(' &nbsp;&nbsp; ');
            consoleContent.innerHTML += lista;
        } 
        else if (cmd === 'cd') {
            if (!arg) {
                consoleContent.innerHTML += "Uso: cd [nombre_del_tema]";
            } else if (temas[arg]) {
                consoleContent.innerHTML += temas[arg];
                // LLAMADA A LA FUNCIÓN DEL MONITOR
                setTimeout(() => { abrirMonitor(arg); }, 500);
            } else {
                consoleContent.innerHTML += `Error: La carpeta '${arg}' no existe.`;
            }
        } 
        else if (cmd === 'clear') {
            consoleContent.innerHTML = "Terminal limpia. Sistema listo.<br>";
        }
        else if (cmd === 'help') {
            consoleContent.innerHTML += "Comandos: ls, cd [tema], clear, help";
        }
        else if (fullCommand !== "") {
            consoleContent.innerHTML += `Comando no reconocido: ${cmd}`;
        }

        inputField.value = "";
        displayText.textContent = "";
        
        setTimeout(() => {
            contentDiv.scrollTop = contentDiv.scrollHeight;
        }, 10);
    }
});

// FUNCIONES DEL MONITOR (Fuera del event listener)
function abrirMonitor(tema) {
    const monitor = document.getElementById('monitor');
    const monitorBody = document.getElementById('monitor-body'); // Asegúrate de que este ID coincida con tu HTML
    
    const infoTemas = {
        "redes": "<h1>📁 Laboratorio de Redes</h1><p>Dominando protocolos TCP/IP y configuración Cisco.</p><img src='https://via.placeholder.com/400x200' style='width:100%; border-radius:10px;'>",
        "linux": "<h1>📁 Sistema Linux</h1><p>Administración de servidores y scripting en Bash.</p>",
        "seguridad": "<h1>📁 Seguridad Informática</h1><p>Análisis de vulnerabilidades y defensa activa.</p>"
    };

    monitorBody.innerHTML = infoTemas[tema];
    monitor.style.display = "flex";
}

function closeMonitor() {
    document.getElementById('monitor').style.display = "none";
    inputField.focus();
}

window.onload = typeWriter;
