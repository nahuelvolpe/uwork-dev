import React from 'react';
import {Switch, Route} from 'react-router-dom';


import EditProfile  from '../components/EditProfile/EditProfile';
import Dashboard  from '../components/Dashboard/Dashboard';

export const DashboardRoutes = () => {

    return (
            <Switch>   
                <Route exact path="/editprofile" component={props => <EditProfile {...props} />} />
                <Route exact path="/dashboard" component={props => <Dashboard {...props} />} />
            </Switch>
    )
}