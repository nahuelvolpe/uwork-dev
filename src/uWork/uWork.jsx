import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import AppRouter from './routers/AppRouter'

const UWorkApp = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default UWorkApp;