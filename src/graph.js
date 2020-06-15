import React from 'react'
import ForceGraph3D from 'react-force-graph-3d';
// import * as THREE from 'three';
import $ from 'jquery';
import InputRange from 'react-input-range';
import './App.css';
import "react-input-range/lib/css/index.css";

import Menu from './menu';
import Controller from './controller';
import InputFile from './inputFile';

class Graph extends React.Component {
    constructor(){
        super()
        this.state = {
            data: null,
            showController: false,
            currentId: 1,
            minId: 1,
            maxId: null,
            nodesSizes: [],
            colors: [],
            selectedNode: null,
            graphs: []
        }
    }

    chooseJsonFile=()=>{
      $("#jsonFile").click();
    }

    setJsonFile = (jsonF) =>{
      this.setState({
        data: jsonF,
        currentId: 1
      }, ()=>{
        console.log(this.state)
        this.createGraph()
      })
    }

    createGraph = () =>{
        let elem = document.getElementById("3dgraph")
        let keys = Object.keys(this.state.data)
        let maxId = parseInt(keys[keys.length-1])
        let sizes = Array.apply(null, {length: maxId}).map(() => Array.apply(null, {length: 9}).map(() => 4))
        let graphs = []
        let colors = []

        let WIDTH = $(document).width();
        let HEIGHT = $(document).height();
        
        for(let i = 1; i<=maxId; i++){
            let color= this.getRandomColor()
            colors.push(color)
            let graph = <ForceGraph3D 
                          graphData={this.state.data[i]}
                          nodeResolution={200}
                          backgroundColor={"grey"}
                          nodeColor={() => color}
                          nodeLabel={"name"} 
                          showNavInfo={true}
                          width={WIDTH}
                          height={HEIGHT}
                          nodeRelSize={4}
                          onNodeClick={node => this.setCurrentNode(node)}
                          onNodeHover={ node => elem.style.cursor = node ? 'pointer' : null}
                          linkWidth={2}
                          linkResolution={200}
                          onLinkHover={ link => elem.style.cursor = link ? 'pointer' : null }/>
            
            graphs.push(
                graph
            )
        }
        this.setState({
            colors,
            nodesSizes: sizes,
            graphs,
            maxId
        }, ()=>console.log(this.state))
    }


    getRandomColor=()=> {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      }

    setCurrentNode=(node)=>{
        console.log(node)
        this.setState({
          selectedNode: node,
          showController: true
        })
        document.getElementById("nodeValue").value = this.state.nodesSizes[this.state.currentId-1][node.id]
        document.getElementById("nodeSize").value = this.state.nodesSizes[this.state.currentId-1][node.id]
      }



      changeNodeSize=(size)=>{
        let graphs = [...this.state.graphs]
        let node = this.state.selectedNode
        let sizes = this.state.nodesSizes
        let elem = document.getElementById("3dgraph")
    
        console.log(sizes)
        sizes[this.state.currentId-1][node.index] = parseInt(size)
    
        let graph = <ForceGraph3D 
                  graphData={this.state.data[this.state.currentId]} 
                  nodeResolution={200}
                  backgroundColor={"grey"}
                  nodeVal={(nod)=> {return sizes[this.state.currentId-1][nod.index]}}
                  nodeColor={() => this.state.colors[this.state.currentId-1]}
                  nodeLabel={"name"} 
                  onNodeClick={nod => this.setCurrentNode(nod)}
                  onNodeHover={ nod => elem.style.cursor = nod ? 'pointer' : null}
                  linkWidth={2}
                  linkResolution={200}
                  onLinkHover={ link => elem.style.cursor = link ? 'pointer' : null }/>

        graphs[this.state.currentId-1] = graph

        this.setState({
          graphs,
          nodesSizes: sizes
        }, () => {
          document.getElementById("nodeValue").value = document.getElementById("nodeSize").value
        })
      }
    
      changeLinkSize=(size)=>{
        let graph = this.state.graph
        graph.linkWidth(parseInt(size))
        this.setState({
          graph: graph
        })
        document.getElementById("linkValue").value = document.getElementById("linkSize").value
    
      }

      hideController=()=>{
        this.setState({
          showController: false
        })
      }

    render(){
        return(
            <div style={{margin: "0"}}>
              <Menu uploadFile={this.chooseJsonFile.bind(this)} exit={this.props.exit}/>
              <InputFile setJson={this.setJsonFile.bind(this)}/>
                {
                  this.state.data ? 
                  <div className="sliderContainer">
                      <h4>Momentos</h4>
                      <InputRange 
                          onChange={value => this.setState({currentId: value})} 
                          value={this.state.currentId} 
                          maxValue={parseInt(this.state.maxId)} 
                          minValue={parseInt(this.state.minId)} 
                          draggableTrack={true}
                          onChangeComplete={ value => this.setState({currentId: value, showController: false}) }
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
                        linkSize={this.changeLinkSize.bind(this) }
                        size = {this.state.nodesSizes[this.state.currentId-1][this.state.selectedNode.index]}/> 
                    : null}

                <div id="3dgraph">{this.state.graphs[this.state.currentId-1]}</div>
                
                
            </div>
        )
    }
}

export default Graph;