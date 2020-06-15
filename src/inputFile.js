import React from 'react';

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