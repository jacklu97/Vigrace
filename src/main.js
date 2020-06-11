import React, {useState} from 'react';
import Graph from "./graph";

import "./main.css"

function Main(){
    // const [logged, setLogged] = useState(false)
    return(
        <Graph />
        // <React.Fragment>
        //     {logged ?  
        //         <Graph/> : 
        //         <div>
        //             <h2>Inicio de sesión</h2>
        //             <input type="text" placeholder="Usuario" />
        //             <input type="password" placeholder="Contraseña" />
        //         </div>
        //     }
        // </React.Fragment>
    )
}


export default Main;