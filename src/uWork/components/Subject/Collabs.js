import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Button, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { db } from '../../services/firebase';

const Collabs = ({open, setOpenColabs}) => {


    //const {materiaId} = useParams();

    const handleClick = () => {
        //setOpenSnack(true);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        //setOpenSnack(false);
    };

    const handleClose = () => {
        open = false;
    };

    const handleChange = (event) => {
        //setEmail(event.target.value);
    }; 

    const handleListItemClick = (event) => {}
    //buscar los ids de usuarios de la materia
    useEffect(() => {
        /* cargarUsuarios(); */
    }, [])

    /* const cargarUsuarios = async () => {
        const usuarios = await db.collection('materias').doc(materiaId).get();
        console.log(usuarios)
    } */
    //mostrarlos


    return ( 
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Colaboradores</DialogTitle>
                <DialogContent>
                <DialogContentText>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button>
                </DialogActions>
            </Dialog>
        </div>
     );
}

export default Collabs;