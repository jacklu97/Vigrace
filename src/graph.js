// Librerias propias de npm
import React from 'react'
import ForceGraph3D from 'react-force-graph-3d';
import SpriteText from 'three-spritetext';
import $ from 'jquery';
import InputRange from 'react-input-range';
import './App.css';
import "react-input-range/lib/css/index.css";

// Componentes creados
import Menu from './menu';
import Controller from './controller';
import InputFile from './inputFile';

class Graph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: null,
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
    $("#jsonFile").click();
  }

  setJsonFile = (jsonF) => {
    this.setState({
      data: jsonF,
      currentId: 1
    }, () => {
      this.createGraph()
    })
  }

  createGraph = () => {
    let elem = document.getElementById("3dgraph")
    let keys = Object.keys(this.state.data)
    let maxId = parseInt(keys[keys.length - 1])
    let sizes = []
    
    for(let i= 1; i<=maxId; i++){
      let hashMap = {}
      this.state.data[i]["links"].forEach(link => {
        if(link.target in hashMap){
          hashMap[link.target] += 1
        }
        else{
          hashMap[link.target] = 1
        }
      });
      
      this.state.data[i]["nodes"].forEach(node => {
        if(node.id in hashMap){
          hashMap[node.id] += 4
        }
        else{
          hashMap[node.id] = 4
        }
      })

      sizes.push(hashMap)
    }

    console.log(sizes)

    let graphs = []
    let colors = []

    let WIDTH = $(document).width();
    let HEIGHT = $(document).height();

    for (let i = 1; i <= maxId; i++) {
      let color = this.getRandomColor()
      colors.push(color)

      let graph = <ForceGraph3D
      graphData={this.state.data[i]}
      rendererConfig={{preserveDrawingBuffer: true}}
      nodeResolution={200}
      backgroundColor={"#919191"}
      nodeColor={() => color}
      nodeLabel={"name"}
      showNavInfo={true}
      width={WIDTH}
      height={HEIGHT}
      nodeVal={nod => sizes[this.state.currentId - 1][nod.id] }
      onNodeClick={node => this.setCurrentNode(node)}
      onNodeHover={node => elem.style.cursor = node ? 'pointer' : null}
      linkWidth={link => 5*link.width}
      linkResolution={200}
      onLinkHover={link => elem.style.cursor = link ? 'pointer' : null} 
      nodeThreeObjectExtend={nod => true}
      nodeThreeObject={(nod) => this.addSpriteText(nod)}/>
      
      graphs.push(
        graph
      )
    }
    this.setState({
      colors,
      nodesSizes: sizes,
      graphs,
      maxId
    })
  }

  addSpriteText(node){
    const sprite = new SpriteText(node.name);
    sprite.color = '#fff';
    sprite.textHeight = 7;
    sprite.position.set(0,12,0);
    return sprite;
}

  getRandomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setCurrentNode = (node) => {
    console.log(node)
    this.setState({
      selectedNode: node,
      showController: true
    },
    () => {
      document.getElementById("nodeValue").value = this.state.nodesSizes[this.state.currentId - 1][node.id]
      document.getElementById("nodeSize").value = this.state.nodesSizes[this.state.currentId - 1][node.id]
    }
    )
  }



  changeNodeSize = (size) => {
    let graphs = [...this.state.graphs]
    let node = this.state.selectedNode
    let sizes = this.state.nodesSizes
    let elem = document.getElementById("3dgraph")

    console.log(sizes)
    sizes[this.state.currentId - 1][node.id] = parseInt(size)

    let graph = <ForceGraph3D
      graphData={this.state.data[this.state.currentId]}
      rendererConfig={{preserveDrawingBuffer: true}}
      nodeResolution={200}
      backgroundColor={"grey"}
      nodeVal={nod => sizes[this.state.currentId - 1][nod.id] }
      nodeColor={() => this.state.colors[this.state.currentId - 1]}
      nodeLabel={"name"}
      onNodeClick={nod => this.setCurrentNode(nod)}
      onNodeHover={nod => elem.style.cursor = nod ? 'pointer' : null}
      linkWidth={link => 5*link.width}
      linkResolution={200}
      onLinkHover={link => elem.style.cursor = link ? 'pointer' : null} />

    graphs[this.state.currentId - 1] = graph

    this.setState({
      graphs,
      nodesSizes: sizes
    }, () => {
      document.getElementById("nodeValue").value = document.getElementById("nodeSize").value
    })
  }

  changeLinkSize = (size) => {
    let graph = this.state.graph
    graph.linkWidth(parseInt(size))
    this.setState({
      graph: graph
    })
    document.getElementById("linkValue").value = document.getElementById("linkSize").value

  }

  hideController = () => {
    this.setState({
      showController: false
    })
  }

   playMoments = () =>{
    this.setState({
      playMoments: true
    }, () => {
      let currentId = this.state.currentId
      let maxId = this.state.maxId
      if(!this.state.pauseMoments && currentId<maxId){
        currentId+=1
        this.setState({
          currentId
        }, () =>{
          setTimeout(()=>{
            this.playMoments()
          }, 2000)
        })
        
      }
      else{
        this.setState({
          pauseMoments: false,
          playMoments: false
        })
      }
    })
  }

  pauseMoments = () =>{
    this.setState({
      playMoments: false,
      pauseMoments: true
    })
  }

  resetMoments = () =>{
    this.setState({
      currentId: 1
    })
  }

  stepMoment = (args) =>{
    let currentId = this.state.currentId + args
    if(currentId > this.state.maxId){
      currentId = this.state.maxId
    }
    else if(currentId === 0){
      currentId = 1
    }
    this.setState({
      currentId: currentId
    })
  }

  lastMoment = () =>{
    this.setState({
      currentId: this.state.maxId
    })
  }

  render() {
    return (
      <div style={{ margin: "0" }}>
        <Menu 
          uploadFile={this.chooseJsonFile.bind(this)} 
          exit={this.props.exit} 
          showPlayControls={this.state.data ? true : false}
          playMoments={this.playMoments.bind(this)}
          pauseMoments={this.pauseMoments.bind(this)}
          resetMoments = {this.resetMoments.bind(this) }
          stepMoment = {this.stepMoment.bind(this)}
          lastMoment = {this.lastMoment.bind(this)}/>
        <InputFile setJson={this.setJsonFile.bind(this)} />
        {
          this.state.data ?
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
        {this.state.showController ?
          <Controller
            selectedNode={this.state.selectedNode}
            hide={this.hideController.bind(this)}
            nodeSize={this.changeNodeSize}
            linkSize={this.changeLinkSize.bind(this)}
            size={this.state.nodesSizes[this.state.currentId - 1][this.state.selectedNode.id]} />
          : null}

        <div id="3dgraph">{this.state.graphs[this.state.currentId - 1]}</div>


      </div>
    )
  }
}

export default Graph;