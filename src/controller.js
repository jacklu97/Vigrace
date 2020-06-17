import React from 'react';
import './controller.css';

function Controller(props){
    try{
      let size = props.size !== null ? props.size : 4
      return(
          <div id="btn">
            <button onClick={() => props.hide()} className="close"></button>
            <label htmlFor="nodeSize">Node size</label>
            <input id="nodeSize" type="range" defaultValue={size} min="4" max="20" onChange={() =>  props.nodeSize(document.getElementById("nodeSize").value)}/>
            <p><input id="nodeValue" className="values" defaultValue={size}></input>px</p>
            {/* <label htmlFor="nodeSize">Links size</label>
            <input id="linkSize" type="range" defaultValue="2" min="2" max="10" onChange={() => props.linkSize(document.getElementById("linkSize").value)}/>
            <p><input id="linkValue" className="values" defaultValue="2"></input>px</p> */}
            <label htmlFor="">Nodo seleccionado</label>
            <p>
              {props.selectedNode !== null ? props.selectedNode["name"] : ""}
            </p>

          </div>
      )
  }
  catch{
    console.log("Error detectado")
    return null
  }
}

export default Controller;