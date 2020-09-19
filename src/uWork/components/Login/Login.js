import React, { useState } from "react";
//import { Link, withRouter } from 'react-router-dom'
import { Button, Grid, Paper, makeStyles, Link } from "@material-ui/core";
import AuthenticationService from '../../services/AuthenticationService' 
import { googleAuthProvider} from '../../services/firebase/setup';
import * as Yup from 'yup'
import FormikField from "../FormikField/FormikField";
import { Formik, Form } from "formik";


const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email requerido!")
      .email("Formato inválido!"),
    password: Yup.string()
      .required("Contraseña requerida!")
      .min(6, "La contraseña debe tener como minimo 6 digitos y ser alfanumerica"),
  })
  
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
    botonGoogle: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: "100%",
      backgroundColor: "#fafafa",
      color: "black"
    },
    googlelogo: {
      width: 28,
      height: 28,
      marginRight: 10
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    textHasAccount: {
        marginTop: theme.spacing(2),
        alignItems: 'center',
    },
  }));
  
  const Login = (props) => {
  
    const [email,] = useState('')
    const [password,] = useState('')
  
    const onSubmit = (values, { setFieldError }) => {
      AuthenticationService.loginEmail(values.email, values.password)
        .then((response) => {
          props.history.push('/aftersignup')
        })
        .catch((err) => {
            switch (err.code) {
                case "auth/invalid-email":
                case "auth/user-disabled":
                case "auth/user-not-found":
                    setFieldError('email', 'Usuario no encontrado' );
                    break;
                case "auth/wrong-password":
                    // setPasswordError(err.message);
                    break;
                default:
                    break;
            }
        });
    }
  
    const handleLoginSocial = (provider) => {
      AuthenticationService.loginSocial(provider)
        .then((response) => {
          this.props.history.push('/aftersignup')
        }).catch((err) => {
          switch (err.code) {
            case "auth/invalid-email":
            case "auth/user-disabled":
            case "auth/user-not-found":
              break;
            case "auth/wrong-password":
              break;
            default:
              break;
          }
        });
    }

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
            <div></div>
            <Paper
              className={classes.loginContent}
              elevation={3}
            >
              <h1 className={classes.title}>uWork</h1>
              <Formik
                initialValues={{ email, password }}
                onSubmit={onSubmit}
                validationSchema={LoginSchema}>
                {({ dirty, isValid, errors, touched }) => (
                  <Form>
                    <FormikField className={classes.textField} label="Email" id="login-email" name="email" type="email" required
                      error={errors.email && touched.email} fullWidth />
                    <FormikField className={classes.textField} label="Contraseña" id="login-pass" name="password"
                      type="password" required error={errors.password && touched.password} fullWidth />
        
                    <Button className={classes.boton}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!dirty || !isValid}>
                      Ingresar
                    </Button>

                    <Button className={classes.botonGoogle} variant="contained"
                      color="primary" onClick={() => handleLoginSocial(googleAuthProvider)}>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="logo"
                        className={classes.googlelogo} />
                          Ingresar con Google
                    </Button>
                    <div style={{ textAlign: "center", width: "100%" }}>
                    <p className={classes.textHasAccount}>¿No tienes cuenta? <Link style={{cursor: 'pointer'}} onClick={() => props.history.push('/register')}>Registrate</Link></p>

                    </div>
                  </Form>
                )}
              </Formik>
            </Paper>
            <div></div>
          </Grid>
        </Grid>
      </div>
    )
  }
  
  export default Login