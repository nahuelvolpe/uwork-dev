import React from 'react';
import AuthenticationService from '../services/AuthenticationService';

const AfterSignup = (props) => {
    

    const handleLogout = () => {
        AuthenticationService.logout()
            .then( props.history.push('/') )
            .catch( error => console.log(error))
    }
    
    
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