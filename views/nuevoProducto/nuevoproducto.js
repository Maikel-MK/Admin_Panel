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
                alert('Por favor, complete todos los campos correctamente.');
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
                alert('Producto creado correctamente. Serás redirigido a la página principal.');
                window.location.href = '/'; // Redirigir a la página principal
            } catch (error) {
                console.error('Error al crear el producto:', error.response ? error.response.data : error.message);
                alert('Error al crear el producto');
            }
        });
    } else {
        console.error('El formulario no se encontró en el DOM');
    }
});