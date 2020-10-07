import React, { useEffect, useState } from 'react';
import { Button, Grid, LinearProgress, Avatar, makeStyles } from "@material-ui/core";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Formik, Form } from "formik";
import FormikField from "../FormikField/FormikField";
import { auth, storage } from '../../services/firebase';
import * as UserService from '../../services/UserService'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar';
import * as Yup from 'yup'

const EditProfileSchema = Yup.object().shape({
  nombre: Yup.string()
    .required("Nombre requerido!"),
  apellido: Yup.string()
    .required("Apellido requerido!"),
})

const useStyles = makeStyles((theme) => ({
  editProfileContent: {
    display: "flex",
    alignItems: "center",
  },
  textField: {
    //marginBottom: theme.spacing(2),
    width: "100%",
  },
  botonGuardar: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    width: "100%",
    color: 'white'
  },
  botonImagen: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: 'white'
  },
  title: {
    marginBottom: theme.spacing(3),
    color: 'black'
  },
  progress: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: "50%"
  },
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    marginTop: 12
  },
  input: {
    display: "none"
  }
}));

const EditProfile = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [errorSaving, setErrorSaving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openSuccessBar, setOpen] = useState(false)
  const [loadingImage, setLoadingImage] = useState(false)
  const [imgUserUrl, setImgUserUrl] = useState('https://gravatar.com/avatar/cbbf8aab01e062ed2238aafca8092dfc?s=200&d=mp&r=x');

  useEffect(() => {
    const id = auth.currentUser.uid
    UserService.getUserData(id)
      .then(response => {
        const data = response.data()
        setNombre(data.firstName)
        setApellido(data.lastName)
        setImgUserUrl(data.photoURL)
      })
  }, [])

  const classes = useStyles();

  const docUserID = auth.currentUser.uid;

  const onSubmit = (values) => {
    setSaving(true)
    UserService.updateUser(values, imgUserUrl)
      .then(() => {
        auth.currentUser.updateProfile({
          photoURL: imgUserUrl
        })
        setSaving(false)
        setOpen(true)
      }).catch((e) => {
        setErrorSaving(true)
        setSaving(false)
      })
  }

  const handleCloseSnackBarSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleCloseSnackBarError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSaving(false);
  };

  const chooseFile = (e) => {
    setLoadingImage(true)
    var file = e.target.files[0];
    var storageRef = storage.ref('users/' + docUserID + '/profile.jpg');
    var task = storageRef.put(file);

    task.on('state_changed',
      null,
      function error(err) {
        console.log("Error mientras se cargaba la imagen")
        setLoadingImage(false)
      },
      function complete() {
        getUrlImage();
        setLoadingImage(false)
      }
    );
  }

  const getUrlImage = () => {
    var storageRef = storage.ref('users/' + docUserID + '/profile.jpg');
    storageRef.getDownloadURL().then(imgUrl => {
      setImgUserUrl(imgUrl);
    })
  }

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
          <Avatar className={classes.avatar} src={imgUserUrl} />
          <input
            className={classes.input}
            id="contained-button-file"
            multiple
            type="file"
            onChange={chooseFile}
          />
          <label htmlFor="contained-button-file">
            <Button className={classes.botonImagen}
              variant="contained"
              color="primary"
              component="span"
              disabled={loadingImage}
              startIcon={<CloudUploadIcon />}>
              {!loadingImage ? 'Subir imagen' : 'Cargando...'}
            </Button>
          </label>
          <Formik
            enableReinitialize
            initialValues={{ nombre, apellido }}
            validationSchema={EditProfileSchema}
            onSubmit={onSubmit}>
            {({ dirty, isValid, errors, touched }) => (
              <Form>
                <FormikField className={classes.textField} required label="Nombre" id="user-name" name="nombre" type="text"
                  error={errors.nombre && touched.nombre} fullWidth />

                <FormikField className={classes.textField} required label="Apellido" id="user-surname" name="apellido"
                  type="text" error={errors.apellido && touched.apellido} fullWidth />

                <Button className={classes.botonGuardar}
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={(!dirty || !isValid) || saving}>
                  Guardar
                </Button>
                {saving && <LinearProgress />}
              </Form>
            )}
          </Formik>
          <CustomizedSnackbars open={openSuccessBar} handleClose={handleCloseSnackBarSuccess} severity="success">
            Datos guardados!
          </CustomizedSnackbars>
          <CustomizedSnackbars open={errorSaving} handleClose={handleCloseSnackBarError} severity="error">
            Error al guardar los datos.
          </CustomizedSnackbars>
        </Grid>
      </Grid>
    </div>
  )
}

export default EditProfile;