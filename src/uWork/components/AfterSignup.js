import React from 'react';
import AuthenticationService from '../services/AuthenticationService';
import { Button } from "@material-ui/core";

const AfterSignup = (props) => {
    

    const handleLogout = () => {
        AuthenticationService.logout()
            .then( props.history.push('/') )
            .catch( error => console.log(error))
    }
    
    
    return ( 
        <div class="header">
            <h2 className="hache2">Bienvenido</h2>
            <div className="header-right">
                <Button variant="contained" onClick={handleLogout}>Cerrar Sesión</Button>
             </div>
        </div>
     );
}
 
export default AfterSignup;