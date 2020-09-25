import React from 'react';
import AuthenticationService from '../../services/AuthenticationService';

const EditProfile = (props) => {


    const handleLogout = () => {
        AuthenticationService.logout()
            .then(props.history.push('/login'))
            .catch(error => console.log(error))
    }

    return (
        <>
            EDITAR PERFIL...
        </>
    );
}

export default EditProfile;