import React, { useState } from "react";
import { Link, withRouter } from 'react-router-dom'
import { Button, TextField, Grid, Paper, makeStyles } from "@material-ui/core";
import AuthenticationService from '../services/AuthenticationService.js'

const Login = (props) => {
    /* const {
        hasAccount,
        setHasAccount,
    } = props; */

    //const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [hasAccount, setHasAccount] = useState(false);

    /* const clearInputs = () => {
        setEmail('');
        setPassword('');
    } */

    const clearErrors = () => {
        setEmailError('');
        setPasswordError('');
    }

    const handleLogin = () => {
        clearErrors();
        AuthenticationService.loginEmail(email, password)
            .then((response) => {
                props.history.push('/dashboard')
            }).catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                    case "auth/user-disabled":
                    case "auth/user-not-found":
                        setEmailError(err.message);
                        break;
                    case "auth/wrong-password":
                        setPasswordError(err.message);
                        break;
                    default:
                        break;
                }
            });
    };

    const handleSignup = () => {
        clearErrors();
        if(password == confirmPassword){
            AuthenticationService.signupEmail(email, password)
            .catch((err) => {
                switch (err.code) {
                    case "auth/email-already-in-use":
                    case "auth/invalid-email":
                        setEmailError(err.message);
                        break;
                    case "auth/weak-password":
                        setPasswordError(err.message);
                        break
                    default:
                        break;
                }
            });
        }else {
            setConfirmPasswordError('Las contraseñas no coinciden');
        }
    }; 

    const useStyles = makeStyles((theme) => ({
        loginContent: {
            margin: theme.spacing(1),
            padding: theme.spacing(3),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: 250,
            minHeight: 350,
        },
        textField: {
            marginBottom: theme.spacing(2),
            width: "100%",
        },
        boton: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            width: "100%",
        },
        textHasAccount: {
            marginTop: theme.spacing(2),
        },
        title: {
            marginBottom: theme.spacing(3),
        },
        errorMsg: {
            fontSize: "12px",
            color: "red",
        },
    }));
    const classes = useStyles();
    return (
        <div>
            <Grid container style={{ minHeight: "100vh" }}>
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
                            <h1 className={classes.title}>uWork</h1>
                            <TextField
                                className={classes.textField}
                                id="standard-basic"
                                label="Email"
                                autoFocus
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className={classes.errorMsg}>{emailError}</p>
                            <TextField
                                className={classes.textField}
                                id="standard-password-input"
                                label="Contraseña"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />                           
                            <p className={classes.errorMsg}>{passwordError}</p>

                            {!hasAccount ? (
                                <TextField
                                className={classes.textField}
                                id="standard-password-input"
                                label="Confirmar contraseña"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            ) : null
                            }
                            <p className={classes.errorMsg}>{confirmPasswordError}</p>

                            {/* <Button className={classes.boton} variant="contained"
                                color="primary" onClick={handleLogin}>
                                Ingresar
                            </Button>
                            <p className={classes.textHasAccount}>No tienes una cuenta? 
                            <span> <Link to="/register">Registrate</Link></span>
                            </p> */}
                            <div style={{ alignItems: "center", width: "100%" }}>
                                {hasAccount
                                    ? (
                                        <>
                                            <Button
                                                className={classes.boton}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleLogin}
                                            >
                                                Ingresar
                                            </Button>
                                            <p className={classes.textHasAccount}>No tienes una cuenta?
                                                <span onClick={() => setHasAccount(!hasAccount)}>
                                                    Registrate
                                                </span>
                                            </p>
                                        </>
                                    )
                                    : (
                                        <>
                                            <Button
                                                className={classes.boton}
                                                variant="contained"
                                                color="primary"
                                                onClick={handleSignup}
                                            >
                                                Registrarme
                                            </Button>
                                            <p className={classes.textHasAccount}>
                                                Tienes una cuenta?
                                                <span onClick={() => setHasAccount(!hasAccount)}>
                                                    Ingresa
                                                </span>
                                            </p>
                                        </>
                                    )}
                            </div>
                        </Paper>
                    <div/>
                </Grid>
            </Grid>
        </div>
    );
};

export default withRouter(Login);
