import React, { useEffect, useState } from 'react';
import { Button, Grid, LinearProgress, makeStyles, ButtonBase } from "@material-ui/core";
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
  userImg: Yup.mixed()
})

const useStyles = makeStyles((theme) => ({
  editProfileContent: {
    display: "flex",
    alignItems: "center",
  },
  textField: {
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
  },
  image: {
    position: "relative",
    height: 200,
    "&:hover, &$focusVisible": {
      zIndex: 1,
      "& $imageBackdrop": {
        backgroundColor: 'rgba(0,0,0,0.15)'
      }
    }
  },
  focusVisible: {},
  imageSrc: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundSize: "cover",
    backgroundPosition: "center 40%"
  },
  imageBackdrop: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    transition: theme.transitions.create("opacity"),
    borderRadius: "50%"
  }
}));

const EditProfile = () => {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [errorSaving, setErrorSaving] = useState(false)
  const [saving, setSaving] = useState(false)
  const [openSuccessBar, setOpen] = useState(false)
  const [userImg, setuserImg] = useState('https://gravatar.com/avatar/cbbf8aab01e062ed2238aafca8092dfc?s=200&d=mp&r=x');

  useEffect(() => {
    const id = auth.currentUser.uid
    UserService.getUserData(id)
      .then(response => {
        const data = response.data()
        setNombre(data.firstName ? data.firstName : '')
        setApellido(data.lastName ? data.lastName : '')
        setuserImg(prevImg => data.photoURL ? data.photoURL : prevImg)
      })
  }, [])

  const classes = useStyles();
  const docUserID = auth.currentUser.uid;

  const onSubmit = (values) => {
    setSaving(true)
    UserService.updateUser(values)
      .then(() => {
        auth.currentUser.updateProfile({
          photoURL: userImg
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

  const handleFileChange = (e, setFieldValue) => {
    var file = e.target.files[0];
    setFieldValue("file", file)
    var storageRef = storage.ref('users/' + docUserID + '/profile.jpg');
    var task = storageRef.put(file);
    task.on('state_changed',
      null,
      function error(err) {
        setErrorSaving(true)
      },
      function complete() {
        storageRef.getDownloadURL().then(imgUrl => {
          setFieldValue("userImg", imgUrl)
        })
      }
    );
  }

  return (
    <div>
      <Grid container>
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          direction="column"
          justify="center"
        >
          <Formik
            enableReinitialize
            initialValues={{ userImg, nombre, apellido }}
            validationSchema={EditProfileSchema}
            onSubmit={onSubmit}>
            {({ dirty, isValid, errors, touched, setFieldValue, values, setTouched }) => (
              <Form>
                <label htmlFor="contained-button-file">
                  <ButtonBase
                    focusRipple
                    className={classes.image}
                    focusVisibleClassName={classes.focusVisible}
                    style={{
                      width: "200px",
                      borderRadius: "50%",
                      marginTop: "10px",
                      marginBottom: "10px"
                    }}
                    component="span"
                  >
                    <span className={classes.imageSrc} />
                    <img src={values.userImg} height="100%"
                      width="100%" alt="" style={{
                        borderRadius: "50%"
                      }} />
                    <span className={classes.imageBackdrop} />
                  </ButtonBase>
                </label>
                <input className={classes.input} id="contained-button-file"
                  name="file" type="file" multiple accept="image/*" onChange={(event) => handleFileChange(event, setFieldValue)} />
                <div className={classes.input}>
                  <FormikField label="Imagen" id="user-img" name="userImg" type="text"
                    fullWidth onChange={() => setTouched("userImg")} />
                </div>
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