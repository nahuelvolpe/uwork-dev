import React, { useEffect, useState, useContext} from 'react';
import {useParams} from 'react-router-dom'
import {makeStyles, IconButton ,Button, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import MuiAlert from '@material-ui/lab/Alert';
import { auth, db } from '../../services/firebase';
import { deleteCollabMateria } from '../../services/MateriasService';
import { SubjectContext } from '../../context/subject';

const useStyles = makeStyles((theme) => ({
    large: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      marginRight: '5px'
    },
  }));


const Collabs = ({open, setOpenCollabs}) => {

    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    const { subjectId } = useContext(SubjectContext)

    const handleCloseCollabs = () => {
        open = false;
    };

    //buscar los ids de usuarios de la materia
    useEffect(() => {
        const cargarUsuarios = async () => {
            if(subjectId) {
                const response = await db.collection('materias').doc(subjectId).get();
                const roles = response.data().roles;
                let usuarios = [];
                Object.keys(roles).forEach(e => {
                    usuarios.push({
                        firstName: roles[e].firstName,
                        lastName: roles[e].lastName,
                        id: roles[e].id,
                        photoURL: roles[e].photoURL,
                        rol: roles[e].rol
                    })
                })
                setUsers(usuarios);
            }
        }
        const verificarAdmin = async () => {
            const currentUserID = auth.currentUser.uid;
            const response = await db.collection('users').doc(currentUserID).get();
            const materias = response.data().materias;
            Object.keys(materias).forEach(e => {
                if(materias[e] === 'admin'){
                    if(e === subjectId){
                       //console.log('Es admin');
                        setAdmin(true);
                    }
                }
            })
        }
        cargarUsuarios();
        verificarAdmin(); 
    }, [subjectId])

    const handleDeleteCollab = (userId) => {
        deleteCollabMateria(userId, subjectId)
        .then( () => {
            console.log("colaborador eliminado")
        }).catch( (e) => {
            console.log(e)
        })
    }

    return ( 
        <div>
            <Dialog open={open} onClose={handleCloseCollabs} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Colaboradores</DialogTitle>
                <List>
                    {users.map((user) => (
                        <ListItem key={user.uid}>
                            <ListItemAvatar>
                                <Avatar src={user.photoURL} className={classes.large}/>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={`${user.firstName} ${user.lastName}`} 
                                secondary={user.rol}
                            />
                            <ListItemSecondaryAction>
                                <IconButton onClick={() => { handleDeleteCollab(user.id) }} edge="end" aria-label="delete" disabled={!admin}>
                                    <ClearIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
                <DialogActions>
                <Button onClick={handleCloseCollabs} color="primary">
                    Cerrar
                </Button>
                </DialogActions>
            </Dialog>           
        </div>
    );
}

export default Collabs;