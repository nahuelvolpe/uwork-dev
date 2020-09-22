import React from 'react';
import UWorkApp from './uWork/uWork';
import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import { BrowserRouter } from 'react-router-dom'

const theme = createMuiTheme({
  palette: {
    primary: { main: '#14A7D6' },
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
