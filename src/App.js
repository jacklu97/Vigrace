import React from 'react';
import './App.css';
import data from './data.json';
import ForceGraph3D from '3d-force-graph';
import InputRange from 'react-input-range';
import "react-input-range/lib/css/index.css";

import Controller from './controller';

class App extends React.Component {
  constructor(props){
    super(props);
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
      graph: null
    }
  }

  componentDidMount(){
    let keys = Object.keys(data)
    let maxId = parseInt(keys[keys.length-1])
    let currentId = this.state.currentId
    let newNodes = data[currentId]["nodes"].map(
              (country, index) => {
                let object = Object.assign({}, country)
                object.id = index
                return object
              }
            )
    let sizes = Array.apply(null, {length: maxId}).map(() => Array.apply(null, {length: newNodes.length}).map(() => 4))
    let colors = Array.apply(null, {length: newNodes.length}).map(()=>0)
    colors[0] = this.getRandomColor()
    this.setState({
      maxId,
      nodes: newNodes,
      links: data[currentId]["links"],
      nodesSizes: sizes,
      colors,
      currentId
    }, ()=>{
      console.log(this.state)
      this.loadGraph()
      // this.setNextData()
    })
  }

  // componentDidMount(){
  //   axios.get("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json")
  //   .then(
  //     (res) => {
  //       console.log(res)
  //       let newNodes = res.data.nodes.map(
  //         (country, index) => {
  //           let object = Object.assign({}, country)
  //           object.id = index
  //           return object
  //         }
  //       )
  //       this.setState({
  //         nodes: newNodes,
  //         links: res.data.links
  //       })
  //       this.loadGraph()
  //     },
  //   ).catch(
  //     (err) => {
  //       console.log(err)
  //     }
  //   )
  // }

  setNextData(){
    setTimeout(()=>{
      let currentId = this.state.currentId
      let newNodes = data[currentId]["nodes"].map(
                (country, index) => {
                  let object = Object.assign({}, country)
                  object.id = index
                  return object
                }
              )
      let graph = this.state.graph
      let gData = {
        nodes: newNodes,
        links: data[currentId]["links"]
      }
      graph.graphData(gData).nodeColor(()=>'red')
    }, 5000)
  }

  setNewData(id){
    let newNodes = data[id]["nodes"].map(
      (country, index) => {
        let object = Object.assign({}, country)
        object.id = index
        return object
      }
    )
    let colors = this.state.colors
    if(colors[id-1] === 0){
      colors[id-1] = this.getRandomColor()
    }
    let graph = this.state.graph
    let gData = {
      nodes: newNodes,
      links: data[id]["links"]
    }
    graph.pauseAnimation()
    graph.graphData(gData).nodeColor(()=> colors[id-1])
    graph.refresh().resumeAnimation()
    this.setState({
      colors,
      nodes: newNodes,
      links: data[id]["links"],
      currentId: id,
      graph
    }, ()=> console.log(this.state))
  }

  loadGraph(){
    // let graph = ForceGraph3D()(document.getElementById("3d-graph")).graphData(gData).nodeLabel('country').nodeResolution(200).linkResolution(200).linkWidth(2).backgroundColor('gray')
    // .nodeColor(() => 'green')
    let gData = {
      nodes: this.state.nodes,
      links: this.state.links
    }

    let elem = document.getElementById("3d-graph")
    
    this.setState({
      graph: ForceGraph3D()(elem).graphData(gData).nodeLabel('country').nodeResolution(200).linkResolution(200).linkWidth(2).backgroundColor('gray')
      .nodeColor(() => this.state.colors[this.state.currentId-1]).onNodeClick(node => this.setCurrentNode(node)).onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
      .nodeVal( node => {parseInt(this.state.nodesSizes[this.state.currentId-1][node.id])})
    }, ()=> console.log(this.state))
  }

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  setCurrentNode(node){
    // console.log(node["__threeObj"]["geometry"]["parameters"]["radius"])
    console.log(node)
    this.setState({
      selectedNode: node,
      showController: true
    })
    document.getElementById("nodeValue").value = this.state.nodesSizes[this.state.currentId-1][node.id]
    document.getElementById("nodeSize").value = this.state.nodesSizes[this.state.currentId-1][node.id]
  }

  changeNodeSize(size){
    let graph = this.state.graph
    let node = this.state.selectedNode
    let sizes = this.state.nodesSizes

    console.log(sizes)
    sizes[this.state.currentId-1][node.index] = parseInt(size)
    console.log(sizes)

    graph.pauseAnimation()
    graph.nodeVal(node => sizes[this.state.currentId-1][node.id])
    graph.refresh()
    graph.resumeAnimation()
    this.setState({
      nodesSizes: sizes,
      graph: graph
    }, () =>{
      document.getElementById("nodeValue").value = document.getElementById("nodeSize").value
    })
  }

  changeLinkSize(size){
    let graph = this.state.graph
    graph.linkWidth(parseInt(size))
    this.setState({
      graph: graph
    })
    document.getElementById("linkValue").value = document.getElementById("linkSize").value

  }

  hideController(){
    this.setState({
      showController: false
    })
  }

  render() {
    return(
      <div className="">
        <div className="sliderContainer">
          <h4>Momentos</h4>
          <InputRange 
            onChange={value => this.setState({currentId: value})} 
            value={this.state.currentId} 
            maxValue={parseInt(this.state.maxId)} 
            minValue={parseInt(this.state.minId)} 
            draggableTrack={true}
            onChangeComplete={ value => this.setNewData(value) }
            />
        </div>
        {/* {this.state.showController ? 
          <Controller 
            selectedNode={this.state.selectedNode} 
            hide={this.hideController.bind(this)}
            nodeSize={this.changeNodeSize.bind(this)} 
            linkSize={this.changeLinkSize.bind(this) }/> 
          : null} */}
        
        <div className="Grafo" id="3d-graph">{this.state.graph}</div>
      </div>
    )
  }
}

export default App;
