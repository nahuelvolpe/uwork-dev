import React, {useState} from 'react'
import {Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, makeStyles } from '@material-ui/core';
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import { Formik, Form } from "formik";
import * as Yup from 'yup'
import FormikField from "../FormikField/FormikField";
import * as MateriasService from '../../services/MateriasService';
import { auth } from '../../services/firebase';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email requerido!")
      .email("Formato inválido!"),
  })

  const useStyles = makeStyles((theme) => ({
    botonAccept: {
        color: 'white'
      },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
      }
  }))

const Invite = ({open, setOpen, materiaId}) => {

    const [email, setEmail] = useState('')
    const [openSuccessBar, setOpenSuccessBar] = useState(false)
    const [openErrorBar, setOpenErrorBar] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Error al enviar invitación.')
    const classes = useStyles();

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const handleCloseSnackBarSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessBar(false);
        setOpen(false)
    };
    
    const handleCloseSnackBarError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenErrorBar(false);
    };

    const inviteUser = async () => {
        const response = await verificarEmail()
        if(response){
            setOpenErrorBar(true)
        }else{
            MateriasService.inviteUser(email, materiaId)
            .then(() => {
                setOpenSuccessBar(true)
            })
            .catch(() => {
                setErrorMessage('Error al enviar invitación, quizas esté mal escrito el email.')
                setOpenErrorBar(true)
            })
        }
       
    }

    const verificarEmail = async () => {
        let respuesta = false;
        const response = await MateriasService.verificarColaboradores(email, materiaId)
        if(auth.currentUser.email === email){
            setErrorMessage('No te puedes invitar a ti mismo!')
            respuesta = true;
        }else if(response){
            setErrorMessage('Este colaborador ya se encuentra en la materia!')
            respuesta = true;
        }
        return respuesta;
    }

    return ( 
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Invitar colaborador</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Escribe el email de la persona que quieres invitar. 
                    <strong> No se le enviara un email a esa persona, si no que se le agregara automáticamente esta materia en su cuenta.</strong>
                </DialogContentText>
                <TextField
                    required
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email"
                    type="email"
                    fullWidth
                    value={email} 
                    onChange={handleChange} 
                />
                </DialogContent>
                <DialogActions>
                <Button className={classes.botonAccept} onClick={inviteUser} variant="contained" color="secondary">
                    Enviar
                </Button>
                {/* <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button> */}
                <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
                </DialogActions>
                <CustomizedSnackbars open={openSuccessBar} handleClose={handleCloseSnackBarSuccess} severity="success">
                    Invitación enviada!
                </CustomizedSnackbars>
                <CustomizedSnackbars open={openErrorBar} handleClose={handleCloseSnackBarError} severity="error">
                    {errorMessage}
                </CustomizedSnackbars>
            </Dialog>
        </div>
    );
}

export default Invite;