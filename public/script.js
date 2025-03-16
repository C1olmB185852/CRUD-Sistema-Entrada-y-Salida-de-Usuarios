document.addEventListener('DOMContentLoaded', () => {
    const formEntrada = document.getElementById('form-entrada');
    const formSalida = document.getElementById('form-salida');
    const tablaRegistros = document.getElementById('tabla-registros').getElementsByTagName('tbody')[0];

    const cargarRegistros = async () => { // Función para cargar registros
        try {
            const response = await fetch('/registros');
            if (!response.ok) {
                throw new Error('Error al cargar los registros');
            }
            const registros = await response.json();
            tablaRegistros.innerHTML = ''; // Limpiar la tabla
            registros.forEach(registro => {
                const row = tablaRegistros.insertRow();
                row.insertCell().textContent = registro.id;
                row.insertCell().textContent = registro.nombre;
                row.insertCell().textContent = new Date(registro.fecha_entrada).toLocaleString();
                row.insertCell().textContent = registro.fecha_salida ? new Date(registro.fecha_salida).toLocaleString() : 'Pendiente';
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Error al cargar los registros');
        }
    };

    formEntrada.addEventListener('submit', async (e) => { // Registrar entrada
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;

        try {
            const response = await fetch('/registrar-entrada', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar la entrada');
            }

            alert('Entrada registrada');
            cargarRegistros();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });

    formSalida.addEventListener('submit', async (e) => { // Registrar salida
        e.preventDefault();
        const id = document.getElementById('id').value;

        try {
            const response = await fetch('/registro/salida', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al registrar la salida');
            }

            alert('Salida registrada');
            cargarRegistros();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    });

    cargarRegistros(); // Cargar registros al iniciar
});