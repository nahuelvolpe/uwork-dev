import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import Login from './components/Login/Login'
import EditProfile from './components/EditProfile/EditProfile'
import Register from "./components/Register/Register"
import Dashboard from "./components/Dashboard/Dashboard"
import Layout from './components/Layout/Layout'
import GuardRoute from './components/GuardRoute'
import Root from './components/Root'


const uWorkApp = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthContextProvider>
          
            <Switch>          
              <Route type="public" exact path="/login" render={props => <Login {...props} />} />              
              <Route type="public" exact path="/register" render={props => <Register {...props} />} />    
              <Route type="private" exact path="/dashboard" render={props => <Dashboard {...props} />} />
              <Route type="private" exact path="/editprofile" render={props => <EditProfile {...props} />} />

              {/* <Redirect from="/" to="/login" /> */}
              {/* <Route type="public" exact path="/" render={props => <Login {...props} />} /> */}
              {/* <AuthenticatedRoute exact path="/news" render={props => <NewsDashboard />} /> */}
              {/* <Route render={props => <ErrorComponent />} /> */}
            </Switch>
          
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default uWorkApp;