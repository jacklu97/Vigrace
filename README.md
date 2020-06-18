### `¿Qué es Vigrace?`

Vigrace es un sistema visualizador de grafos en 3D creado en React usando librerías como react-force-graph-3d que surgen a partir de THREE JS.

El fin mismo de Vigrace es que se puedan cargar varios grafos que representen una secuencia de eventos bajo un data-set que contenga la progresión de esos datos en un tiempo dado.
El usuario puede cargar los datos que necesite mediante un archivo JSON y comenzar a visualizar.

### `Empezar a usarlo`

Dado que es un proyecto creado en React será necesario usar el comando <b>npm start.</b> Es necesario tener instalado Node JS en el equipo para poder ejecutarlo.
El sistema solo necesita que el archivo JSON tenga el formato adecuado. Lo fundamental para el funcionamiento es que cada nodo tenga un id que puede ser de tipo int o string. Los enlaces o "links" deben coincidir en target y source con el tipo de id que posean los nodos, es decir, si un nodo posee como id una cadena de texto, en links tanto target como source deben ser cadenas de texto también. 


### `Ejemplo de un archivo JSON válido`

Lo ideal es que se tengan al menos 2 grafos en el archivo JSON para poder denotar la diferencia entre ambos pero el uso puede variar según las necesidades del usuario.

``` JSON
{
    "1":{
        "nodes": [
            {
                "country": "East Timor",
                "code": "tl",
                "fx": 0,
                "fy": 0,
                "fz": 0,
                "id": 0
            },
            {
                "country": "Canada",
                "code": "ca",
                "fx": 10,
                "fy": 0,
                "fz": 10,
                "id": 1
            },
            {
                "country": "Turkmenistan",
                "code": "tm",
                "fx": 20,
                "fy": 0,
                "fz": 25,
                "id": 2
            }
        ],
        "links":[
            {
                "target": 2,
                "source": 0
            },
            {
                "target": 2,
                "source": 1
            },
            {
                "target": 3,
                "source": 2
            }
        ]
    }, ...
}
```