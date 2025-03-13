require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const menuRouter = require('./controllers/menus');


//coneccion a BD

(async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Te has Conectado a MongoDB')
    } catch (error) {
        console.log(error)
    }
})()


//rutas FRONTEND
app.use('/',express.static(path.resolve('views','home')))
app.use('/editar',express.static(path.resolve('views','editar')))
app.use('/nuevo',express.static(path.resolve('views','nuevoProducto')))


//las rutas que colocamos seran mediante express con json

app.use(express.json())


//Rutes BACKEND
app.use('/api/menus',menuRouter)


module.exports = app;