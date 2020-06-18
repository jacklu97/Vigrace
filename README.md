### `¿Qué es Vigrace?`

Vigrace es un sistema visualizador de grafos en 3D creado en React usando librerías como react-force-graph-3d que surgen a partir de THREE JS.

El fin mismo de Vigrace es que se puedan cargar varios grafos que representen una secuencia de eventos bajo un data-set que contenga la progresión de esos datos en un tiempo dado.
El usuario puede cargar los datos que necesite mediante un archivo JSON y comenzar a visualizar.

### `Empezar a usarlo`

Dado que es un proyecto creado en React será necesario usar el comando <b>npm start.</b> Es necesario tener instalado Node JS en el equipo para poder ejecutarlo. El sistema solo necesita que el archivo JSON tenga el formato adecuado.  

Una vez que han cargado en el sistema los grafos, el usuario puede cambiar de grafo empleando la barra de selección o usando los controles de reproducción. Es posible cambiar de datos cargando un JSON diferente en tiempo de ejecución. Así mismo el usuario puede descargar una imagen del momento actual del grafo que está visualizando.

Cada grafo es independiente entre sí, por lo que el usuario es libre de hacer zoom, arrastrar los nodos y cambiar el tamaño individual de cada uno. La escala es el único factor que afecta a todos los grafos por igual.

### `Ejemplo de un archivo JSON válido`

Lo fundamental para el funcionamiento es que cada nodo tenga un id que puede ser de tipo int o string. Los enlaces o "links" deben coincidir en target y source con el tipo de id que posean los nodos, es decir, si un nodo posee como id una cadena de texto, en links tanto target como source deben ser cadenas de texto también. Información adicional puede ser opcional o puede servir de manera informativa si es que se hacen los ajustes en código pertinentes tanto para los grafos como para los enlaces.

Lo ideal es que se tengan al menos 2 grafos en el archivo JSON para poder denotar la diferencia entre ambos pero el uso puede variar según las necesidades del usuario. 

``` JSON
{
    "1":{
        "nodes": [
            {
                "id": "FP2",
                "name": "FP2",
                "fx": "3.3556",
                "fy": "9.82549",
                "fz": "0.750687"
            },
            {
                "id": "F4",
                "name": "F4",
                "fx": "4.72647",
                "fy": "6.94583",
                "fz": "4.29259"
            },
            {
                "id": "C4",
                "name": "C4",
                "fx": "6.20327",
                "fy": "0.279191",
                "fz": "5.88833"
            }
        ],
        "links":[
            {
                "target": "FP2",
                "source": "F4",
                "width": 0.069921261
            },
            {
                "target": "FP2",
                "source": "F8",
                "width": 1.0
            },
            {
                "target": "FP2",
                "source": "FZ",
                "width": 0.024089154
            }
        ]
    }, ...
}
```
### `Referencias de las librerías empleadas`
<h5>react-force-graph</h5> https://github.com/vasturiano/react-force-graph
<h5>THREE JS</h5> https://threejs.org/
<h5>File Saver JS</h5> https://github.com/eligrey/FileSaver.js/
