import React, { useState } from 'react';
import { Button, Grid, LinearProgress, Typography, Box, Avatar,  makeStyles } from "@material-ui/core";
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
      width: "50%",
      color: 'white'
    },
    botonImagen: {     
      marginTop: theme.spacing(1),
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
    const [imgUserUrl, setImgUserUrl] = useState('');


      const classes = useStyles();

      const docUserID = props.location.state.docUserID

      const currentUserID = auth.currentUser.uid;

      console.log(docUserID);
      console.log(currentUserID);

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
            lastName: values.apellido
          }
        ).then( () => {

            setUpdate(true);
         
        })
      }

     const chooseFile = (e) => {
       var file = e.target.files[0];

       var storageRef = storage.ref('users/' + currentUserID + '/profile.jpg');

       /* storageRef.put(file).then(() => {
         setUploader(true);
       }).catch( (e) => {
         console.log(e);
       }) */

       var task = storageRef.put(file);

       task.on('state_changed', 
        function progress(snapshot){
          var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(percentage)
        },
        function error(err) {

        },
        function complete() {
          getUrlImage();
          setProgressFull(true);
        }
       );
     }

     const getUrlImage = () => {
      var storageRef = storage.ref('users/' + currentUserID + '/profile.jpg');
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
                {progressFull ? (
                  <Avatar className={classes.avatar} src={imgUserUrl} />
                  ): (
                  <Avatar className={classes.avatar} >U</Avatar>
                )}
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

                      {/* <FormikField className={classes.textField} label="Correo Electrónico" id="user-mail" name="mail" 
                      type="text" fullWidth /> */}

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