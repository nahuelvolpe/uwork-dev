import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthContextProvider } from './context/auth'
import AppRouter from './routers/AppRouter'



const uWorkApp = () => {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default uWorkApp;