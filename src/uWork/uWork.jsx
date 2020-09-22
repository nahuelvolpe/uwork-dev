import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import Login from './components/Login/Login'
import AfterSignup from './components/AfterSignup'
import Register from "./components/Register/Register"
import Layout from './components/Layout/Layout'

const UWorkApp = (props) => {
  return (
    <div data-testid={props["data-testid"]}>
      <AuthContextProvider>
        {/* <Layout> */}
        <Switch>
          <Route exact path="/" render={props => <Login {...props} />} />
          <Route exact path="/login" render={props => <Login {...props} />} />
          <Route exact path="/aftersignup" render={props => <AfterSignup {...props} />} />
          <Route exact path="/register" render={props => <Register {...props} />} />
          {/* <AuthenticatedRoute exact path="/news" render={props => <NewsDashboard />} /> */}
          {/* <Route render={props => <ErrorComponent />} /> */}
        </Switch>
        {/* </Layout> */}
      </AuthContextProvider>
    </div>
  )
}

export default UWorkApp;