import React, { useContext } from 'react'; 
import { Route, Redirect } from 'react-router-dom'
import { AuthContext } from '../context/auth';


const GuardRoute = (props) => {

    console.log(props)
    const { type, ...rest} = props;
    const { isLoggedIn } = useContext(AuthContext)

    if( type === 'private' && !isLoggedIn ){
        console.log('volvete a login puto')
        return <Redirect to="/login" />;
        
    }else if ( type === 'public' && isLoggedIn ){
        console.log('redirect dashboard')
        return <Redirect to="/dashboard" />;
    }

   return (
       <Route {...rest} />
   );
}
 

export default GuardRoute;