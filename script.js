const terminalText = ">> NOCRUTACK OS v1.0.4\n>> Cargando módulos de aprendizaje...\n>> Escribe 'ls' para ver mis temas o 'help' para ayuda.";
const speed = 40;
let i = 0;

// Base de datos de tus temas
const temas = {
    "redes": "Nivel: Intermedio. Dominando protocolos TCP/IP, DNS y configuración de Routers Cisco.",
    "linux": "Nivel: Avanzado. Manejo de Bash, permisos de usuario y administración de servidores Debian.",
    "seguridad": "Nivel: Iniciando. Aprendiendo escaneo de vulnerabilidades y OWASP Top 10."
};

const inputField = document.getElementById('user-input');
const displayText = document.getElementById('display-text');
const consoleContent = document.getElementById('typing-text');

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
        const [cmd, arg] = fullCommand.split(' ');
        
        // Crear una nueva línea para mostrar el comando que escribiste
        consoleContent.innerHTML += `<br><span class="prompt">nocrutack@lab:~$</span> ${fullCommand}<br>`;

        if (cmd === 'ls') {
            consoleContent.innerHTML += Object.keys(temas).join(' &nbsp;&nbsp; ');
        } 
        else if (cmd === 'cd') {
            if (temas[arg]) {
                consoleContent.innerHTML += temas[arg];
            } else {
                consoleContent.innerHTML += `Error: La carpeta '${arg}' no existe.`;
            }
        } 
        else if (cmd === 'clear') {
            consoleContent.innerHTML = "Terminal limpia. Sistema listo.";
        }
        else if (cmd === 'help') {
            consoleContent.innerHTML += "Comandos disponibles: ls (listar temas), cd [nombre] (leer tema), clear (limpiar).";
        }
        else if (fullCommand !== "") {
            consoleContent.innerHTML += `Comando no reconocido: ${cmd}`;
        }

        // Limpiar input y hacer scroll hacia abajo
        inputField.value = "";
        displayText.textContent = "";
        window.scrollTo(0, document.body.scrollHeight);
    }
});

window.onload = typeWriter;
