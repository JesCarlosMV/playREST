// FUNCIONES PARA CARGAR Y GUARDAR DATOS EN FORMATO JSON AL ARCHIVO juegos.json QUE ALMACENA LOS DATOS DE LOS JUEGOS


import fs from 'fs';


// recibe como parametro nombre archivo y devolverá un array vacío si el fichero no existe o no pudo leerse
export const cargarJuegos = fichero => {

    let juegos = [];

    if (!fichero || fs.existsSync(fichero)) {
        console.warn("NO SE PUDO LEER EL FICHERO");
        return [];
    } else {
        juegos = JSON.stringify(fichero);
        console.log("SE PUDO LEER EL FICHERO");
        return juegos = JSON.parse(juegos);
    }
}

// recibe array de objetos , el juego :TODO: Y EL NOMBRE DEL FICHERO para no ponerlo a pelo jeje
// si array es nulo o vacío, no se hará nada con el fichero
export const guardarJuegos = (data, newGame, nombreFichero) => {

    try {
        data.push(newGame);
        fs.writeFileSync(nombreFichero, JSON.stringify(data));
        return true;

    } catch (error) {
        console.log(error);
        return false;
    }
}

// recibe array de objetos , el id del juego a modificar y el juego modificado
export const modificarJuegos = (data, id, newGame) => {

    let index = data.findIndex(juego => juego.id === id);


    data[index] = newGame;
    data[index].id = id;

    fs.writeFileSync("./juegos.json", JSON.stringify(data));

    return data;
}

// recibe array de objetos y el id del juego a eliminar
export const borrarJuegos = (data, id) => {

    let index = data.findIndex(juego => juego.id === id);

    if (index == -1) {
        return false;
    } else {

        let juegoEliminado = data.splice(index, 1);
        fs.writeFileSync("./juegos.json", JSON.stringify(data));

        return juegoEliminado
    }
};