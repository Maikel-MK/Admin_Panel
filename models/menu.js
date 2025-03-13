const mongoose = require('mongoose')
const menuRouter = require('../controllers/menus')

// Definir el esquema del menú

const menuSchema = new mongoose.Schema({
    menu: [
        {
            id: { type: Number, unique: true }, 
            nombre: String,
            precio: Number,
            categoria: Number,
        },
    ],
})

// Transformar el objeto devuelto por Mongoose
menuSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString() // Convertir _id a id
        delete returnedObject._id // Eliminar _id
        delete returnedObject.__v // Eliminar __v
    }
})

// Crear el modelo Menu basado en el esquema
const Menu = mongoose.model('Menu', menuSchema)

// Exportar el modelo
module.exports = Menu