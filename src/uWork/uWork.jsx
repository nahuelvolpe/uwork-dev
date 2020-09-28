import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import AppRouter from './routers/AppRouter'

const UWorkApp = (props) => {
  return (
    <div data-testid={props["data-testid"]}>
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </div>
  )
}

export default UWorkApp;