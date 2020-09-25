import React from 'react';
import AuthenticationService from '../../services/AuthenticationService';
import { Button } from "@material-ui/core";

const Dashboard = (props) => {


    const handleLogout = () => {
        AuthenticationService.logout()
            .then(props.history.push('/login'))
            .catch(error => console.log(error))
    }


    return (
        <>
            {/* <div className="header">
            <div className="header-right">
                <Button variant="contained" onClick={handleLogout}>Cerrar Sesión</Button>
             </div>
        </div> */}
            <div>
                <p>MATERIAS...</p>
            </div>
        </>
    );
}

export default Dashboard;