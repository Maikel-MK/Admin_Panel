document.addEventListener('DOMContentLoaded', () => {
    const productoId = localStorage.getItem('productoId');
    console.log('ID del producto desde localStorage:', productoId);

    if (!productoId) {
        console.error('No se proporcionó un ID de producto');
        alert('Error: No se proporcionó un ID de producto');
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
        alert('Error al obtener el producto. Redirigiendo a la página principal.');
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
        alert('Error: No se encontró el producto');
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
        alert('Por favor, complete todos los campos correctamente.');
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
        alert('El producto se ha actualizado correctamente. Serás redirigido a la página principal.');
        localStorage.removeItem('productoId'); // Eliminar el ID del localStorage
        window.location.href = '/'; // Redirigir a la página principal
    } catch (error) {
        console.error('Error al actualizar el producto:', error.response ? error.response.data : error.message);
        alert('Error al actualizar el producto');
    }
}