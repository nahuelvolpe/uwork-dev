import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { Grid, IconButton, makeStyles, Button, Paper } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Invite from './Invite';
import { SubjectContext } from '../../context/subject';
import * as MateriasService from '../../services/MateriasService'
import * as TaskService from '../../services/TaskService'
import CardTask from '../Task/CardTask';
import Task from '../Task/Task';
import moment from 'moment'

const useStyles = makeStyles((theme) => ({
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
        right: 90,
        color: 'white',
        marginBottom: '12px',
        marginRight: '12px',
        backgroundColor: theme.palette.info.main
    },
    info: {
        margin: '5px',
        padding: '5px 5px 5px 10px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        backgroundColor: '#F5F5F5',
        width: '100%'
    },
    container: {
        marginTop: '5px',
        padding: '10px',

    }
}));

const Subject = (props) => {

    const classes = useStyles();
    const { materiaId } = useParams();
    const { setSubjectId, setSubjectName } = useContext(SubjectContext)
    const [link, setLink] = useState('')
    const [openInvite, setOpenInvite] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        async function setSubjectData() {
            const materia = await MateriasService.getSubjectById(materiaId)
            setLink(materia.link)
            setSubjectName(materia.nombre)
            setSubjectId(materiaId)
        }
        async function cargarTareas() {
            let tasksSubject = [];
            tasksSubject = await TaskService.getTasks(materiaId)
            setTasks(tasksSubject);
        }
        cargarTareas();
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
            .then(async (doc) => {
                let task = await doc.get()
                task = task.data()
                setTasks(prevState =>
                    [...prevState, { tareaId: doc.id, titulo: task.titulo, descripcion: task.descripcion, colaboradores: task.colaboradores, fechaLimite: moment(task.fechaLimite.toDate()).format('L') }]
                )
               /*  setTasks(prevTasks => [prevTasks, {task}]) */
            }).catch( (e) => {
                console.log(e)
            }) 
    }

    return (
        <>
            {openInvite && <Invite 
                open={openInvite}
                setOpen={setOpenInvite}
                materiaId={materiaId}
            />}
            {openTask && <Task
                open={openTask}
                setOpen={setOpenTask}
                acceptHandler={createTask}
            />}
            <Grid container className={classes.container} spacing={3}>
                <Paper xs={12} sm={6} md={4} className={classes.info} variant="outlined" >
                    <p>Link al foro donde podés encontrar apuntes, examenes, trabajos practicos y más información de la materia <a href={link}  target="_blank">{link}</a></p>
                </Paper>
                {tasks && tasks.map((task) =>
                    <Grid item xs={12} sm={6} md={4}  key={task.tareaId}>
                        <CardTask data={task} history={props.history} acceptTaskHandler={createTask}/>
                    </Grid>)
                }
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
