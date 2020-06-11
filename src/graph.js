import React from 'react'
import ForceGraph3D from 'react-force-graph-3d';
import InputRange from 'react-input-range';
import './App.css';
import "react-input-range/lib/css/index.css";


import Controller from './controller';

import data from './data.json'

class Graph extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showController: false,
            currentId: 1,
            minId: 1,
            maxId: null,
            nodes: [],
            nodesSizes: [],
            links: [],
            colors: [],
            selectedNode: null,
            graphData: [],
            graphs: []
        }
    }

    componentDidMount = () =>{
        console.log(data)
        let elem = document.getElementById("3dgraph")
        let keys = Object.keys(data)
        let maxId = parseInt(keys[keys.length-1])
        let sizes = Array.apply(null, {length: maxId}).map(() => Array.apply(null, {length: 7}).map(() => 4))
        let graphs = []
        let colors = []
        for(let i = 1; i<=maxId; i++){
            let color= this.getRandomColor()
            colors.push(color)
            graphs.push(
                <ForceGraph3D 
                graphData={data[i]}
                nodeResolution={200}
                backgroundColor={"grey"}
                nodeColor={() => color}
                nodeLabel={"country"} 
                onNodeClick={node => this.setCurrentNode(node)}
                onNodeHover={ node => elem.style.cursor = node ? 'pointer' : null}
                linkWidth={2}
                linkResolution={200}
                onLinkHover={ link => elem.style.cursor = link ? 'pointer' : null }/>
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
                  graphData={data[this.state.currentId]} 
                  nodeResolution={200}
                  backgroundColor={"grey"}
                  nodeVal={(nod)=> sizes[this.state.currentId-1][nod.id]}
                  nodeColor={() => this.state.colors[this.state.currentId-1]}
                  nodeLabel={"country"} 
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
            <div>
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
                </div>
                {this.state.showController ? 
                    <Controller 
                        selectedNode={this.state.selectedNode} 
                        hide={this.hideController.bind(this)}
                        nodeSize={this.changeNodeSize} 
                        linkSize={this.changeLinkSize.bind(this) }
                        size = {this.state.nodesSizes[this.state.currentId-1][this.state.selectedNode.id]}/> 
                    : null}

                <div id="3dgraph">{this.state.graphs[this.state.currentId-1]}</div>
                
            </div>
        )
    }
}

export default Graph;