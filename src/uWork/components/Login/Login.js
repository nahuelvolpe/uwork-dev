import React, { useState } from "react";
import { Link, withRouter } from 'react-router-dom'
import { Button, Grid, Paper, makeStyles, Divider } from "@material-ui/core";
import AuthenticationService from '../../services/AuthenticationService'
import { googleAuthProvider } from '../../services/firebase/setup';
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
    padding: '8px 24px 8px 24px',
    display: "flex",
    alignItems: "center",
    maxWidth: 240,
    minHeight: 270,
    borderRadius: '26px'
  },
  textField: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
  boton: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    color: 'white'
  },
  botonGoogle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    backgroundColor: "#fafafa",
    color: "black",
    '&:hover': {
      backgroundColor: "#2ab182",
      color: '#FFF'
    }
  },
  googlelogo: {
    width: 28,
    height: 28,
    marginRight: 10
  },
  title: {
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  },
  divider: {
    border: 'none',
    height: '1px',
    margin: 0,
    outline: 'none',
    boxShadow: '0 0 2px #1bc3de',
    flexShrink: '0',
    borderColor: '#1bc3de',
    borderRadius: '1px 1px 1px 1px',
    backgroundColor: theme.palette.primary.main,
  },
  register: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='25 50 430 100' preserveAspectRatio='none'%3E%3Crect x='0' y='0' width='500' height='500' style='stroke: none; fill: %23FFFFFF;' /%3E%3Cdefs%3E%3ClinearGradient id='gradient'%3E%3Cstop offset='5%25' stop-color='%238F34A4' /%3E%3Cstop offset='80%25' stop-color='%23A53493' /%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath fill='url(%23gradient)' d='M0,100 C150,115 350,80 500,100 L500,00 L0,0 Z' style='stroke: none'%3E%3C/path%3E%3C/svg%3E");`
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'none',
    fontWeight: 600,
    color: theme.palette.secondary.main
  },
  logo: {
    maxWidth: 40,
  }
}));

const Login = (props) => {

  const [email,] = useState('')
  const [password,] = useState('')

  const onSubmit = (values, { setFieldError }) => {
    AuthenticationService.loginEmail(values.email, values.password)
      .then(() => {
        props.history.push('/dashboard');
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setFieldError('email', 'Usuario no encontrado');
            break;
          case "auth/wrong-password":
            setFieldError('password', 'Contraseña incorrecta');
            break;
          default:
            break;
        }
      });
  }

  const handleLoginSocial = (provider) => {
    AuthenticationService.loginSocial(provider)
      .then(() => {
          props.history.push("/dashboard");
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
    <div className={classes.register}>
      <Grid container style={{ minHeight: "100vh" }}>
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          direction="column"
          justify="center"
        >
          <div></div>
          <div className={classes.title}>
            <img src='https://firebasestorage.googleapis.com/v0/b/uwork-dev-beta.appspot.com/o/assets%2FuWork.png?alt=media&token=ea6dd5fe-9312-4fac-8c50-c7964cc91939' alt='' className={classes.logo}></img>
            <h1 style={{fontFamily: 'Roboto', marginLeft: 8}}>uWork</h1>
          </div>
          <Paper
            className={classes.loginContent}
            elevation={3}
          >
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
                    id="login-button"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!dirty || !isValid}>
                    Ingresar
                    </Button>

                  <Divider className={classes.divider} variant="middle" />

                  <Button id="login-google-button" className={classes.botonGoogle} variant="contained"
                    color="primary" onClick={() => handleLoginSocial(googleAuthProvider)}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      alt="logo"
                      className={classes.googlelogo} />
                          Ingresar con Google
                    </Button>
                </Form>
              )}
            </Formik>
          </Paper>
          <div style={{ textAlign: "center", width: "100%" }}>
            <p>¿No tienes cuenta? <Link className={classes.link} to="/register">Registrate</Link></p>
          </div>
          <div></div>
        </Grid>
      </Grid>
    </div>
  )
}

export default withRouter(Login)