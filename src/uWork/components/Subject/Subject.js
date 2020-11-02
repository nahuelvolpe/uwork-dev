import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { Grid, IconButton, makeStyles, Button } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Invite from './Invite';
import { SubjectContext } from '../../context/subject';
import * as MateriasService from '../../services/MateriasService'
import * as TaskService from '../../services/TaskService'
import AddTask from '../Task/AddTask';
import CardTask from '../Task/CardTask';

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
    floatingButtonInvite: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: '12px',
        marginRight: '12px',
        color: 'white',
        backgroundColor: theme.palette.primary.main
    },
    floatingButtonCollabs: {
        position: 'fixed',
        bottom: 0,
        left: 0,
        marginBottom: '12px',
        marginLeft: '12px',
        color: 'white',
        backgroundColor: theme.palette.primary.main
    },
    floatingButtonAddTask: {
        position: 'fixed',
        bottom: 10,
        right: 100,
        color: 'white',
        marginBottom: '12px',
        marginRight: '12px',
        backgroundColor: theme.palette.info.main
    }
}));

const Subject = () => {

    const { materiaId } = useParams();
    const { setSubjectId, setSubjectName } = useContext(SubjectContext)
    const classes = useStyles();
    const [openInvite, setOpenInvite] = useState(false);
    const [openTask, setOpenTask] = useState(false);

    useEffect(() => {
        async function setSubjectData() {
            const materia = await MateriasService.getSubjectById(materiaId)
            setSubjectName(materia.nombre)
            setSubjectId(materiaId)
        }
        setSubjectData()
    }, [materiaId, setSubjectId, setSubjectName])

    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    };

    const handleClickOpenTask = () => {
        setOpenTask(true);
    }

    const createTask = (task) => {
         TaskService.createTask(task, materiaId)
            .then(() => {
                console.log('tarea creada')
            }).catch( (e) => {
                console.log(e)
            }) 
    }



    return (
        <>
            <Invite 
                open={openInvite}
                setOpen={setOpenInvite}
                materiaId={materiaId}
            />
            <AddTask
                open={openTask}
                setOpen={setOpenTask}
                subjectId={materiaId}
                acceptHandler={createTask}
            />
            <Grid item xs={12} sm={6} md={4}>
                        <CardTask />
            </Grid>

            <IconButton
                className={classes.floatingButtonInvite}
                arial-label="Agregar colaborador"
                onClick={handleClickOpenInvite}
            >
                <PersonAddIcon style={{ fontSize: "40px" }} />
            </IconButton>
            <Button variant="contained"
                    className={classes.floatingButtonAddTask}
                    onClick={handleClickOpenTask}>
                    Agregar Tarea
            </Button>
        </>      
    );
}

export default Subject;
