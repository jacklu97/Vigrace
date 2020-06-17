import React, {useState} from 'react';
import Graph from "./graph";

import "./main.css"

/*
    Este componente tiene las veces de funcionar como puerta de login y comprobar los datos que se le dan
    Use el hook de useState dado que es un state-less component
*/


function Main(){ 
    const [logged, setLogged] = useState(false)


    function checkData(e){ // Comprobamos si se ha ingresado la información correcta y se cambian el valor de la variable logged
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

    function exit(){ // Cambia el valor de la variable y saca al usuario del sistema
        setLogged(false)
    }

    return(
        <React.Fragment>
            {logged ?  // con el operador ternario vemos si se ha logeado o no el usuario
                <Graph exit={() => exit()}/>  : 
                // Se llama al grafo pasando por props la función exit que cambia el estado de log
                // En caso de no estar logeado se muestra este formulario de login
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