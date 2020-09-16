import React from 'react';
import AuthenticationService from '../services/AuthenticationService';

const AfterSignup = (props) => {


    const handleLogout = () => {
        AuthenticationService.logout()
            .then( props.history.push('/') )
            .catch( error => console.log(error))
    }

    return ( 
        <section className="hero">
            <nav>
                <h2>Welcome</h2>
                <button onClick={handleLogout}>Logout</button>
            </nav>
        </section>
     );
}
 
export default AfterSignup;