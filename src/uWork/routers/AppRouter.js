import React from 'react'
import { Switch } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { PublicRoute } from './PublicRoute';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Dashboard from '../components/Dashboard/Dashboard';
import EditProfile from '../components/EditProfile/EditProfile';
import Layout from '../components/Layout/Layout';


const AppRouter = () => {

    return (
        <div>
            <Switch>
                <PublicRoute exact path="/" component={Login} />
                <PublicRoute exact path="/login" component={Login} />
                <PublicRoute exact path="/register" component={Register} />
                <Layout>
                    <PrivateRoute exact path="/edit_profile" component={EditProfile} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                </Layout>
            </Switch>
        </div>
    )
}

export default AppRouter;