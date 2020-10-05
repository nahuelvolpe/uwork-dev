import React, { useState } from 'react';
import { Button, Grid, LinearProgress, Typography, Box, Avatar, makeStyles } from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab"
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Formik, Form } from "formik";
import FormikField from "../FormikField/FormikField";
import { auth, db, storage } from '../../services/firebase';
import { AuthContext } from '../../context/auth';
import { CloudUploadRounded } from '@material-ui/icons';



const useStyles = makeStyles((theme) => ({
    editProfileContent: {
      display: "flex",
      alignItems: "center",
    },
    textField: {
      marginBottom: theme.spacing(2),
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
      width: "50%",
      marginBottom: theme.spacing(2)
    },
    avatar: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
    input: {
      display: "none"
    }
  }));

const EditProfile = (props) => {
    const [nombre,] = useState('')
    const [apellido,] = useState('')
    const [mail,] = useState('')
    const [update, setUpdate] = useState(false)
    const [progress, setProgress] = useState(0);
    const [progressFull, setProgressFull] = useState(false);

    const photoURL = auth.currentUser.photoURL;

    const [imgUserUrl, setImgUserUrl] = useState(photoURL !== '' ? photoURL : 'https://gravatar.com/avatar/cbbf8aab01e062ed2238aafca8092dfc?s=200&d=mp&r=x' );
      
    const classes = useStyles();

      const docUserID = auth.currentUser.uid;

      /* console.log(photoURL)
      console.log(docUserID) */

      function LinearProgressWithLabel(props) {
        return (
          <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
              <Typography variant="body2" color="textSecondary">{`${Math.round(
                props.value,
              )}%`}</Typography>
            </Box>
          </Box>
        );
      }

      const onSubmit = (values, { setFieldError }) => {
        db.collection('users').doc(docUserID).update(
          {
            firstName: values.nombre,
            lastName: values.apellido,
            photoURL: imgUserUrl 
          }
        ).then( () => {
            auth.currentUser.updateProfile({
              photoURL: imgUserUrl
            })
            setUpdate(true); 
        }).catch((e) => {
          console.log('Error al guardar los datos')
          //HACER VISTA PARA ESTE ERROR
        })
      }

     const chooseFile = (e) => {
       var file = e.target.files[0];
       var storageRef = storage.ref('users/' + docUserID + '/profile.jpg');
       var task = storageRef.put(file);
       /* .then( () => {
         console.log("Imagen cargada exitosamente");
       }).catch( (e) => {
         console.log("Error al cargar la imagen");
       }) */

       task.on('state_changed', 
        function progress(snapshot){
          var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percentage)
        },
        function error(err) {
          console.log("Error mientras se cargaba la imagen")
        },
        function complete() {
          getUrlImage();
          setProgressFull(true);
        }
       );
     }

     const getUrlImage = () => {
      var storageRef = storage.ref('users/' + docUserID + '/profile.jpg');
      storageRef.getDownloadURL().then( imgUrl =>{
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
              <div><h1 className={classes.title}>EDITAR PERFIL</h1></div>

                <Avatar className={classes.avatar} src={imgUserUrl} />

                {/* <LinearProgressWithLabel className={classes.progress} value={progress} /> */}
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
                          startIcon={<CloudUploadIcon />}>
                          Subir imagen
                        </Button>
                      </label>
                <Formik
                  initialValues={{ nombre, apellido, mail }}
                  onSubmit={onSubmit}>
                  {({ dirty, isValid, errors, touched }) => (
                      <Form>                 
                      <FormikField className={classes.textField} label="Nombre" id="user-name" name="nombre" type="text"
                        fullWidth />

                      <FormikField className={classes.textField} label="Apellido" id="user-surname" name="apellido"
                        type="text" fullWidth />

                      {<Button className={classes.botonGuardar}
                        variant="contained"
                        color="primary"
                        type="submit">
                        Guardar
                      </Button>}
                      
                    </Form>                   
                  )}
                </Formik>
                {update ? (
                  <h2>Datos guardados!</h2>
                ):(
                  null
                )}                
            </Grid>
          </Grid>
        </div>
      )
}

export default EditProfile;