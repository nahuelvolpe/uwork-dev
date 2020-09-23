import React, { useContext } from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from 'react-router-dom';

import { AuthContext } from '../context/auth';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';

import { DashboardRoutes } from './DashboardRoutes';

import Login  from '../components/Login/Login';
import Register  from '../components/Register/Register';
import Dashboard from '../components/Dashboard/Dashboard';
import EditProfile from '../components/EditProfile/EditProfile';
import LoadingScreen from '../components/LoadingScreen';


const AppRouter = () => {

    const { isLoggedIn } = useContext(AuthContext);

    return (
        <Router>
                <Switch> 
                    <PublicRoute 
                        exact path="/login" 
                        component={ Login } 
                        isAuthenticated={ isLoggedIn }
                    />

                    <PublicRoute 
                        exact path="/register" 
                        component={ Register } 
                        isAuthenticated={ isLoggedIn }
                    />
                    
                    <PrivateRoute 
                        exact path="/dashboard" 
                        component={ Dashboard } 
                        isAuthenticated={ isLoggedIn }
                    />

                    <PrivateRoute 
                        exact path="/editprofile" 
                        component={ EditProfile } 
                        isAuthenticated={ isLoggedIn }
                    />
                    
                    <Route 
                        exact path="/loadingscreen" 
                        component={ LoadingScreen }
                        isAuthenticated={ isLoggedIn }
                    />

                </Switch>
        </Router>
    )
}

export default AppRouter;