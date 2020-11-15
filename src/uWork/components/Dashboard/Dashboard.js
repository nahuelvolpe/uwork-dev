import { Grid, makeStyles, IconButton} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { useEffect, useState } from 'react';
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import * as UserService from '../../services/UserService';
import * as MateriasService from '../../services/MateriasService';
import AuthenticationService from '../../services/AuthenticationService'
import AddSubject from './AddSubject'
import CardSubject from '../Subject/CardSubject'
import AlertDialog from './AlertDialog';
import Alert from '@material-ui/lab/Alert'

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
        color: theme.palette.primary.main
    }

}));


const Dashboard = (props) => {

    const classes = useStyles();
    const userId = AuthenticationService.getSessionUserId();

    const [materias, setMaterias] = useState([])
    const [materiaId, setMateriaId] = useState('')

    const [open, setOpen] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [guide, setGuide] = useState(false);
    const [openErrorBar, setOpenErrorBar] = useState(false)
    const [errorMessage, setErrorMessage] = useState('Error al crear la materia, intentelo denuevo')

    //obtener los datos de las materias del usuario
    useEffect(() => {
        //cargar materias
        async function cargarMaterias() {
            let userMaterias = [];
            userMaterias = await MateriasService.getSubjects(userId)
            setMaterias(userMaterias);
            if(userMaterias.length < 1){
                setGuide(true);
            }
        }
        cargarMaterias();
    }, [userId])

    const handleCloseSnackBarError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenErrorBar(false);
    };

    const acceptDelete = (materiaId) => {
        MateriasService.deleteMateriaAdmin(materiaId, userId)
        .then(() => {
            setMaterias(prevState => prevState.filter(e => e.materiaId !== materiaId))
        })
        .catch((e) => { console.log(e) })
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

    const createSubject = async (subject) => {
        let exist = await UserService.existSubject(subject, userId)
        console.log(exist)
        if(!exist){
            MateriasService.createSubject(subject, userId)
            .then(async (doc) => {
                await UserService.updateUser(userId, { materias: { [doc.id]: 'admin' }})
                return MateriasService.getSubjectById(doc.id)
            })
            .then(newSubject => {
                setGuide(false);
                setMaterias(prevState =>
                    [...prevState, { materiaId: newSubject.materiaId, carrera: newSubject.carrera, nombre: newSubject.nombre }]
                )
            })
            .catch(err => {
                setErrorMessage('Error al crear la materia, intentelo denuevo')
                setOpenErrorBar(true);
            })
        }else{
            setErrorMessage('Esa materia ya existe.')
            setOpenErrorBar(true);
        }
        
    }


    return (
        <div>
            {guide && 
            <Alert severity="info">¡Usted no tiene materias asignadas!, para agregar su primer materia haga click en el botón + de abajo a la derecha</Alert>
            }
            {open && <AddSubject
                open={open}
                setOpen={setOpen}
                acceptHandler={createSubject}
            />}
            {openAlert && <AlertDialog
                open={openAlert}
                setOpen={setOpenAlert}
                subjectId={materiaId}
                acceptHandler={acceptDelete}
            />}
            <Grid container spacing={3}>
                {materias && materias.map((materia) => 
                    
                    <Grid item xs={12} sm={6} md={4} key={materia.materiaId}>
                        <CardSubject data={materia} deleteHandler={handleDelete} exitHandler={handleExit} history={props.history}/>
                    </Grid>)
                }
                <IconButton
                    className={classes.floatingButton}
                    arial-label="Add"
                    onClick={handleClickOpen}
                >
                    <AddCircleIcon style={{ fontSize: "35px" }} />
                </IconButton>
            </Grid>
            <CustomizedSnackbars open={openErrorBar} handleClose={handleCloseSnackBarError} severity="error">
                {errorMessage}
            </CustomizedSnackbars>
        </div>
    );
}

export default Dashboard;