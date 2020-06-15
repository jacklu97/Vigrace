import React, {useState} from 'react';
// import React from 'react';
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

    function exit(){
        setLogged(false)
    }

    return(
        // <Graph />
        <React.Fragment>
            {logged ?  
                <Graph exit={() => exit()}/> : 
                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form>
                            <img style={{height: "200px", marginBottom: "10px", display:"block", marginLeft:"auto", marginRight:"auto"}} src="http://www.cusur.udg.mx/es/sites/default/files/adjuntos/logo_udg-gris.png" alt="logo-udg"/>
                            <h2>VIGRACE</h2>
                            <h3>Ingreso al sistema</h3>

                            <div className="form-group">
                                <label>Usuario</label>
                                <input type="text" id="username" className="form-control" placeholder="Ingrese usuario" />
                            </div>

                            <div className="form-group">
                                <label>Contraseña</label>
                                <input type="password" id="password" className="form-control" placeholder="Ingrese contraseña" />
                            </div>

                            <button onClick={(e) => checkData(e)} type="submit" className="btn btn-primary btn-block">Entrar</button>
                            
                        </form>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}


export default Main;