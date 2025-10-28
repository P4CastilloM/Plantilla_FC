// Función para actualizar los números de los jugadores en una tabla
function actualizarNumeros(tabla) {
    const filas = tabla.querySelectorAll('tr');
    filas.forEach((fila, index) => {
        const celdaNumero = fila.querySelector('td:first-child'); // Más específico
        if (celdaNumero) {
            celdaNumero.textContent = index + 1;
        }
    });
}

/**
 * Función reutilizable para añadir eventos de arrastre a un jugador
 */
function addDragEvents(jugador) {
    jugador.draggable = true;

    jugador.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
        event.target.classList.add('dragging');
    });

    jugador.addEventListener('dragend', (event) => {
        event.target.classList.remove('dragging');
    });
}

// Selecciona todos los jugadores INICIALES y les da la funcionalidad de arrastre
const jugadores = document.querySelectorAll('tbody tr');
jugadores.forEach(addDragEvents); // Usamos la nueva función

// Selecciona las áreas donde se pueden soltar los jugadores
const equipos = document.querySelectorAll('table tbody');
equipos.forEach(equipo => {
    equipo.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    equipo.addEventListener('drop', (event) => {
        event.preventDefault();
        const idJugador = event.dataTransfer.getData('text/plain');
        const jugadorArrastrado = document.getElementById(idJugador);
        
        if (jugadorArrastrado) {
            const tablaOrigen = jugadorArrastrado.closest('tbody');
            // Aseguramos que el drop sea en el tbody, no en una fila
            const tablaDestino = event.target.closest('tbody'); 
            
            if (tablaDestino) {
                tablaDestino.appendChild(jugadorArrastrado);
                actualizarNumeros(tablaDestino);
                if (tablaOrigen && tablaOrigen !== tablaDestino) {
                    actualizarNumeros(tablaOrigen);
                }
            }
        }
    });
});

// Llamada inicial para asegurar que los números estén correctos al cargar
equipos.forEach(equipo => {
    actualizarNumeros(equipo);
});


// ============ LÓGICA DE MODALES (AÑADIR Y ELIMINAR) ============

// --- Referencias a elementos del DOM ---
const addPlayerModal = document.getElementById('addPlayerModal');
const deletePlayerModal = document.getElementById('deletePlayerModal');

const addPlayerBtn = document.getElementById('addPlayerBtn');
const deletePlayerBtn = document.getElementById('deletePlayerBtn');

const closeAddModal = document.getElementById('closeAddModal');
const closeDeleteModal = document.getElementById('closeDeleteModal');

const addPlayerForm = document.getElementById('addPlayerForm');
const deletePlayerForm = document.getElementById('deletePlayerForm');

const teamSelect = document.getElementById('teamSelect');
const playerNameInput = document.getElementById('playerNameInput');
const playerDeleteSelect = document.getElementById('playerDeleteSelect');

const equipoABody = document.getElementById('equipoA-body');
const equipoBBody = document.getElementById('equipoB-body');

// --- Lógica para abrir/cerrar modales ---
function openModal(modal) {
    modal.style.display = 'flex';
}
function closeModal(modal) {
    modal.style.display = 'none';
}

addPlayerBtn.addEventListener('click', () => openModal(addPlayerModal));
deletePlayerBtn.addEventListener('click', () => {
    populateDeleteDropdown(); // Actualiza la lista antes de mostrar
    openModal(deletePlayerModal);
});

closeAddModal.addEventListener('click', () => closeModal(addPlayerModal));
closeDeleteModal.addEventListener('click', () => closeModal(deletePlayerModal));

// Cierra el modal si se hace clic en el fondo
window.addEventListener('click', (event) => {
    if (event.target === addPlayerModal) {
        closeModal(addPlayerModal);
    }
    if (event.target === deletePlayerModal) {
        closeModal(deletePlayerModal);
    }
});

// --- Lógica para AÑADIR jugador ---
addPlayerForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita que la página se recargue

    const nombre = playerNameInput.value.trim().toUpperCase();
    const equipo = teamSelect.value;
    
    if (nombre === "") {
        alert("Por favor, ingrese un nombre.");
        return;
    }

    // 1. Crear la nueva fila (tr)
    const newPlayerRow = document.createElement('tr');
    // Generamos un ID único para el nuevo jugador
    newPlayerRow.id = `jugador-${new Date().getTime()}`; 

    // 2. Crear las celdas (td)
    const numCell = document.createElement('td');
    numCell.textContent = '...'; // Se actualizará con actualizarNumeros
    
    const nameCell = document.createElement('td');
    nameCell.textContent = nombre;

    // 3. Añadir celdas a la fila
    newPlayerRow.appendChild(numCell);
    newPlayerRow.appendChild(nameCell);

    // 4. AÑADIR EVENTOS DE ARRASTRE al nuevo jugador
    addDragEvents(newPlayerRow);

    // 5. Añadir la fila a la tabla correcta
    let targetTableBody;
    if (equipo === 'A') {
        targetTableBody = equipoABody;
    } else {
        targetTableBody = equipoBBody;
    }
    
    targetTableBody.appendChild(newPlayerRow);

    // 6. Actualizar números
    actualizarNumeros(targetTableBody);

    // 7. Limpiar y cerrar
    playerNameInput.value = '';
    closeModal(addPlayerModal);
});

// --- Lógica para ELIMINAR jugador ---

// Llena el dropdown de eliminación con los jugadores actuales
function populateDeleteDropdown() {
    playerDeleteSelect.innerHTML = '<option value="">Seleccione un jugador...</option>';
    
    const allPlayers = document.querySelectorAll('tbody tr');
    
    allPlayers.forEach(player => {
        const playerId = player.id;
        // Asumimos que el nombre está en la segunda celda (índice 1)
        const playerName = player.querySelectorAll('td')[1].textContent; 
        
        // No añadimos los "------" a la lista de eliminación
        if (playerName !== '------') {
            const option = document.createElement('option');
            option.value = playerId;
            option.textContent = playerName;
            playerDeleteSelect.appendChild(option);
        }
    });
}

// Maneja la eliminación
deletePlayerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const playerIdToDelete = playerDeleteSelect.value;
    
    if (playerIdToDelete === "") {
        alert("Por favor, seleccione un jugador.");
        return;
    }

    const playerElement = document.getElementById(playerIdToDelete);
    
    if (playerElement) {
        const tabla = playerElement.closest('tbody');
        playerElement.remove(); // Elimina el elemento
        actualizarNumeros(tabla); // Actualiza los números
    }
    
    closeModal(deletePlayerModal);
});


// --- FUNCIONALIDAD PARA LA CAPTURA (ACTUALIZADA) ---

const botonCapturar = document.getElementById('capturarBtn');
// const botonPlantilla1 = document.getElementById('plantilla1');
// Referencia a los nuevos botones
const botonAnadir = document.getElementById('addPlayerBtn');
const botonEliminar = document.getElementById('deletePlayerBtn');

const elementoACapturar = document.getElementById('capture-container'); 

botonCapturar.addEventListener('click', () => {
    // Oculta TODOS los botones antes de tomar la imagen
    botonCapturar.style.display = 'none';
    // botonPlantilla1.style.display = 'none';
    botonAnadir.style.display = 'none';   // OCULTA EL NUEVO BOTÓN
    botonEliminar.style.display = 'none'; // OCULTA EL NUEVO BOTÓN

    // Usa html2canvas para capturar el contenido del CONTENEDOR
    html2canvas(elementoACapturar, {
        scale: 2, 
        allowTaint: true, 
        useCORS: true 
    }).then(canvas => {
        const imagenUrl = canvas.toDataURL('image/png');

        const enlace = document.createElement('a');
        enlace.href = imagenUrl;
        enlace.download = 'plantilla-FC-Cogote-Salado.png'; 

        document.body.appendChild(enlace);
        enlace.click();
        document.body.removeChild(enlace);
    
        // Vuelve a mostrar TODOS los botones
        botonCapturar.style.display = 'block';
        // botonPlantilla1.style.display = 'inline-block'; // 'inline-block' para <a>
        botonAnadir.style.display = 'block';   // MUESTRA EL NUEVO BOTÓN
        botonEliminar.style.display = 'block'; // MUESTRA EL NUEVO BOTÓN
    });
});