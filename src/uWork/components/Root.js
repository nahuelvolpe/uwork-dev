import React, { useContext } from 'react'; 
import { AuthContext } from '../context/auth';
import CircularProgress from '@material-ui/core/CircularProgress';


const Root = (props) => {
    
    const { children } = props;
    const { authReady } = useContext(AuthContext);

    if (!authReady) {
        return (
        <div>
            <CircularProgress />
        </div>
        );
    }

    return children;
}


export default Root;