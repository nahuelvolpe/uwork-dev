import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { SubjectProvider } from '../context/subject'
import { AuthContext } from '../context/auth'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import Login from '../components/Login/Login'
import Register from '../components/Register/Register'
import Dashboard from '../components/Dashboard/Dashboard'
import EditProfile from '../components/EditProfile/EditProfile'
import Subject from '../components/Subject/Subject'
import NotFound from '../components/NotFound/NotFound'
import Welcome from '../components/Welcome/Welcome'

const AppRouter = () => {

    const { authReady } = useContext(AuthContext);

    return (
        <div>
            {authReady &&
            <SubjectProvider>
                <Switch>
                    <PublicRoute exact path="/" component={Login} />
                    <PublicRoute exact path="/login" component={Login} />
                    <PublicRoute exact path="/register" component={Register} />
                    <PublicRoute exact path="/welcome" component={Welcome} />
                    <Route exact path="/404" component={NotFound} />
                    <PrivateRoute exact path="/edit_profile" component={EditProfile} />
                    <PrivateRoute exact path="/dashboard" component={Dashboard} />
                    <PrivateRoute exact path="/subject/:materiaId" component={Subject} />
                    <Redirect to="/404" />
                </Switch>
            </SubjectProvider>
            }
        </div>
    )
}

export default AppRouter;