import React, {useState} from 'react';
import Graph from "./graph";

import "./main.css"

function Main(){
    const [logged, setLogged] = useState(false)


    function checkData(e){
        e.preventDefault()
        let user = document.getElementById("username").value
        let pass = document.getElementById("password").value
        
        if(user === "admin" && pass === "root"){
            setLogged(true)
        }
        else{
            alert("Datos erróneos")
        }
    }

    return(
        <Graph />
        // <React.Fragment>
        //     {logged ?  
        //         <Graph/> : 
        //         <div className="auth-wrapper">
        //             <div className="auth-inner">
        //                 <form>
        //                     <img style={{height: "200px", marginBottom: "10px", display:"block", marginLeft:"auto", marginRight:"auto"}} src="https://lh3.googleusercontent.com/proxy/gGrh-ltbZx3GfghEt9i3Qsx78yuVL8e2pbu4ECe8rOgkUxuq9h9-1aDVun7CfwiGQypVhgxMVQQwJGnmMyXM_HInLqSegOf8eePhTSjeREHfdzVSey3DWMxhbwzIyxYsEA" alt="logo-udg"/>
        //                     <h3>Ingreso al sistema</h3>

        //                     <div className="form-group">
        //                         <label>Usuario</label>
        //                         <input type="text" id="username" className="form-control" placeholder="Ingrese usuario" />
        //                     </div>

        //                     <div className="form-group">
        //                         <label>Contraseña</label>
        //                         <input type="password" id="password" className="form-control" placeholder="Ingrese contraseña" />
        //                     </div>

        //                     <button onClick={(e) => checkData(e)} type="submit" className="btn btn-primary btn-block">Entrar</button>
                            
        //                 </form>
        //             </div>
        //         </div>
        //     }
        // </React.Fragment>
    )
}


export default Main;