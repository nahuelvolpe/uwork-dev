import React from 'react';
import { Button, TextField, Grid, Paper, makeStyles } from '@material-ui/core';


const Login = (props) => {

    const { 
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        handleSignup,
        hasAccount,
        setHasAccount,
        emailError,
        passwordError
    } = props;

    const useStyles = makeStyles(theme => ({
        loginContent: {
            margin: theme.spacing(1),
            padding: theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 250,
            minHeight: 350
        },
        textField: {
            marginBottom: theme.spacing(2),
            width: "100%"
        },
        boton: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            width: "100%"
        },
        textHasAccount: {
            marginTop: theme.spacing(2)
        },
        title: {
            marginBottom: theme.spacing(3),
        },
        errorMsg: {
            fontSize: "12px",
            color: 'red'
        }
      }));
      
    const classes = useStyles();

    return ( 

        <div>
            <Grid container style={ {minHeight: '100vh'}}>
                <Grid 
                    container 
                    item 
                    xs={12}
                    alignItems="center"
                    direction="column"
                    justify="space-between"                           
                >
                    <div/>
                        <Paper 
                            className={classes.loginContent} 
                            elevation={3} 
                        >
                            
                            <h1 className={classes.title}> uWork </h1>
                            
                            <TextField     
                                className={classes.textField}                        
                                id="standard-basic" 
                                label="Username" 
                                autoFocus
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        
                            <p className={classes.errorMsg} >{emailError}</p>
                            
                            <TextField
                                className={classes.textField}
                                id="standard-password-input"
                                label="Password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        
                            <p className={classes.errorMsg} >{passwordError}</p>
                            
                            <div style={{alignItems: "center", width: "100%"}}>
                                {hasAccount ? (
                                    <>
                                        <Button className={classes.boton} variant="contained" color="primary" onClick={handleLogin}>Ingresar</Button>
                                        <p className={classes.textHasAccount}>No tienes una cuenta?<span onClick={() => setHasAccount( !hasAccount )}>Registrate</span></p>
                                    </>
                                ) : (
                                    <>
                                        <Button className={classes.boton} variant="contained" color="primary" onClick={handleSignup}>Registrarme</Button>
                                        <p className={classes.textHasAccount}>Tienes una cuenta? <span onClick={() => setHasAccount( !hasAccount )}>Ingresa</span></p>
                                    </>
                                )

                                }
                            </div>
                        </Paper>
                    
                    <div/>
                </Grid>
            </Grid>
        </div>

       
     );
}
 
export default Login;