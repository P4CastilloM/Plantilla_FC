    // Función para actualizar los números de los jugadores en una tabla
    function actualizarNumeros(tabla) {
        const filas = tabla.querySelectorAll('tr');
        filas.forEach((fila, index) => {
            const celdaNumero = fila.querySelector('td');
            if (celdaNumero) {
                celdaNumero.textContent = index + 1;
            }
        });
    }

    // Selecciona todos los jugadores y les da la funcionalidad de arrastre
    const jugadores = document.querySelectorAll('tbody tr');
    jugadores.forEach(jugador => {
        jugador.draggable = true;

        jugador.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
            event.target.classList.add('dragging');
        });

        jugador.addEventListener('dragend', (event) => {
            event.target.classList.remove('dragging');
        });
    });

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
                const tablaDestino = event.target.closest('tbody');
                
                if (tablaDestino) {
                    tablaDestino.appendChild(jugadorArrastrado);
                    actualizarNumeros(tablaDestino);
                    if (tablaOrigen) {
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

    // --- FUNCIONALIDAD PARA LA CAPTURA ---

    const botonCapturar = document.getElementById('capturarBtn');
    
    // Capturaremos el body completo para incluir el fondo
    const elementoACapturar = document.body; 

    botonCapturar.addEventListener('click', () => {
        // Oculta el botón de captura antes de tomar la imagen
        botonCapturar.style.display = 'none';

        // Usa html2canvas para capturar el contenido del body
        html2canvas(elementoACapturar, {
            scale: 2, // Aumenta la resolución para mejor calidad
            backgroundColor: null, // Mantiene el fondo transparente del canvas si no hay bg en body
            allowTaint: true, // Permite imágenes de diferentes dominios (si aplica)
            useCORS: true // Permite capturar imágenes con CORS habilitado
        }).then(canvas => {
            const imagenUrl = canvas.toDataURL('image/png');

            const enlace = document.createElement('a');
            enlace.href = imagenUrl;
            enlace.download = 'plantilla-FC-Cogote-Salado.png'; 

            document.body.appendChild(enlace);
            enlace.click();
            document.body.removeChild(enlace);
        
            // Vuelve a mostrar el botón
            botonCapturar.style.display = 'block';
        });
    });