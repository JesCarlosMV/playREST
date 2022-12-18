## en los TODOS amarillos estan las siguientes correcciones :

**- subidas pruebas de Postman **

`INDEX.JS`

1º Añadidas constantes con : - mensajes de errores - nombre fichero para no tener que ponerlo a pelo.

2º Faltaba parsear los anyos para que funcionase el filtro por edad

3º nomenclaturas en español, antes estaban en ingles y no podias hacer el POST y PUT correctamente.

```
{
       "id": "3",
       "nombre": "world of warcraft",
       "descripcion": "paladin will win",
       "edad": "18",
       "numeroDeJugadores": "10",
       "tipo": "mmo",
       "precio": "60,60"
   }
```

`UTILIDADES.JS`

1º guardarJuegos ya no recibe nombre de archivo a pelo.
