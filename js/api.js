//crearemos un api

const url = "http://localhost:3000/menu" /*es la ruta del menu despues de instalar npm init, npm i json-server y espesificar el server*/

//construir api

//CRUD

export const nuevoProducto = async producto =>{
  // basicamente es iguan a:  function nuevoProducto(producto){}
    try{
            await fetch(url,{
                method:'POST',
                body: JSON.stringify(producto),
                headers:{
                    'Content-Type':'aplication/json'
                }
            })
    }catch(error){
        console.log(error)
    }
}

export const obtenerProductos = async ()=>{
    //me retorna listado de productos que se encuentran en el end point de menu (todo)
    //por si acaso localhost 3000 / menu
    try {
        const resultado = await fetch(url)
        const productos = await resultado.json()
        return productos
    } catch (error) {
        console.log(error)
    }
}

export const obtenerProducto = async id =>{
    //me retorna 1 producto que se encuentra en el end point de menu localhost> 3000/menu/id dado un id
    try {
        const resultado = await fetch(`${url}/${id}`)
        const producto = await resultado.json()
    } catch (error) {
        console.log(error)
    }
}

export const editarProducto = async producto => {
    try {
        await fetch (`${url}/${producto.id}`,{
            method: 'PUT',//actuaizar
            body:JSON.stringify(producto),
            headers:{
                'Content-Type':'application/json'
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const eliminarProducto = async id =>{
    try {
        await fetch(`${url}/${id}`,{
            method:'DELETE'
        })
    } catch (error) {
        console.log(error)
    }
}