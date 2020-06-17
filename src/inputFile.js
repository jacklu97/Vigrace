import React from 'react';

/*
    Este componente solo tiene la función de tener el control de los archivos que se suben mediante el menú de acciones
    Usa FileReader de JS con los metodos de onloadend, una vez que carga se activa el método que se le proporciona por props llamado "setJson"
    Ese método es el método "setJsonFile" que se encuentra en graph.js
*/

const InputFile = (props) =>{
    let fileReader;

    const handleFileRead=(e)=>{
        const content = fileReader.result;
        // console.log(JSON.parse(content))
        props.setJson(JSON.parse(content))
    }

    const handleFileChosen = (file) =>{
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file)
    }

    return <input onChange={(e) => handleFileChosen(e.target.files[0])} accept='.json' type="file" id="jsonFile" style={{display: "none"}}/>
}

export default InputFile;