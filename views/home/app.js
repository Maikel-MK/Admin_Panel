const listado = document.querySelector('#listado-Productos');

document.addEventListener('DOMContentLoaded', mostrarProductos);
listado.addEventListener('click', confirmarEliminar);

// Función para obtener los productos
async function obtenerProductos() {
    try {
        const url = '/api/menus/lista-menu';
        console.log('Realizando solicitud a:', url);

        const respuesta = await axios.get(url);
        console.log('Respuesta recibida:', respuesta.data);

        // Verificar si la respuesta tiene la estructura esperada
        if (respuesta.data && respuesta.data.textOk && Array.isArray(respuesta.data.data)) {
            // Acceder al array "menu" dentro del primer elemento de "data"
            const menu = respuesta.data.data[0].menu;

            // Verificar si "menu" es un array
            if (Array.isArray(menu)) {
                return menu; // Retorna la lista de productos
            } else {
                console.error('El campo "menu" no es un array:', menu);
                return [];
            }
        } else {
            console.error('La respuesta no tiene la estructura esperada:', respuesta.data);
            return [];
        }
    } catch (error) {
        console.error('Error al obtener los productos:', error.message);
        return [];
    }
}

// Función para mostrar los productos en la tabla
async function mostrarProductos() {
    const productos = await obtenerProductos();
    listado.innerHTML = ''; // Limpiar la lista antes de agregar los productos

    if (productos.length === 0) {
        listado.innerHTML = '<tr><td colspan="4">No hay productos disponibles</td></tr>';
        return;
    }

    productos.forEach(producto => {
        const { nombre, precio, categoria, id } = producto;
    
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4 border-b">
                <p>${nombre}</p>
            </td>
            <td class="px-6 py-4 border-b">
                <p>${precio}</p>
            </td>
            <td class="px-6 py-4 border-b">
                <p>${categoria}</p>
            </td>
            <td class="px-6 py-4 border-b">
                <a href="/editar/" class="text-teal-600 hover:text-teal-900" onclick="localStorage.setItem('productoId', '${id}')">Editar</a>
                <a href="#" data-producto="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
            </td>
        `;
    
        listado.appendChild(row);
    });
}

// Función para confirmar la eliminación de un producto
async function confirmarEliminar(e) {
    e.preventDefault()
    if (e.target.classList.contains('eliminar')) {
        const productoID = e.target.dataset.producto; // Obtener el ID del producto
        console.log('ID del producto a eliminar:', productoID);

        const confirmar = confirm('¿Quieres eliminar este producto?');

        if (confirmar) {
            await eliminarProducto(productoID);
        }
    }
}

// Función para eliminar un producto
async function eliminarProducto(id) {
    try {
        const response = await axios.delete(`/api/menus/delete/${id}`);
        console.log('Producto eliminado:', response.data.message);

        // Mostrar notificación de éxito
        mostrarNotificacion('Producto eliminado correctamente.', 'success');

        // Recargar la lista de productos
        mostrarProductos();
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);

        // Mostrar notificación de error
        mostrarNotificacion('Error al eliminar el producto.', 'error');
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
    }, 5000);
}