import React from 'react';
import UWorkApp from './uWork/uWork';
import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom'

const theme = createMuiTheme({
  palette: {
    primary: { 
      light: '#18C7FF',
      main: '#14A7D6',
      dark: '#148EB5',
      contrastText: '#fff'
     },
    secondary: { 
      main: '#6c757d',
    },
    action: {
      main: '#007bff'
    },
    warning: {
      main: '#ffc107'
    },
    success: {
      main: '#28a745'
    },
    info:{
      main: '#17a2b8'
    },
    danger: {
      main: '#dc3545'
    }
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <UWorkApp data-testid="work-app" />
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
