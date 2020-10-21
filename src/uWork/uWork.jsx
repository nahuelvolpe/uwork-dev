import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import AppRouter from './routers/AppRouter'

const UWorkApp = (props) => {
  return (
<<<<<<< HEAD
    <div data-testid={props["data-testid"]}>
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </div>
=======
    <AuthContextProvider>
      <AppRouter />
    </AuthContextProvider>
>>>>>>> dashboard
  )
}

export default UWorkApp;