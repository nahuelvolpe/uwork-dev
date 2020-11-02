import React, {useState} from 'react'
import {Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import { Formik, Form } from "formik";
import * as Yup from 'yup'
import FormikField from "../FormikField/FormikField";
import * as MateriasService from '../../services/MateriasService';
import { auth } from '../../services/firebase';

const RegisterSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email requerido!")
      .email("Formato inválido!"),
  })


const Invite = ({open, setOpen, materiaId}) => {

    const [email, setEmail] = useState('')
    const [openSuccessBar, setOpenSuccessBar] = useState(false)
    const [openErrorBar, setOpenErrorBar] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Error al enviar invitación.')

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
        console.log(email)
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
                <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button>
                <Button onClick={inviteUser} color="primary">
                    Enviar
                </Button>
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