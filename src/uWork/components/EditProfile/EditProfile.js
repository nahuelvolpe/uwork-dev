import React from 'react';
import AuthenticationService from '../../services/AuthenticationService';
import { Button } from "@material-ui/core";

const EditProfile = (props) => {


    const handleLogout = () => {
        AuthenticationService.logout()
            .then(props.history.push('/login'))
            .catch(error => console.log(error))
    }

    return (
        <>
            {/* <div className="header">
            <h2 className="hache2">Bienvenido</h2>
            <div className="header-right">
                <Button variant="contained" onClick={handleLogout}>Cerrar Sesión</Button>
             </div>
        </div> */}
            EDITAR PERFIL...
        </>
    );
}

export default EditProfile;