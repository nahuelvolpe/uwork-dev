import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import Login from './components/Login/Login'
import AfterSignup from './components/AfterSignup'
import Register from "./components/Register/Register"

const uWorkApp = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthContextProvider>
          <Switch>
            <Route exact path="/" render={props => <Login {...props} />} />
            <Route exact path="/login" render={props => <Login {...props} />} />
            <Route exact path="/aftersignup" render={props => <AfterSignup {...props} />} />
            <Route exact path="/register" render={props => <Register {...props} />} />
            {/* <AuthenticatedRoute exact path="/news" render={props => <NewsDashboard />} /> */}
            {/* <Route render={props => <ErrorComponent />} /> */}
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default uWorkApp;