const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 40;
let i = 0;

// Base de datos de temas
const temas = {
    "redes": "Nivel: Intermedio. Dominando protocolos TCP/IP, DNS y configuración de Routers Cisco.",
    "linux": "Nivel: Avanzado. Manejo de Bash, permisos de usuario y administración de servidores Debian.",
    "seguridad": "Nivel: Iniciando. Aprendiendo escaneo de vulnerabilidades y OWASP Top 10."
};

const inputField = document.getElementById('user-input');
const displayText = document.getElementById('display-text');
const consoleContent = document.getElementById('typing-text');
const contentDiv = document.querySelector('.content');

// Función de escritura inicial
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

// Escuchar el teclado para mostrar lo que escribes
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Lógica de comandos al presionar Enter
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const fullCommand = inputField.value.toLowerCase().trim();
        const parts = fullCommand.split(' ');
        const cmd = parts[0];
        const arg = parts[1];
        
        // 1. Mostrar el comando ingresado en la pantalla
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${fullCommand}<br>`;

        // 2. Procesar comandos
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
            } else {
                consoleContent.innerHTML += `Error: La carpeta '${arg}' no existe.`;
            }
        } 
        else if (cmd === 'clear') {
            consoleContent.innerHTML = "Terminal limpia. Sistema listo.<br>";
        }
        else if (cmd === 'help') {
            consoleContent.innerHTML += "Comandos disponibles: <br> - ls: Listar temas <br> - cd [tema]: Leer contenido <br> - clear: Limpiar pantalla";
        }
        else if (fullCommand !== "") {
            consoleContent.innerHTML += `Comando no reconocido: ${cmd}`;
        }

        // 3. Limpiar entrada y forzar scroll hacia abajo
        inputField.value = "";
        displayText.textContent = "";
        
        // Pequeño retraso para asegurar que el DOM se actualice antes del scroll
        setTimeout(() => {
            contentDiv.scrollTop = contentDiv.scrollHeight;
        }, 10);
    }
});

// Iniciar terminal
window.onload = typeWriter;
