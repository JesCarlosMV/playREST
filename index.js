// SERVIDOR PRINCIPAL EXPRESS , SERVICIOS , MIDDLEWARES



// Cargar la librería Express, y las que necesites

import express from "express";
import morgan from "morgan";
import { cargarJuegos, guardarJuegos, modificarJuegos, borrarJuegos } from "./utilidades.js"; // Incluir el fichero utilidades.js
import data from "./juegos.json" assert { type: "json" }                                      // Definir el nombre de fichero donde cargar/guardar juegos 

//:TODO: Constantes 
const nombreFichero = "./juegos.json";  // Definir el nombre de fichero donde cargar/guardar juegos
const errorEdad = "Edad mínima recomendada en años inválida";
const errorJuegoInexistente = "Código de juego inexistente";
const errorJuegoRepetido = "Código de juego repetido";
const errorJuegoNoEncontrado = "Juego no encontrado";
const errorJuego = "Error al guardar el juego";

//Cargar los juegos del fichero en un array Javascript antes de iniciar el servidor
cargarJuegos(data);


// Definir el objeto Express con sus servicios
const app = express();


//settings
app.set('port', 8080);


//middlewares
app.use(morgan("dev"));        //mostrar por consola las peticiones
app.use(express.json());       //express entienda los datos en formato JSON


//Poner en marcha el servidor Express en el puerto 8080

app.listen(app.get("port"), () => {
    console.log(`Servidor en marcha en puerto ${app.get("port")}`);
});



//Servicios


//  devolviendo en el atributo resultado el array con todos los juegos
//  posibilidad de recibir query string con la edad y type de juego para filtrar
app.get("/juegos", (req, res) => {

    const url = new URL(`https://${req.url}`);
    const params = url.searchParams;
    const anyo = params.get("anyos");
    const tipo = params.get("tipo");

    //:TODO: faltaba parsear los anyos, por eso no funcionaba el filtro
    const anyos = parseInt(anyo);


    try {

        // si la edad indicada es un valor negativo, se devolverá un error de type 400
        if (anyos < 0) {
            return res.status(400).send(errorEdad);
        }
        else if (anyos && tipo) {
            return res.status(200).json(data.filter(juego => juego.edad >= anyos && juego.tipo == tipo));
        } else if (tipo && !anyos) {
            return res.status(200).json(data.filter(juego => juego.tipo == tipo));
        } else if (anyos && !tipo) {
            return res.status(200).json(data.filter(juego => juego.edad >= anyos));
        } else {
            return res.status(200).json(data);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});


// id es el código identificativo deljuego a buscar , se devolvera solo el juego con ese id
// o error 404 si no existe
app.get('/juegos/:id', (req, res) => {

    const { id } = req.params;
    const juego = data.find(juego => juego.id == id);

    if (juego) {
        return res.status(200).json(juego);
    } else {
        return res.status(400).send(errorJuegoInexistente);
    }

});


// recibirá en el cuerpo de la petición todos los datos de la misma. 
// Si el id del nuevo juego no se encuentra en el array, se añadirá
// si el id ya existe, se devolverá un error 400
//:TODO: nomenclaturas en español , antes estaban en ingles y no podias hacer el POST & PUT correctamente:
app.post('/juegos', (req, res) => {

    //desestructuramos el req body y buscamos si el id ya existe

    const { id, nombre, descripcion, edad, numeroDeJugadores, tipo, precio } = req.body;

    if (!id || !nombre || !descripcion || !edad || !numeroDeJugadores || !tipo || !precio) {
        return res.status(400).json({ error: "Faltan campos" });
    }

    const idFound = data.find(juego => juego.id === id);

    let newGame = { id, nombre, descripcion, edad, numeroDeJugadores, tipo, precio };

    if (idFound) {
        return res.status(400).send({ ok: false, errorJuegoRepetido });
    } else {
        const result = guardarJuegos(data, newGame, nombreFichero);
        if (result) {
            return res.status(200).json({ ok: true, newGame });
        } else {
            return res.status(500).send({ ok: false, errorJuego });
        }
    }
});


// Se enviarán en el cuerpo de la petición los datos del juego (todos salvo el id)
// se devolvera el juego modificado solamente => (newGame)
// Si el id del juego a modificar no se encuentra en el array, se devolverá un error 400
app.put('/juegos/:id', (req, res) => {


    const { id } = req.params;

    const { nombre, descripcion, edad, numeroDeJugadores, tipo, precio } = req.body;
    let newGame = {};

    if (!nombre || !descripcion || !edad || !numeroDeJugadores || !tipo || !precio) {
        return res.status(400).json({ error: "Faltan campos" });
    } else {
        newGame = { nombre, descripcion, edad, numeroDeJugadores, tipo, precio };
    }

    const idFound = data.find(juego => juego.id === id);

    if (!idFound) {
        return res.status(400).json({ ok: false, errorJuegoNoEncontrado });
    } else if (idFound) {

        const result = modificarJuegos(data, id, newGame);

        if (result) {
            console.log("JUEGO MODIFICADO")
            return res.status(200).json({ ok: true, newGame });
        } else {
            return res.status(500).json({ ok: false, errorJuego });
        }
    } else {
        return res.status(400).json({ ok: false, errorJuego });
    }
});


// id es el código identificativo del juego a eliminar 
// se devuelve el juego eliminado (result)
app.delete('/juegos/:id', (req, res) => {

    const { id } = req.params;

    const result = borrarJuegos(data, id);

    if (result) {
        return res.status(200).json({ ok: true, message: result });
    } else {
        return res.status(400).json({ ok: false, errorJuegoNoEncontrado });
    }
});