const listado = document.querySelector('#listado-Productos');

document.addEventListener('DOMContentLoaded', mostrarProductos);
listado.addEventListener('click', confirmarEliminar);

// Función para obtener los productos
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
        const { nombre, precio, categoria, id } = producto; // Asegúrate de que los campos coincidan con el modelo

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
                <a href="/editar/?id=${id}" class="text-teal-600 hover:text-teal-900">Editar</a>
                <a href="#" data-producto="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
            </td>
        `;

        listado.appendChild(row);
    });
}

// Función para confirmar la eliminación de un producto
async function confirmarEliminar(e) {
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
        mostrarProductos(); // Recargar la lista después de eliminar
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
    }
}