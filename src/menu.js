import React from 'react';

import "./menu.css"

function Menu(props){
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <h5 style={{color: "white"}}>Vigrace</h5>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav">
                    <li className="nav-item dropdown">
                        <button className="nav-link dropdown-toggle button-as-link" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Acciones
                        </button>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <button onClick={() => props.uploadFile()} className="button-as-link actions">Cargar JSON</button>
                            <button onClick={() => props.exit()} className="button-as-link actions">Salir</button>
                        </div>
                    </li>
                </ul>
                {props.showPlayControls ? 
                    <div className="playControler">
                        <button onClick={() => props.resetMoments()}><i className="fa fa-fast-backward"></i></button>
                        <button onClick={() => props.playMoments()}><i className="fa fa-play"></i></button>
                        <button onClick={() => props.pauseMoments()}><i className="fa fa-pause"></i></button>
                    </div>
                    : null
                }
            </div>
            </nav>
    )
}

export default Menu;