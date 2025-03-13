const express = require('express');
const menuRouter = express.Router();
const Menu = require('../models/menu'); // Asegúrate de que el modelo esté correctamente importado

// Middleware para validar datos del producto
const validateProductData = (req, res, next) => {
    const { nombre, precio, descripcion } = req.body;

    if (!nombre || !precio || !descripcion) {
        console.error('Error de validación: Faltan campos obligatorios');
        return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, descripcion' });
    }

    if (typeof precio !== 'number' || precio <= 0) {
        console.error('Error de validación: El precio debe ser un número positivo');
        return res.status(400).json({ error: 'El precio debe ser un número positivo' });
    }

    next(); // Si todo está bien, pasa al siguiente middleware o ruta
};

// Ruta para crear nuevo producto
menuRouter.post('/', validateProductData, async (req, res) => {
    try {
        const producto = new Menu(req.body);
        await producto.save();
        console.log('Producto creado exitosamente:', producto);
        res.status(201).json(producto);
    } catch (error) {
        console.error('Error al crear el producto:', error.message);
        res.status(400).json({ error: error.message });
    }
});

// Ruta para obtener todos los menús
menuRouter.get('/lista-menu', async (request, response) => {
    try {
        // Obtener todos los menús desde la base de datos
        const listado = await Menu.find()

        // Si no hay menús, devolver un mensaje indicando que no hay datos
        if (listado.length === 0) {
            return response.status(404).json({ textOk: false, message: 'No se encontraron menús' })
        }

        // Devolver la lista de menús
        return response.status(200).json({ textOk: true, data: listado })

    } catch (error) {
        // Manejar errores y devolver un mensaje de error
        console.error('Error al obtener la lista de menús:', error.message)
        return response.status(500).json({ textOk: false, error: 'Error interno del servidor' })
    }
})

// Ruta para obtener un producto por id
menuRouter.get('/producto/:id', async (req, res) => {
    try {
        const producto = await Menu.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al obtener el producto:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para  Actualizar un Producto por ID
menuRouter.put('/actualizar/:id', async (req, res) => {
    try {
        const producto = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(producto);
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta para eliminar un producto
menuRouter.delete('/delete/:id', async (req, res) => {
    try {
        const producto = await Menu.findByIdAndDelete(req.params.id);

        if (!producto) {
            console.error('Producto no encontrado para eliminar');
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        console.log('Producto eliminado exitosamente:', producto);
        res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = menuRouter;