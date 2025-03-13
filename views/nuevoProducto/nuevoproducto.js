document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

            const nombre = document.getElementById('nombre').value.trim();
            const precio = parseFloat(document.getElementById('precio').value);
            const categoria = document.getElementById('categoria').value.trim();

            // Validaciones básicas
            if (!nombre || !categoria || isNaN(precio) || precio <= 0) {
                mostrarNotificacion('Por favor, complete todos los campos correctamente.', 'error');
                return;
            }

            const nuevoProducto = {
                nombre,
                precio,
                categoria,
            };

            try {
                console.log('Creando nuevo producto:', nuevoProducto);
                const respuesta = await axios.post('/api/menus/', nuevoProducto);
                console.log('Producto creado:', respuesta.data);

                // Mostrar notificación de éxito
                mostrarNotificacion('Producto creado correctamente.', 'success');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } catch (error) {
                console.error('Error al crear el producto:', error.response ? error.response.data : error.message);
                mostrarNotificacion('Error al crear el producto.', 'error');
            }
        });
    } else {
        console.error('El formulario no se encontró en el DOM');
    }
});

// Función para mostrar notificaciones personalizadas
function mostrarNotificacion(mensaje, tipo) {
    const notificaciones = document.getElementById('notificaciones');

    // Crear el elemento de la notificación
    const notificacion = document.createElement('div');
    notificacion.className = `px-4 py-2 rounded-md shadow-md text-white ${
        tipo === 'success' ? 'bg-green-500' :
        tipo === 'error' ? 'bg-red-500' :
        tipo === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    notificacion.textContent = mensaje;

    notificaciones.appendChild(notificacion);

    setTimeout(() => {
        notificacion.remove();
    }, 3000);
}