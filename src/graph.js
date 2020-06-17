// Librerias propias de npm
import React from 'react'
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import { saveAs } from 'file-saver'
import $ from 'jquery';
import InputRange from 'react-input-range';
import './App.css';
import "react-input-range/lib/css/index.css";

// Componentes creados
import Menu from './menu';
import Controller from './controller';
import InputFile from './inputFile';

class Graph extends React.Component {
  // El constructor debe llamar primero a super(props) para poder funcionar con el paso de parámetros
  // Esto es parte de la sintaxis de React
  constructor(props) {
    super(props)
    this.fgRef = React.createRef() // Esta referencia se usa para poder acceder al grafo mostrado al momento deseado
    // State lleva el control de las variables propias de esta clase, son básicamente los atributos de la misma
    this.state = {
      data: null,
      scale: 1,
      showController: false,
      currentId: 1,
      minId: 1,
      maxId: null,
      nodesSizes: [],
      colors: [],
      selectedNode: null,
      graphs: [],
      playMoments: false,
      pauseMoments: false
    }
  }

  chooseJsonFile = () => {
    $("#jsonFile").click(); // Usando jQuery se hace clic en un input invisible que detona el dialog que permite cargar el archivo JSON
  }

  setJsonFile = (jsonF) => { // Una vez que se ha elegido el archivo JSON se activa este método, carga la información del archivo a memoria en la variable data y dejamos currentID en 1
    this.setState({
      data: jsonF,
      currentId: 1
    }, () => { // La función setState tiene un callback dado que es una función asíncrona de JS, para asegurarse que lo que se quiera hacer después de cambiar el estado se debe usar el callback
      this.createGraph() // Después de cargar la información en memoria se pasa a crear los grafos
    })
  }

  createGraph = () => {
    // Se selecciona el div que va a guardar el canvas
    let elem = document.getElementById("3dgraph")
    // keys y maxId nos permiten saber cuántos momentos (o grafos) existen para poder hacer los mapeos de información
    let keys = Object.keys(this.state.data)
    let maxId = parseInt(keys[keys.length - 1])
    // Declaramos un arreglo de los tamaños donde vamos a guardar el tamaño de cada nodo
    let sizes = []
    
    // El ciclo for que se tiene a continuación tiene una función muy especial. Recorre todos los "momentos" que haya dentro de la variable data, que es donde se encuentra
    // la información que hemos proporcionado mediante el JSON. Dentro tenemos un hashMap donde se van a guardar el id de los nodos que son destino para una arista en el grafo dado.


    for(let i= 1; i<=maxId; i++){
      let hashMap = {}
      // Se recorre primero cada arista que se encuentra en el grafo actual según el ciclo y se comprueba si el nodo destino ya está en el hashMap, en caso de ser así solo se suma 1 a su 
      // ocurrencia, en caso contrario se inicializa con 1
      this.state.data[i]["links"].forEach(link => {
        if(link.target in hashMap){
          hashMap[link.target] += 1
        }
        else{
          hashMap[link.target] = 1
        }
      });
      
      // Este ciclo hace algo parecido al anterior pero esta vez con cada nodo dentro del grafo actual para hacer el ajuste de los tamaños. Dado que el tamaño del nodo
      // depende de cuántas aristas se dirigen a él, debe tener un tamaño de 4+n donde n es la cantidad de veces que un arista se dirige a él, que fue lo calculado en el ciclo anterior.
      // En caso de que el nodo se encuentre ya en el hashMap solo se suman 4 al valor actual, en caso contrario se inicia con valor de 4 que es el valor mínimo para un nodo.

      this.state.data[i]["nodes"].forEach(node => {
        if(node.id in hashMap){
          hashMap[node.id] += 4
        }
        else{
          hashMap[node.id] = 4
        }
      })
      // Una vez que ya hemos calculado los tamaños de cada nodo solo hacemos un push al arreglo de los tamaños
      sizes.push(hashMap)
    }

    let graphs = [] // Inicializamos un arreglo de grafos donde vamos a almacenar cada grafo que se crea
    let colors = [] // Inicializamos un arreglo de colores donde vamos a guardar los colores que corresponden a cada grafo esto para en caso de reconstruir el grafo se mantengan los colores originales

    // Obtenemos las dimensiones del documento actualmente para poderlo pasar como parámetro al grafo
    let WIDTH = $(document).width();
    let HEIGHT = $(document).height();

    // En el ciclo siguiente es donde se crean los grafos totales dentro de la variable data

    for (let i = 1; i <= maxId; i++) {
      let color = this.getRandomColor() // Solicitamos un color aleatorio
      colors.push(color) // Guardamos el color dentro del arreglo

      // Dentro de la variable graph guardamos el grafo que construimos con la información actual dentro del ciclo

      let graph = <ForceGraph3D
      graphData={this.state.data[i]} // Le indicamos al grafo qué información usar para construirse, entramos al i-esimo momento dentro de data y accedemos a "nodes" y "links"
      rendererConfig={{preserveDrawingBuffer: true}} // Esta configuración es para poder acceder al canvas y capturar el momento actual deseado
      ref = {this.fgRef} // Asignamos la referencia que creamos en el constructor
      nodeResolution={10} // Declaramos la resolución de los nodos, entre mayor sea, será necesario más poder de procesamiento y puede que el navegador se ralentice
      backgroundColor={"#919191"} // Asignamos el color de fondo del grafo
      nodeColor={() => color} // Indicamos el color de los nodos
      nodeLabel={"name"} // Indicamos el texto que aparece cuando ponemos el cursor sobre algún nodo. La cadena que se indique debe ser una llave que se encuentre dentro de un objeto nodo, puede ser cualquiera
      showNavInfo={true} // Indicamos si se muestran los controles de navegación en la parte baja del grafo
      width={WIDTH} // Asignamos las medidas del canvas
      height={HEIGHT}
      linkDirectionalArrowLength={3.5} // El tamaño de la flecha que indica la dirección del arista
      linkDirectionalArrowRelPos={1} // Indica en qué parte de la arista se quiere tener la flecha, usa datos entre 0 y 1 donde 0 es cerca del nodo origen y 1 cerca del nodo destino
      linkCurvature={0.25} // La curvatura del arista
      // nodeVal asigna el tamaño de cada nodo por su radio, dentro tiene una función flecha que llama a cada nodo que se encuentra dentro del grafo actual, lo que nos deja acceder a datos de cada nodo de forma
      // individual, así podemos acceder al tamaño que fue calculado anteriormente 
      nodeVal={nod => sizes[this.state.currentId - 1][nod.id] } 
      onNodeClick={node => this.setCurrentNode(node)} // Indicamos qué pasa cuando damos clic a un nodo
      onNodeHover={node => elem.style.cursor = node ? 'pointer' : null} // Indicamos que el cursor cambie de estilo cuando se coloque sobre un nodo
      // Declaramos el tamaño de cada arista de una forma parecida a como lo hicimos con los nodos multiplicando por 5 el valor de "width" que se encuentra dentro de cada arista
      linkWidth={link => 5*link.width}
      linkResolution={10} // Vemos la resolución de cada arista
      onLinkHover={link => elem.style.cursor = link ? 'pointer' : null} // Indicamos que el cursor cambie de estilo cuando se coloque sobre un nodo
      nodeThreeObjectExtend={nod => true} // Añadimos esta configuración para que cada nodo pueda ser añadidos componentes extra de Three
      nodeThreeObject={(nod) => this.addSpriteText(nod)} // Añadimos el nombre de los sensores a cada nodo
      />
      
      graphs.push( // hacemos un push del grafo creado al arreglo que creamos
        graph
      )
    }
    this.setState({ // Guardamos los datos que hemos usado durante el método en el state. Si tenemos una variable local y una en el state que se llaman igual podemos solo poner el nombre de la variable y con ello se hace el ajuste de llave - valor
      colors,
      nodesSizes: sizes,
      graphs,
      maxId
    })
  }

  addSpriteText(node){ // Desde este método creamos el texto que flota para cada nodo
    const sprite = new SpriteText(node.name); // Aqui se indica qué dato del nodo se usa para texto
    sprite.color = '#fff';
    sprite.textHeight = 7;
    sprite.position.set(0,12,0);
    return sprite;
}

  getRandomColor = () => { // Este método crea las cadenas de texto para generar colores aleatórios
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setCurrentNode = (node) => { // Este método nos permite hacer la referencia al nodo que hagamos clic
    // Al seleccionar un nodo activamos la bandera que permite mostrar el controlador del nodo
    this.setState({
      selectedNode: node,
      showController: true
    },
    () => {
      // Una vez que hemos seleccionado el nodo cargamos sus valores en el controlador usamos sintaxis de JS
      document.getElementById("nodeValue").value = this.state.nodesSizes[this.state.currentId - 1][node.id]
      document.getElementById("nodeSize").value = this.state.nodesSizes[this.state.currentId - 1][node.id]
    }
    )
  }



  changeNodeSize = (size) => { // Este método nos permite cambiar el tamaño del nodo seleccionado
    // El proceso para cambiar el tamaño de un nodo es prácticamente reconstruir el grafo seleccionado ya que no hay forma de cambiar un nodo meramente sin alterar los demás

    let graphs = [...this.state.graphs] // Hacemos una copia de los grafos
    let node = this.state.selectedNode // Tomamos el nodo seleccionado
    let sizes = this.state.nodesSizes // Hacemos una copiar de los tamaños
    let elem = document.getElementById("3dgraph") // Seleccionamos el elemento contenedor de los grafos

    sizes[this.state.currentId - 1][node.id] = parseInt(size) // Aquí cambiamos el tamaño guardado para el nodo seleccionado en local

    // Se crea un grafo con el tamaño cambiado del nodo
    let graph = <ForceGraph3D
      graphData={this.state.data[this.state.currentId]}
      rendererConfig={{preserveDrawingBuffer: true}}
      nodeResolution={200}
      backgroundColor={"#919191"}
      nodeVal={nod => sizes[this.state.currentId - 1][nod.id] }
      nodeColor={() => this.state.colors[this.state.currentId - 1]}
      nodeLabel={"name"}
      onNodeClick={nod => this.setCurrentNode(nod)}
      onNodeHover={nod => elem.style.cursor = nod ? 'pointer' : null}
      linkWidth={link => 5*link.width}
      linkResolution={200}
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
      linkCurvature={0.25}
      onLinkHover={link => elem.style.cursor = link ? 'pointer' : null} />

    graphs[this.state.currentId - 1] = graph // Cambiamos el grafo actual por el que hemos creado

    this.setState({ // Guardamos en el state el nuevo arreglo de grafos y los tamaños
      graphs,
      nodesSizes: sizes
    }, () => {
      document.getElementById("nodeValue").value = document.getElementById("nodeSize").value // Actualizamos en el controlador el tamaño numérico
    })
  }

  // Cambiar el tamaño de los enlaces EN DESUSO
  // changeLinkSize = (size) => { 
  //   let graph = this.state.graph
  //   graph.linkWidth(parseInt(size))
  //   this.setState({
  //     graph: graph
  //   })
  //   document.getElementById("linkValue").value = document.getElementById("linkSize").value
  // }

  hideController = () => { // Cambia el valor de la bandera del controlador para ocultarlo
    this.setState({
      showController: false
    })
  }

  takeSnapshot = () =>{ // Este método lo usamos para guardar el momento actualdel grafo seleccionado, nos apoyamos de la librería FileSave JS
    if(!this.state.data){
      alert("Es necesario cagar la información primero") // Evitamos que se pueda usar sin información cargada
      return
    }
    // Usando jQuery localizamos el canvas y transformamos su contenido a un blob para poderlo descargar
    $("#3dgraph canvas")[0].toBlob((blob) => { 
      saveAs(blob, "graph.jpeg")
    })
  }

  scaleCoordinates = () =>{ // Nos permite ajustar la escala de los grafos
    let scale = document.getElementById("cooScale").value // Obtenemos el valor seleccionado desde el DOM

    if(scale < 1 || scale > 20){ // Evitamos que se usen valores fuera de rango
      alert("Escala fuera de rango")
      return
    }

    let data = this.state.data // copiamos la data desde el state
    
    // Dado que tenemos el valor de la escala guardada en memoria lo que hacemos es 
    // remover la escala que se tenga actualmente para volver a los datos reales y poder aplicar la escala seleccionada

    for(let i=1; i<=this.state.maxId; i++){
      data[i]["nodes"].forEach(node => {
        node.fx /= this.state.scale
        node.fy /= this.state.scale
        node.fz /= this.state.scale
        node.fx *= scale
        node.fy *= scale
        node.fz *= scale
      })
    }
    
    this.setState({ // Guardamos los datos en memoria, escala y data
      scale,
      data
    }, () => this.fgRef.current.refresh()) // Hacemos un refresh del grafo actual

  }

  // Todos los métodos siguientes que incluyan la palabra "Moment" son usados para controlar los botones de reproducción

   playMoments = () =>{
    this.setState({ // Activamos la bandera que permite que se reproduzcan los momentos
      playMoments: true
    }, () => {
      let currentId = this.state.currentId // Obtenemos el id actual y el máximo
      let maxId = this.state.maxId 
      if(!this.state.pauseMoments && currentId<maxId){ // Si no hemos pausado la reproducción y aún no llegamos al final podemos entrar
        currentId+=1
        this.setState({ //Actualizamos el id actual en un +1
          currentId
        }, () =>{ // Accedemos al callback
          setTimeout(()=>{ // Con este timeout hacemos que se tarde 2000 ms para llamar al mismo método de forma recursiva 
            this.playMoments()
          }, 2000)
        })
        
      }
      else{ // si hemos llegado al final o hemos pausado la reproducción entramos aquí
        this.setState({ // Bajamos la bandera de reproducción y la de pausa
          pauseMoments: false,
          playMoments: false
        })
      }
    })
  }

  pauseMoments = () =>{ // Indicamos que no se pueden reproducir y se deben pausar los momentos
    this.setState({
      playMoments: false,
      pauseMoments: true
    })
  }

  resetMoments = () =>{ // Movemos el id actual hasta el primero
    this.setState({
      currentId: 1,
      playMoments: false,
      pauseMoments: false
    })
  }

  stepMoment = (args) =>{ // Este método nos permite ir un momento atrás o adelante
    let currentId = this.state.currentId + args
    if(currentId > this.state.maxId){ // Comprobamos que la suma del id actual y el +1 no sea mayor al maxId
      currentId = this.state.maxId
    }
    else if(currentId === 0){ // Comprobamos si  es que hemos pedido un id inferior al mínimo
      currentId = 1
    }
    this.setState({ // Actualizamos el id actual y las banderas de reproducción y pausa
      currentId: currentId,
      playMoments: false,
      pauseMoments: false
    })
  }

  lastMoment = () =>{ // Movemos el ID hasta el último posible
    this.setState({
      currentId: this.state.maxId,
      playMoments: false,
      pauseMoments: false
    })
  }

  render() { // El método render debe devolver un solo objeto sugar HTML, que puede ser cualquiera y con lo que sea dentro
    return (
      <div style={{ margin: "0" }}>
        <Menu // Llamamos al menu, el navbar que se tiene en la parte superior
          uploadFile={this.chooseJsonFile.bind(this)} 
          exit={this.props.exit} 
          showPlayControls={this.state.data ? true : false}
          takeSnapshot = {this.takeSnapshot.bind(this)}
          playMoments={this.playMoments.bind(this)}
          pauseMoments={this.pauseMoments.bind(this)}
          resetMoments = {this.resetMoments.bind(this) }
          stepMoment = {this.stepMoment.bind(this)}
          scaleCoordinates = {this.scaleCoordinates.bind(this)}
          lastMoment = {this.lastMoment.bind(this)}/> 
        <InputFile setJson={this.setJsonFile.bind(this)} /> {/* Llamamos el input invisible que sirve para cargar el archivo json */}
        {
          this.state.data ? // Usando el operador ternario evaluamos si tenemos información ya cargada para poder mostrar el slider, en caso contrario mostramos el aviso de que es necesario usar un json
            <div className="sliderContainer">
              <InputRange
                onChange={value => this.setState({ currentId: value })}
                value={this.state.currentId}
                maxValue={parseInt(this.state.maxId)}
                minValue={parseInt(this.state.minId)}
                draggableTrack={true}
                onChangeComplete={value => this.setState({ currentId: value, showController: false })}
              />
            </div> :
            <div className="container file-warning">
              <h1>Ingresa un archivo JSON para comenzar. . .</h1>
            </div>
        }
        {this.state.showController ? // Usando el operador ternario comprobamos si es que se ha seleccionado un nodo o no para mostrar el controlador
          <Controller
            selectedNode={this.state.selectedNode}
            hide={this.hideController.bind(this)}
            nodeSize={this.changeNodeSize}
            linkSize={this.changeLinkSize.bind(this)}
            size={this.state.nodesSizes[this.state.currentId - 1][this.state.selectedNode.id]} />
          : null}
        {/* Declaramos el contenedor que llevará el canvas de los grafos, dentro declaramos que solo se muestre el grafo que se encuentra dentro del arreglo en nuestro momento actual - 1 para ajustar los indices */}
        <div id="3dgraph">{this.state.graphs[this.state.currentId - 1]}</div>


      </div>
    )
  }
}

export default Graph;