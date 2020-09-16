import React from 'react';
import UWorkApp from './uWork/uWork';
import './App.css';

function App() {

  /* const handleLogout = () => {
    fire.auth().signOut();
   }

  const authListener = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        clearInputs();
        setUser(user);
        console.log(user);
      } else {
        setUser('');
      }
    })
  }

  useEffect(() => {
    authListener();
  }, []) */

  return (
    <div className="App">
      <UWorkApp />
      {/* user ? (
        <AfterSignup
          handleLogout={handleLogout}
       /> 
      ) : (
        <Login 
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}  
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          hasAccount={hasAccount}
          setHasAccount={setHasAccount}
          emailError={emailError}
          passwordError={passwordError}
        />
      ) */}
    </div>
  );
}

export default App;
