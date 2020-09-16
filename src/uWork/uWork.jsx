import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import Login from './components/Login'

const uWorkApp = () => {
  return (
    <div>
      <BrowserRouter>
        <AuthContextProvider>
          <Switch>
            <Route path="/" exact render={props => <Login {...props} />} />
            <Route exact path="/login" render={props => <Login {...props} />} />
            {/* <Route exact path="/register" render={props => <RegisterComponent {...props} />} /> */}
            {/* <AuthenticatedRoute exact path="/news" render={props => <NewsDashboard />} /> */}
            {/* <Route render={props => <ErrorComponent />} /> */}
          </Switch>
        </AuthContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default uWorkApp;