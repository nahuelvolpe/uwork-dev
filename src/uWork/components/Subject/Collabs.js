import React, {useParams, useEffect} from 'react';
import {Button, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { db } from '../../services/firebase';


const Collabs = ({openCollabs, setOpenCollabs}) => {

    /* const { materiaId } = useParams(); */

    const handleClose = () => {
        setOpenCollabs(false);
    };


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
            <Dialog open={openCollabs} onClose={handleClose} aria-labelledby="form-dialog-title">
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