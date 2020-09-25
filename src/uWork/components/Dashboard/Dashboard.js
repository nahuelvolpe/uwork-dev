import React from 'react';
import AuthenticationService from '../../services/AuthenticationService';

const Dashboard = (props) => {


    const handleLogout = () => {
        AuthenticationService.logout()
            .then(props.history.push('/login'))
            .catch(error => console.log(error))
    }

    return (
        <>
            <div>
                <p>MATERIAS...</p>
            </div>
        </>
    );
}

export default Dashboard;