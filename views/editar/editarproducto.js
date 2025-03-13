document.addEventListener('DOMContentLoaded', () => {
    const productoId = localStorage.getItem('productoId');
    console.log('ID del producto desde localStorage:', productoId);

    if (!productoId) {
        console.error('No se proporcionó un ID de producto');
        mostrarNotificacion('Error: No se proporcionó un ID de producto', 'error');
        window.location.href = '/'; // Redirigir a la página principal
    }

    // Llenar el formulario con los datos del producto
    llenarFormulario(productoId);

    // Asignar el event listener al formulario
    const formulario = document.getElementById('formulario-edicion');
    if (formulario) {
        formulario.addEventListener('submit', actualizarProducto);
    } else {
        console.error('El formulario no se encontró en el DOM');
    }
});

async function obtenerProductoPorId(id) {
    try {
        console.log('Realizando solicitud para obtener el producto con ID:', id);
        const respuesta = await axios.get(`/api/menus/producto/${id}`);
        console.log('Respuesta del backend:', respuesta.data);
        return respuesta.data; // Retorna los datos del producto
    } catch (error) {
        console.error('Error al obtener el producto:', error.response ? error.response.data : error.message);
        mostrarNotificacion('Error al obtener el producto. Redirigiendo a la página principal.', 'error');
        window.location.href = '/'; // Redirigir a la página principal
        return null;
    }
}

async function llenarFormulario(productoId) {
    console.log('Llenando formulario para el producto con ID:', productoId);
    const producto = await obtenerProductoPorId(productoId);

    if (producto) {
        console.log('Producto encontrado:', producto);
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('id').value = producto.id; // Asignar el ID al campo oculto
    } else {
        console.error('No se encontró el producto');
        mostrarNotificacion('Error: No se encontró el producto', 'error');
        window.location.href = '/'; // Redirigir a la página principal
    }
}

async function actualizarProducto(e) {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);
    const categoria = document.getElementById('categoria').value.trim();
    const id = document.getElementById('id').value;

    // Validaciones básicas
    if (!nombre || !categoria || isNaN(precio) || precio <= 0) {
        mostrarNotificacion('Por favor, complete todos los campos correctamente.', 'error');
        return;
    }

    const datosActualizados = {
        nombre,
        precio,
        categoria,
    };

    try {
        console.log('Actualizando producto con ID:', id);
        const respuesta = await axios.put(`/api/menus/actualizar/${id}`, datosActualizados); 
        console.log('Producto actualizado:', respuesta.data);

        // Mostrar notificación de éxito
        mostrarNotificacion('El producto se ha actualizado correctamente.', 'success');

        // Redirigir después de 5 segundos
        setTimeout(() => {
            localStorage.removeItem('productoId'); // Eliminar el ID del localStorage
            window.location.href = '/'; // Redirigir a la página principal
        }, 1000);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.response ? error.response.data : error.message);
        mostrarNotificacion('Error al actualizar el producto.', 'error');
    }
}

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

    // Agregar la notificación al contenedor
    notificaciones.appendChild(notificacion);

    // Eliminar la notificación después de 5 segundos
    setTimeout(() => {
        notificacion.remove();
    }, 2000);
}