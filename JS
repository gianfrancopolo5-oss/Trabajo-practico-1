/* ============================================
   PUERTO VELA: JavaScript (Etapa 4)
   1. Modo oscuro
   2. Validación del formulario de contacto
   ============================================ */

/* --------------------------------------------
   1. MODO OSCURO
   Requiere un botón con id="btn-modo-oscuro".
   Agrega o saca la clase "modo-oscuro" del <body>;
   los colores los define el CSS con esa clase.
   -------------------------------------------- */

const botonModo = document.getElementById("btn-modo-oscuro");

// Aplica o quita el modo oscuro y actualiza el botón
function aplicarModo(oscuro) {
    document.body.classList.toggle("modo-oscuro", oscuro);

    if (botonModo) {
        botonModo.textContent = oscuro ? "Modo claro" : "Modo oscuro";
        botonModo.setAttribute("aria-pressed", String(oscuro));
    }
}

// Al cargar la página, recuperamos la preferencia guardada
let modoGuardado = "claro";
try {
    modoGuardado = localStorage.getItem("modo") || "claro";
} catch (error) {
    // Si el navegador no permite guardar, seguimos en modo claro
}
aplicarModo(modoGuardado === "oscuro");

// Al hacer clic, cambiamos de modo y lo guardamos
if (botonModo) {
    botonModo.addEventListener("click", function () {
        const pasaAOscuro = !document.body.classList.contains("modo-oscuro");
        aplicarModo(pasaAOscuro);

        try {
            localStorage.setItem("modo", pasaAOscuro ? "oscuro" : "claro");
        } catch (error) {
            // Si no se puede guardar, el cambio igual se ve en esta página
        }
    });
}

/* --------------------------------------------
   2. VALIDACIÓN DEL FORMULARIO DE CONTACTO
   Requiere un <form id="formulario-contacto"> con
   campos de id: "nombre", "email" y "mensaje".
   Los errores se muestran en <p class="mensaje-error">
   y el campo con error recibe la clase "campo-invalido".
   -------------------------------------------- */

const formulario = document.getElementById("formulario-contacto");

if (formulario) {
    const campoNombre = document.getElementById("nombre");
    const campoEmail = document.getElementById("email");
    const campoMensaje = document.getElementById("mensaje");

    // Muestra un mensaje de error debajo del campo
    function mostrarError(campo, texto) {
        limpiarError(campo);
        campo.classList.add("campo-invalido");

        const error = document.createElement("p");
        error.className = "mensaje-error";
        error.setAttribute("role", "alert");
        error.textContent = texto;
        campo.insertAdjacentElement("afterend", error);
    }

    // Saca el error de un campo, si lo tiene
    function limpiarError(campo) {
        campo.classList.remove("campo-invalido");

        const siguiente = campo.nextElementSibling;
        if (siguiente && siguiente.classList.contains("mensaje-error")) {
            siguiente.remove();
        }
    }

    // Cada validación devuelve true (ok) o false (hay error)
    function validarNombre() {
        const valor = campoNombre.value.trim();
        if (valor.length < 3) {
            mostrarError(campoNombre, "Ingresá tu nombre (mínimo 3 letras).");
            return false;
        }
        limpiarError(campoNombre);
        return true;
    }

    function validarEmail() {
        const valor = campoEmail.value.trim();
        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formatoEmail.test(valor)) {
            mostrarError(campoEmail, "Ingresá un email válido, por ejemplo nombre@correo.com.");
            return false;
        }
        limpiarError(campoEmail);
        return true;
    }

    function validarMensaje() {
        const valor = campoMensaje.value.trim();
        if (valor.length < 10) {
            mostrarError(campoMensaje, "El mensaje debe tener al menos 10 caracteres.");
            return false;
        }
        limpiarError(campoMensaje);
        return true;
    }

    // Mientras el usuario corrige, el error desaparece
    [campoNombre, campoEmail, campoMensaje].forEach(function (campo) {
        campo.addEventListener("input", function () {
            limpiarError(campo);
        });
    });

    // Al enviar: validamos todo antes de aceptar
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); // evita que la página se recargue

        // Se evalúan los tres para mostrar todos los errores juntos
        const nombreOk = validarNombre();
        const emailOk = validarEmail();
        const mensajeOk = validarMensaje();

        let exito = document.getElementById("mensaje-exito");
        if (exito) {
            exito.remove();
        }

        if (nombreOk && emailOk && mensajeOk) {
            exito = document.createElement("p");
            exito.id = "mensaje-exito";
            exito.setAttribute("role", "status");
            exito.textContent = "¡Gracias! Tu mensaje fue enviado correctamente.";
            formulario.insertAdjacentElement("afterend", exito);
            formulario.reset();
        }
    });
}
