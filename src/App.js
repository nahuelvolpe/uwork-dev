import React from 'react';
import UWorkApp from './uWork/uWork';
import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    primary: { main: '#14A7D6' },
  }
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <UWorkApp />
      </div>
    </ThemeProvider>
  );
}

export default App;
