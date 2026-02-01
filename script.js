const text = ">> Initializing NOCRUTACK_OS...\n>> System check: OK\n>> Welcome, Operator Nocrutack.\n>> Estudiando Ciberseguridad, Redes y Linux.\n>> Cargando módulos de Pentesting...\n>> Ready for action.";

const speed = 50; 
let i = 0;

function typeWriter() {
    if (i < text.length) {
        let char = text.charAt(i);
        if (char === "\n") {
            document.getElementById("typing-text").innerHTML += "<br>";
        } else {
            document.getElementById("typing-text").innerHTML += char;
        }
        i++;
        setTimeout(typeWriter, speed);
    } else {
        // Cuando termina de escribir, muestra el prompt final parpadeando
        document.getElementById("final-prompt").style.display = "block";
    }
}

window.onload = typeWriter;
