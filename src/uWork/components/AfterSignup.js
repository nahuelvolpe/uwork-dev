import React from 'react';

const AfterSignup = ({handleLogout}) => {
    return ( 
        <div className="hero">
            <nav>
                <h2>Bienvenido</h2>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </nav>
        </div>
     );
}
 
export default AfterSignup;