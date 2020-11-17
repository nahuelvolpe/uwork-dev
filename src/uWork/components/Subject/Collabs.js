import React, { useEffect, useState, useContext} from 'react'
import {makeStyles, IconButton ,Button, Dialog, DialogTitle, DialogActions, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import * as MateriasService from '../../services/MateriasService'
import { SubjectContext } from '../../context/subject'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import LinealLoading from '../LoadingPage/LinealLoading'

const useStyles = makeStyles((theme) => ({
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: '5px'
    },
}));

const Collabs = ({open, setOpen}) => {

    const classes = useStyles();
    const [users, setUsers] = useState([]);
    const [admin, setAdmin] = useState(false);
    const [openSuccessBar, setOpenSuccessBar] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const { subjectId } = useContext(SubjectContext)

    const handleCloseCollabs = () => {
        setOpen(!open)
    };

    useEffect(() => {
        const cargarUsuarios = async () => {
            setLoading(true)
            if(subjectId) {
                const users = await MateriasService.getCollabsFromSubject(subjectId)
                setUsers(users)
                setLoading(false)
            }
        }
        const verificarAdmin = async () => {
            const isAdmin = await MateriasService.verifyAdmin(subjectId)
            setAdmin(isAdmin)
        }
        cargarUsuarios()
        verificarAdmin()
    }, [subjectId])

    const handleDeleteCollab = (userId) => {
        MateriasService.deleteCollabMateria(userId, subjectId)
        .then( () => {
            setUsers(prevState => prevState.filter(x => x.uid !== userId))
            setOpenSuccessBar(true)
        }).catch( (e) => {
            setError(true)
        })
    }

    const handleDialogClick = e => {
        e.stopPropagation();
    };

    const handleCloseSnackBarSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessBar(false);
    };
    
    const handleCloseSnackBarError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setError(false);
    };

    return ( 
        <div>
            <Dialog open={open} onClose={handleCloseCollabs} onClick={handleDialogClick} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Colaboradores</DialogTitle>
                {loading ? <LinealLoading height="30vh" width="50%">Cargando colaboradores...</LinealLoading> :
                <List>
                    {users && users.map((user) => (
                        <ListItem key={user.uid}>
                            <ListItemAvatar>
                                <Avatar src={user.photoURL} className={classes.large}/>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={`${user.firstName} ${user.lastName}`} 
                                secondary={user.rol}
                            />
                            <ListItemSecondaryAction>
                                {user.rol === 'colaborador' ? 
                                    <IconButton onClick={() => { handleDeleteCollab(user.uid) }} edge="end" aria-label="delete" disabled={!admin}>
                                        <ClearIcon />
                                    </IconButton>
                                :
                                    null
                                }                                
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>}
                <DialogActions>
                <Button onClick={handleCloseCollabs} color="primary">
                    Cerrar
                </Button>
                </DialogActions>
            </Dialog>
            <CustomizedSnackbars open={openSuccessBar} handleClose={handleCloseSnackBarSuccess} severity="success">
                Colaborador eliminado
            </CustomizedSnackbars>
            <CustomizedSnackbars open={error} handleClose={handleCloseSnackBarError} severity="error">
                Error al eliminar colaborador
            </CustomizedSnackbars>
        </div>
    );
}

export default Collabs;