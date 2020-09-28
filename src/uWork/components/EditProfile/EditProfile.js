import React, { useState } from 'react';
import { Button, Grid,  makeStyles } from "@material-ui/core";
import { Formik, Form } from "formik";
import FormikField from "../FormikField/FormikField";

const useStyles = makeStyles((theme) => ({
    textField: {
      marginBottom: theme.spacing(2),
      width: "100%",
    },
    boton: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      width: "50%",
      color: 'white'
    },
    title: {
      marginBottom: theme.spacing(3),
      color: 'black'
    },
  }));

const EditProfile = (props) => {
    const [nombre,] = useState('')
    const [apellido,] = useState('')
    const [mail,] = useState('')


      const classes = useStyles();

      return (
        <div>
          <Grid container style={{}}>
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              direction="column"
              justify="center"
            >
              <div><h1 className={classes.title}>EDITAR PERFIL</h1></div>
                <Formik
                  initialValues={{ nombre, apellido, mail }}
                  /*onSubmit={}*/>
                  {({ dirty, isValid, errors, touched }) => (
                      <Form>
                      <input type="file"/> 
                      <FormikField className={classes.textField} label="Nombre" id="user-name" name="nombre" type="text"
                        fullWidth />

                      <FormikField className={classes.textField} label="Apellido" id="user-surname" name="apellido"
                        type="text" fullWidth />

                      <FormikField className={classes.textField} label="Correo Electrónico" id="user-mail" name="mail" 
                      type="text" fullWidth />

                      {<Button className={classes.boton}
                        variant="contained"
                        color="primary"
                        type="submit">
                        Guardar
                      </Button>}
                      
                    </Form>
                  )}
                </Formik>
            </Grid>
          </Grid>
        </div>
      )
}

export default EditProfile;