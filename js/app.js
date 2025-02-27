// se crea la conexion para la base de datos 
import { obtenerProductos, eliminarProducto } from "./api.js"


const listado = document.querySelector('#listado-Productos')

document.addEventListener('DOMContentLoaded', mostarProductos)
listado.addEventListener('click', confirmarEliminar)

async function confirmarEliminar(e){
    if(e.target.classList.contains('eliminar')){
       // console.log('eliminar')
       const productoID = parseInt(e.target.dataset.producto)
       console.log(productoID)

       const confirmar = confirm('Quieres Eliminar Este Producto?')

       if (confirmar){
            await eliminarProducto(productoID)
       }
    }
}
async function mostarProductos(){
    const productos = await obtenerProductos()
    //console.log(productos)
        productos.forEach(i => {
            const {nombre, precio, categoria, id} = i

            const row = document.createElement('tr')
            row.innerHTML += `
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
                    <a href="editar-producto.html?id=${id}" class="text-teal-600 hover:text-teal-900">Editar</a>
                    <a href="#" data-producto="${id}"class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>

                </td>
            `

            listado.appendChild(row)
        });
}