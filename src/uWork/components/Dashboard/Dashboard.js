import React, { Fragment, useEffect, useState } from 'react'

import { Grid, makeStyles, IconButton, Hidden, Button, Tooltip } from '@material-ui/core'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import AddSubject from './AddSubject'
import CardSubject from '../Subject/CardSubject'
import AlertDialog from './AlertDialog'
import Alert from '@material-ui/lab/Alert'
import LinealLoading from '../LoadingPage/LinealLoading'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'

import * as MateriasService from '../../services/MateriasService'
import AuthenticationService from '../../services/AuthenticationService'


const useStyles = makeStyles((theme) => ({
    materiaContent: {
        marginTop: theme.spacing(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 300,
        maxHeight: 100,
        background: '#30E3CA'
    },
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: '0px',
        marginRight: '0px',
        color: theme.palette.primary.main,
        backgroundColor: 'white',
        padding: 0,
        '&:hover': {
            backgroundColor: 'white'
        }
    },
    tooltip: {
        marginRight: 4,
    }
}));

const Dashboard = (props) => {

    const classes = useStyles();
    const userId = AuthenticationService.getSessionUserId();

    const [materias, setMaterias] = useState([])
    const [materiaId, setMateriaId] = useState('')
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [openAlert, setOpenAlert] = React.useState(false)
    const [guide, setGuide] = useState(false)
    const [creationSuccess, setCreationSuccess] = useState(false)
    const [creationFailed, setCreationFailed] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [deleteFailed, setDeleteFailed] = useState(false)

    //obtener los datos de las materias del usuario
    useEffect(() => {
        //cargar materias
        async function cargarMaterias() {
            setLoading(true)
            let userMaterias = [];
            userMaterias = await MateriasService.getSubjects(userId)
            setMaterias(userMaterias);
            if(userMaterias.length < 1){
                setGuide(true);
            }
            setLoading(false)
        }
        cargarMaterias()
    }, [userId])

    const acceptDelete = (materiaId) => {
        setDeleteSuccess(true)
        setMaterias(prevState => prevState.filter(e => e.materiaId !== materiaId))
    }

    const onDeleteError = () => {
        setDeleteFailed(true)
    }

    const handleDelete = (materiaId) => {
        setMateriaId(materiaId)
        setOpenAlert(true)
    }
    
    const handleExit = (materiaId) => {
        MateriasService.exitMateria(materiaId, userId)
            .then(() => {
                setMaterias(prevState => prevState.filter(e => e.materiaId !== materiaId))
            })
            .catch((e) => { console.log(e) })
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCloseSnackSuccess = () => {
        setCreationSuccess(false)
        setDeleteSuccess(false)
    }
    
    const handleCloseSnackError = () => {
        setCreationFailed(false)
        setDeleteFailed(false)
    }

    const onCreationSuccess = (newSubject) => {
        setGuide(false)
        setCreationSuccess(true)
        setMaterias(prevState =>
            [...prevState, { materiaId: newSubject.materiaId, carrera: newSubject.carrera, nombre: newSubject.nombre }]
        )
    }

    const onCreationFailed = () => {
        setCreationFailed(true)
    }

    return (
        <div>
            {
                loading ?
                <Fragment> 
                    <LinealLoading>Cargando sus materias...</LinealLoading>
                </Fragment> : 
                <Fragment>
                    {guide && 
                    <Alert severity="info">¡Usted no tiene materias asignadas! Para agregar su primer materia haga click en el botón '+' de abajo a la derecha</Alert>
                    }
                    {open && <AddSubject
                        open={open}
                        setOpen={setOpen}
                        acceptHandler={onCreationSuccess}
                        errorHandler={onCreationFailed}
                    />}
                    {openAlert && <AlertDialog
                        open={openAlert}
                        setOpen={setOpenAlert}
                        subjectId={materiaId}
                        acceptHandler={acceptDelete}
                        errorHandler={onDeleteError}
                    />}
                    <Grid container>
                        <Hidden smDown>
                            <div style={{ width: '100%', marginTop: 16, marginLeft: 8 }}>
                                <Button variant="outlined" startIcon={<AddCircleIcon/>} onClick={handleClickOpen}>Agregar Materia</Button>
                            </div>
                        </Hidden>
                        {materias && materias.map((materia) => 
                            <Grid item xs={12} sm={6} md={4} key={materia.materiaId} style={{ padding: '0px 8px 8px 0px' }}>
                                <CardSubject data={materia} deleteHandler={handleDelete} exitHandler={handleExit} history={props.history}/>
                            </Grid>)
                        }
                        <Hidden mdUp>
                            <Tooltip classes={{tooltip: classes.tooltip}} placement="left" title="Agregar Materia" enterTouchDelay={400}>
                                <IconButton
                                    className={classes.floatingButton}
                                    arial-label="Add"
                                    onClick={handleClickOpen}
                                >
                                    <AddCircleIcon style={{ fontSize: "50px" }} />
                                </IconButton>
                            </Tooltip>
                        </Hidden>
                    </Grid>
                    <CustomizedSnackbars open={creationSuccess} handleClose={handleCloseSnackSuccess} severity="success">
                        Materia creada exitosamente!
                    </CustomizedSnackbars>
                    <CustomizedSnackbars open={creationFailed} handleClose={handleCloseSnackError} severity="error">
                        Error al crear materia.
                    </CustomizedSnackbars>
                    <CustomizedSnackbars open={deleteSuccess} handleClose={handleCloseSnackSuccess} severity="success">
                        Materia eliminada con éxito!
                    </CustomizedSnackbars>
                    <CustomizedSnackbars open={deleteFailed} handleClose={handleCloseSnackError} severity="error">
                        Error al eliminar materia.
                    </CustomizedSnackbars>
                </Fragment>
                }
        </div>
    )
}

export default Dashboard;