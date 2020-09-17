import { Button, Grid, Paper, withStyles } from "@material-ui/core";
import { Formik, Form } from "formik";
import React, { Component } from "react"
import * as Yup from 'yup'
import FormikField from "../FormikField/FormikField";
import AuthenticationService from '../../services/AuthenticationService.js'
import { googleAuthProvider } from '../../services/firebase/setup';

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

const useStyles = theme => ({
  loginContent: {
    margin: theme.spacing(1),
    padding: theme.spacing(3),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minWidth: 250,
    minHeight: 350,
  },
  title: {
    marginBottom: theme.spacing(3),
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
  }
});

class Register extends Component {

  state = {
    email: '',
    password: '',
    confirmPassword: ''
  }

  onSubmit = (values) => {
    AuthenticationService.signupEmail(values.email, values.password)
      .then((response) => {
        this.props.history.push('/aftersignup')
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
          case "auth/invalid-email":
            //setEmailError(err.message);
            break;
          case "auth/weak-password":
            //setPasswordError(err.message);
            break
          default:
            break;
        }
      });
  }

  handleLoginSocial = (provider) => {
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

  render() {
    const { classes } = this.props
    let { email, password, confirmPassword } = this.state
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
            <Paper
              className={classes.loginContent}
              elevation={3}
            >
              <h1 className={classes.title}>uWork</h1>
              <Formik
                initialValues={{ email, password, confirmPassword }}
                onSubmit={this.onSubmit}
                validationSchema={RegisterSchema}>
                {({ dirty, isValid, errors, touched }) => (
                  <Form>
                    <FormikField label="Email" id="register-email" name="email" type="email" required
                      error={errors.email && touched.email} fullWidth />
                    <FormikField label="Contraseña" id="register-pass" name="password"
                      type="password" required error={errors.password && touched.password} fullWidth />
                    <FormikField label="Confirmar contraseña" id="register-conf-pass" name="confirmPassword" type="password" required
                      error={errors.confirmPassword && touched.confirmPassword} fullWidth />

                    <Button className={classes.boton}
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={!dirty || !isValid}>
                      Registrarme
                  </Button>
                    <Button className={classes.boton} variant="contained"
                      color="primary" onClick={() => this.handleLoginSocial(googleAuthProvider)}>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="logo"
                        className={classes.googlelogo} />
                        Ingresar con Google
                  </Button>
                  </Form>
                )}
              </Formik>
              {/* <TextField
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
            <p className={classes.errorMsg}>{confirmPasswordError}</p> */}

              {/* <Button className={classes.boton} variant="contained"
                    color="primary" onClick={handleLogin}>
                    Ingresar
                </Button>
                <p className={classes.textHasAccount}>No tienes una cuenta? 
                <span> <Link to="/register">Registrate</Link></span>
                </p> */}
              {/* <div style={{ alignItems: "center", width: "100%" }}>
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

                    {<Button
                      className={classes.boton}
                      variant="contained"
                      color="primary"
                      onClick={() => handleLoginSocial(googleAuthProvider)}
                    >
                      Ingresa con google
                                </Button>}

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

                    <Button
                      className={classes.boton}
                      variant="contained"
                      color="primary"
                      onClick={() => handleLoginSocial(googleAuthProvider)}
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                        alt="logo"
                        className={classes.googlelogo}
                      />Registrate con Google
                                </Button>

                    <p className={classes.textHasAccount}>
                      Tienes una cuenta?
                                    <span onClick={() => setHasAccount(!hasAccount)}>
                        Ingresa
                                    </span>
                    </p>
                  </>
                )}
            </div> */}
            </Paper>
            <div />
          </Grid>
        </Grid>
      </div>
    )
  }
}

export default withStyles(useStyles)(Register)