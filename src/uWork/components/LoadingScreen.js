import React, {useContext, useState} from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import CircularProgress from '@material-ui/core/CircularProgress';

const LoadingScreen = (props) => {

    /* const [routeFrom, setRouteFrom] = useState('noroute')

    if(props.history.location.state){
        setRouteFrom(props.history.location.state.routeFrom);
        console.log(routeFrom);
    } 
    */

    var routeFrom = 'noroute'

    if(props.history.location.state){
        routeFrom = props.history.location.state.routeFrom;
    } 
    
    
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
        console.log('redirect to dashboard from login')
        return <Redirect to="/dashboard" />;
    } else if (isLoggedIn && routeFrom === 'noroute') {
        return <Redirect to="/dashboard" />;
    } 
}
 
export default LoadingScreen;