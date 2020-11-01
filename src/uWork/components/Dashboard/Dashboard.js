import { Grid, makeStyles, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { useEffect, useState } from 'react';
import * as UserService from '../../services/UserService';
import * as MateriasService from '../../services/MateriasService';
import AuthenticationService from '../../services/AuthenticationService'
import AddSubject from './AddSubject'
import CardSubject from '../Subject/CardSubject'

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

    const [open, setOpen] = React.useState(false);

    //obtener los datos de las materias del usuario
    useEffect(() => {
        //cargar materias
        async function cargarMaterias() {
            let userMaterias = [];
            userMaterias = await MateriasService.getSubjects(userId)
            setMaterias(userMaterias);
        }
        cargarMaterias();
    }, [userId])

    const handleDelete = (materiaId) => {
        MateriasService.deleteMateriaAdmin(materiaId, userId)
            .then(() => {
                setMaterias(prevState => prevState.filter(e => e.materiaId !== materiaId))
            })
            .catch((e) => { console.log(e) })
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
        MateriasService.createSubject(subject, userId)
        .then(async (doc) => {
            await UserService.updateUser(userId, { materias: { [doc.id]: 'admin' }})
            return MateriasService.getSubjectById(doc.id)
        })
        .then(newSubject => {
            setMaterias(prevState =>
                [...prevState, { materiaId: newSubject.materiaId, carrera: newSubject.carrera, nombre: newSubject.nombre }]
            )
        })
        .catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <AddSubject
                open={open}
                setOpen={setOpen}
                acceptHandler={createSubject}
            />
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
                    <AddCircleIcon style={{ fontSize: "60px" }} />
                </IconButton>
            </Grid>
        </div>
    );
}

export default Dashboard;