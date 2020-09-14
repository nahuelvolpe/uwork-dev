import React from 'react';

const AfterSignup = ({handleLogout}) => {
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