const express = require('express')
const menuRouter = express.Router()
const Menu = require('../models/menu') // Asegúrate de que el modelo esté correctamente importado

// Middleware para validar datos del producto
const validateProductData = (req, res, next) => {
    const { nombre, precio, descripcion } = req.body

    if (!nombre || !precio || !descripcion) {
        console.error('Error de validación: Faltan campos obligatorios')
        return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, precio, descripcion' })
    }

    if (typeof precio !== 'number' || precio <= 0) {
        console.error('Error de validación: El precio debe ser un número positivo')
        return res.status(400).json({ error: 'El precio debe ser un número positivo' })
    }

    next() // Si todo está bien, pasa al siguiente middleware o ruta
}

// Ruta para crear un nuevo producto
menuRouter.post('/', async (req, res) => {
    try {
        const { nombre, precio, categoria } = req.body

        // Obtener el último ID en el array "menu"
        const ultimoMenu = await Menu.findOne().sort({ 'menu.id': -1 })
        const ultimoProducto = ultimoMenu ? ultimoMenu.menu[ultimoMenu.menu.length - 1] : null
        const nuevoId = ultimoProducto ? ultimoProducto.id + 1 : 1 // Generar un nuevo ID

        // Crear el nuevo producto
        const nuevoProducto = {
            id: nuevoId,
            nombre,
            precio,
            categoria,
        }

        // Buscar un menú existente o crear uno nuevo
        let menu = await Menu.findOne()
        if (!menu) {
            menu = new Menu({ menu: [] }) // Crear un nuevo menú si no existe
        }

        // Agregar el nuevo producto al array "menu"
        menu.menu.push(nuevoProducto)

        // Guardar el menú actualizado en la base de datos
        await menu.save()

        res.status(201).json(nuevoProducto) // Devolver el producto creado
    } catch (error) {
        console.error('Error al crear el producto:', error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})
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
        const productoId = Number(req.params.id) // Convertir el ID a número
        console.log('Buscando producto con ID:', productoId)

        // Buscar el menú que contiene el producto y convertirlo en un objeto plano
        const menu = await Menu.findOne({ 'menu.id': productoId }).lean()
        console.log('Menú encontrado (como objeto plano):', menu)

        if (!menu) {
            console.error('Menú no encontrado')
            return res.status(404).json({ error: 'Menú no encontrado' })
        }

        // Verificar que el campo "menu" esté definido y sea un array
        if (!menu.menu || !Array.isArray(menu.menu)) {
            console.error('El campo "menu" no está definido o no es un array')
            return res.status(500).json({ error: 'Estructura de datos inválida' })
        }

        // Buscar el producto dentro del array "menu"
        const producto = menu.menu.find(item => item.id === productoId)
        console.log('Producto encontrado:', producto)

        if (!producto) {
            console.error('Producto no encontrado en el menú')
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        // Devolver el producto encontrado
        console.log('Devolviendo producto:', producto)
        res.status(200).json(producto)
    } catch (error) {
        console.error('Error al obtener el producto:', error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

// Ruta para  Actualizar un Producto por ID
menuRouter.put('/actualizar/:id', async (req, res) => {
    try {
        const productoId = Number(req.params.id) // Convertir el ID a número
        const datosActualizados = req.body

        // Buscar el menú que contiene el producto
        const menu = await Menu.findOne({ 'menu.id': productoId })

        if (!menu) {
            return res.status(404).json({ error: 'Menú no encontrado' })
        }

        // Buscar el índice del producto dentro del array "menu"
        const productoIndex = menu.menu.findIndex(item => item.id === productoId)

        if (productoIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        // Actualizar el producto, asegurándote de mantener el ID
        menu.menu[productoIndex] = {
            id: productoId, // Mantener el ID original
            ...datosActualizados, // Aplicar los nuevos datos
        }

        // Guardar el menú actualizado
        await menu.save()

        res.status(200).json(menu.menu[productoIndex])
    } catch (error) {
        console.error('Error al actualizar el producto:', error.message)
        res.status(500).json({ error: 'Error interno del servidor' })
    }
})

menuRouter.delete('/delete/:id', async (req, res) => {
    try {
        const productoId = Number(req.params.id) // Convertir el ID a número
        console.log('ID del producto a eliminar:', productoId)

        // Buscar el menú que contiene el producto
        const menu = await Menu.findOne({ 'menu.id': productoId })

        if (!menu) {
            console.error('Menú no encontrado')
            return res.status(404).json({ error: 'Menú no encontrado' })
        }

        // Buscar el índice del producto dentro del array "menu"
        const productoIndex = menu.menu.findIndex(item => item.id === productoId)

        if (productoIndex === -1) {
            console.error('Producto no encontrado en el menú')
            return res.status(404).json({ error: 'Producto no encontrado' })
        }

        // Eliminar el producto del array "menu"
        menu.menu.splice(productoIndex, 1)

        // Guardar el menú actualizado en la base de datos
        await menu.save()

        console.log('Producto eliminado exitosamente')
        res.status(200).json({ message: 'Producto eliminado' })
    } catch (error) {
        console.error('Error al eliminar el producto:', error.message)
        res.status(500).json({ error: error.message })
    }
})

module.exports = menuRouter