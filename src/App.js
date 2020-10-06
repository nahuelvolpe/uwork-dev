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
    secundary: { 
      light: '#35FFE3',
      main: '#30E3CA',
      dark: '#16C4AB',
      contrastText: '#000'
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
