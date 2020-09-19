import { Button, Grid, Paper, makeStyles, Divider } from "@material-ui/core";
import { Formik, Form } from "formik";
import React, { useState } from "react"
import * as Yup from 'yup'
import FormikField from "../FormikField/FormikField";
import AuthenticationService from '../../services/AuthenticationService.js'
import { googleAuthProvider } from '../../services/firebase/setup';
import { Link } from 'react-router-dom'

const RegisterSchema = Yup.object().shape({
  email: Yup.string()
    .required("Email requerido!")
    .email("Formato inválido!"),
  password: Yup.string()
    .required("Contraseña requerida!")
    .min(6, "La contraseña debe tener como minimo 6 digitos y ser alfanumerica"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Las contraseñas no coinciden")
    .required("Debes confirmar la contraseña!")
})

const useStyles = makeStyles((theme) => ({
  loginContent: {
    margin: theme.spacing(1),
    padding: '8px 24px 8px 24px',
    display: "flex",
    //flexDirection: "column",
    alignItems: "center",
    minWidth: 250,
    //minHeight: 350,
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
  },
  botonGoogle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    backgroundColor: "#fafafa",
    color: "black",
    '&:hover': {
      backgroundColor: "#14A7D6",
      color: '#FFF'
    }
  },
  googlelogo: {
    width: 28,
    height: 28,
    marginRight: 10
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  divider: {
    border: 'none',
    height: '3px',
    margin: 0,
    flexShrink: 0,
    backgroundColor: 'rgba(27, 195, 222, 100)',
    outline: 'none',
    borderColor: '#1bc3de',
    boxShadow: '0 0 4px #1bc3de',
    borderRadius: '10px 10px 10px 10px',
  }
}));

const Register = (props) => {

  const [email,] = useState('')
  const [password,] = useState('')
  const [confirmPassword,] = useState('')

  const onSubmit = (values, { setFieldError }) => {
    AuthenticationService.signupEmail(values.email, values.password)
      .then((response) => {
        this.props.history.push('/aftersignup')
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            setFieldError("email", "El email ingresado se encuentra en uso")
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
            //setEmailError(err.message);
            break;
          case "auth/wrong-password":
            //setPasswordError(err.message);
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
          <h1 className={classes.title}>uWork</h1>
          <Paper
            className={classes.loginContent}
            elevation={3}
          >

            <Formik
              initialValues={{ email, password, confirmPassword }}
              onSubmit={onSubmit}
              validationSchema={RegisterSchema}>
              {({ dirty, isValid, errors, touched }) => (
                <Form>
                  <FormikField className={classes.textField} label="Email" id="register-email" name="email" type="email" required
                    error={errors.email && touched.email} fullWidth />
                  <FormikField className={classes.textField} label="Contraseña" id="register-pass" name="password"
                    type="password" required error={errors.password && touched.password} fullWidth />
                  <FormikField className={classes.textField} label="Confirmar contraseña" id="register-conf-pass" name="confirmPassword" type="password" required error={errors.confirmPassword && touched.confirmPassword} fullWidth />
                  <Button className={classes.boton}
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!dirty || !isValid}>
                    Registrarme
                  </Button>
                  <Divider className={classes.divider} variant="middle" />
                  <Button className={classes.botonGoogle} variant="contained"
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
            <p className={classes.textHasAccount}>¿Ya estás registrado? <Link style={{ cursor: 'pointer' }} to='/login'>Inicia Sesión</Link></p>
          </div>
          <div></div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Register