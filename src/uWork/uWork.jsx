import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import Login from './components/Login/Login'
import AfterSignup from './components/AfterSignup'
import Register from "./components/Register/Register"
import Layout from './components/Layout/Layout'
import GuardRoute from './components/GuardRoute'
import Root from './components/Root'


const uWorkApp = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthContextProvider>
          <Root>
            <Switch>          
              <GuardRoute type="public" exact path="/login" render={props => <Login {...props} />} />              
              <GuardRoute type="public" exact path="/register" render={props => <Register {...props} />} />    
              <Layout>
                <GuardRoute type="private" exact path="/aftersignup" render={props => <AfterSignup {...props} />} />
              </Layout>
              {/* <Redirect from="/" to="/login" /> */}
              {/* <Route type="public" exact path="/" render={props => <Login {...props} />} /> */}
              {/* <AuthenticatedRoute exact path="/news" render={props => <NewsDashboard />} /> */}
              {/* <Route render={props => <ErrorComponent />} /> */}
            </Switch>
          </Root>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default uWorkApp;