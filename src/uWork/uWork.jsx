import React from 'react'
import { AuthContextProvider } from './context/auth'
import AppRouter from './routers/AppRouter'

const UWorkApp = (props) => {
  return (
    //<div data-testid={props["data-testid"]}>
    <div>
      <AuthContextProvider>
        <AppRouter />
      </AuthContextProvider>
    </div>
  )
}

export default UWorkApp;