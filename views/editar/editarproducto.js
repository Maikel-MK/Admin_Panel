// Llamar a la función cuando la página cargue
document.addEventListener('DOMContentLoaded', llenarFormulario);

// Obtener el ID del producto desde el LocalStorage
const productoId = localStorage.getItem('productoId');
console.log('ID del producto desde localStorage:', productoId);

async function obtenerProductoPorId(id) {
    try {
        console.log('Realizando solicitud para obtener el producto con ID:', id);
        const respuesta = await axios.get(`/api/menus/producto/${id}`);
        console.log('Respuesta del backend:', respuesta.data);
        return respuesta.data; // Retorna los datos del producto
    } catch (error) {
        console.error('Error al obtener el producto:', error.response ? error.response.data : error.message);
        return null;
    }
}

async function llenarFormulario() {
    if (!productoId) {
        console.error('No se proporcionó un ID de producto');
        return;
    }

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
    }
}

async function actualizarProducto(e) {
    e.preventDefault(); // Evitar que el formulario se envíe de forma tradicional

    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const categoria = document.getElementById('categoria').value;
    const id = document.getElementById('id').value;

    const datosActualizados = {
        nombre,
        precio,
        categoria,
    };

    try {
        console.log('Actualizando producto con ID:', id);
        const respuesta = await axios.put(`/api/menus/actualizar/${id}`, datosActualizados); 
        console.log('Producto actualizado:', respuesta.data);
        alert('Producto actualizado correctamente');
        window.location.href = '/'; // Redirigir a la página principal
    } catch (error) {
        console.error('Error al actualizar el producto:', error.response ? error.response.data : error.message);
        alert('Error al actualizar el producto');
    }
}

// Asignar la función al evento submit del formulario
document.getElementById('formulario').addEventListener('submit', actualizarProducto);