import React, {useState} from 'react'
import {Button, TextField, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import * as MateriasService from '../../services/MateriasService';


const Invite = ({open, setOpen, materiaId}) => {

    const [email, setEmail] = useState('')
    const [openSuccessBar, setOpenSuccessBar] = useState(false)
    const [openErrorBar, setOpenErrorBar] = useState(false)

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

    const inviteUser = () => {
        MateriasService.inviteUser(email, materiaId)
            .then(() => {
                setOpenSuccessBar(true)
            })
            .catch(() => {
                setOpenErrorBar(true)
            })
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
                    Error al enviar invitación.
                </CustomizedSnackbars>
            </Dialog>
        </div>
    );
}

export default Invite;