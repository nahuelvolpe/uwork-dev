import React, { useContext } from 'react'
import { Switch } from 'react-router-dom'
import { SubjectProvider } from '../context/subject'
import { AuthContext } from '../context/auth'
import { PrivateRoute } from './PrivateRoute'
import { PublicRoute } from './PublicRoute'
import Login from '../components/Login/Login'
import Register from '../components/Register/Register'
import Dashboard from '../components/Dashboard/Dashboard'
import EditProfile from '../components/EditProfile/EditProfile'
import Layout from '../components/Layout/Layout'
import Subject from '../components/Subject/Subject'

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
                    
                        <Layout>
                            <PrivateRoute exact path="/edit_profile" component={EditProfile} />
                            <PrivateRoute exact path="/dashboard" component={Dashboard} />
                            <PrivateRoute exact path="/subject/:materiaId" component={Subject} />
                        </Layout>
                    
                </Switch>
            </SubjectProvider>
            }
        </div>
    )
}

export default AppRouter;