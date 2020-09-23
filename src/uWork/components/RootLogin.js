import React, { useContext } from 'react'; 
import { AuthContext } from '../context/auth';
import { Route, Redirect } from 'react-router-dom'
import CircularProgress from '@material-ui/core/CircularProgress';

const RootLogin = (props) => {

    const { children } = props;
    const { isLoggedIn } = useContext(AuthContext);
    const condition = false;

    console.log(children)
    console.log(props)
    console.log('estoy en rootlogin')


    if (!isLoggedIn && condition){
        return <Redirect to="/login" />;
    }else if (!isLoggedIn) {
        return (
        <div>
            <CircularProgress />
        </div>
        );
    }

    return children;
}
 
export default RootLogin;