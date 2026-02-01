const text = ">> Initializing NOCRUTACK_OS...\n>> System check: OK\n>> Welcome, Operator Nocrutack.\n>> Ready for action.";
const speed = 50; 
let i = 0;

const inputField = document.getElementById('user-input');
const displayText = document.getElementById('display-text');
const inputLine = document.getElementById('input-line');

function typeWriter() {
    if (i < text.length) {
        let char = text.charAt(i);
        document.getElementById("typing-text").innerHTML += (char === "\n") ? "<br>" : char;
        i++;
        setTimeout(typeWriter, speed);
    } else {
        inputLine.style.display = "flex";
        inputField.focus();
    }
}

// Escuchar lo que el usuario escribe
inputField.addEventListener('input', (e) => {
    displayText.textContent = e.target.value;
});

// Escuchar cuando presiona Enter
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        // Al dar enter, simplemente limpiamos para "no hacer nada"
        e.preventDefault();
        inputField.value = "";
        displayText.textContent = "";
        // Podrías añadir un "Command not found" aquí si quisieras más realismo
    }
});

window.onload = typeWriter;
