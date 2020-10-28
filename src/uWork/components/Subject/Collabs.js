import React, { useEffect } from 'react';
import {Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';


const Collabs = ({open, subjectId}) => {

    const handleClose = () => {
        open = false;
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