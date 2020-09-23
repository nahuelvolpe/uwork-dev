import React, {useContext} from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingScreen = (props) => {

    

    const routeFrom = props.history.location.state.routeFrom;
    console.log(routeFrom)
    const { isLoggedIn } = useContext(AuthContext);
    console.log(isLoggedIn)

    if (!isLoggedIn) {
        console.log('loading...')
        return (
        <div>
            <CircularProgress />
        </div>
        );
    }else if (isLoggedIn && routeFrom === 'register') {
        return <Redirect to="/editprofile" />;
    }else if (isLoggedIn && routeFrom === 'login') {
        return <Redirect to="/dashboard" />;
    }
}
 
export default LoadingScreen;