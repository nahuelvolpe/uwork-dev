import React, {useContext, useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Grid, IconButton, makeStyles, Button, Paper, AppBar, Tabs, Tab, Typography, Box } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import Invite from './Invite';
import { SubjectContext } from '../../context/subject';
import * as MateriasService from '../../services/MateriasService'
import * as TaskService from '../../services/TaskService'
import CardTask from '../Task/CardTask';
import Task from '../Task/Task';
import moment from 'moment'
import AlertTaskDialog from './AlertTaskDialog';

const useStyles = makeStyles((theme) => ({   
    floatingButtonInvite: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: '12px',
        marginRight: '8px',
        color: 'white',
        backgroundColor: theme.palette.primary.dark
    },
    floatingButtonAddTask: {
        position: 'fixed',
        bottom: 80,
        right: 0,
        color: 'white',
        marginRight: '8px',
        backgroundColor: theme.palette.primary.light
    },
    info: {
        margin: '5px',
        padding: '5px 5px 5px 10px',
        fontSize: '0.6rem',
        fontWeight: 'bold',
        backgroundColor: '#F5F5F5',
        width: '100%'
    },
    container: {
        marginTop: '5px',
        padding: '10px',

    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    appbar: {
    }
}));


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={2}>
            {children}
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const Subject = (props) => {
 
    const classes = useStyles();
    const { materiaId } = useParams();
    const { setSubjectId, setSubjectName } = useContext(SubjectContext)
    const [link, setLink] = useState('')
    const [openInvite, setOpenInvite] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [pendientes, setPendientes] = useState([]);
    const [finalizadas, setFinalizadas] = useState([]);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [tareaId, setTareaId] = useState('')
    const [cantColabs, setCantColabs] = useState(0)

    const [value, setValue] = React.useState(0);

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
            tasksSubject.map( (task) => {
                if(task.estado === 'pendiente'){
                    setPendientes(prevState =>
                        [...prevState, task]
                    )
                }else if(task.estado === 'finalizada'){
                    setFinalizadas(prevState =>
                        [...prevState, task]
                    )
                }
            })
            setTasks(tasksSubject);
        }
        cargarTareas();
        setSubjectData();
    }, [materiaId, setSubjectId, setSubjectName])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    };

    const handleClickOpenTask = async () => {
        if (openTask) {
            await setOpenTask(false)
        }
        setOpenTask(true);
    }

    const acceptDelete = (taskId, materiaId) => {
        console.log(taskId)
        console.log(materiaId)
        TaskService.deleteTask(taskId, materiaId)
        .then(() => {
            setTasks(prevState => prevState.filter(e => e.tareaId !== taskId))
        })
        .catch((e) => { console.log(e) })
    }

    const handleDelete = (taskId, colaboradores) => {
        setTareaId(taskId)
        setCantColabs(colaboradores)
        setOpenAlert(true)
    }

    const createTask = (task, isEdition, index) => {
        if (!isEdition) {
            TaskService.createTask(task, materiaId)
                .then(async (doc) => {
                    let task = await doc.get()
                    task = task.data()
                    setTasks(prevState =>
                        [...prevState, { tareaId: doc.id, titulo: task.titulo, descripcion: task.descripcion, colaboradores: task.colaboradores, fechaLimite: moment(task.fechaLimite.toDate()).format('L') }]
                    )
                    setPendientes(prevState =>
                        [...prevState, { tareaId: doc.id, titulo: task.titulo, descripcion: task.descripcion, colaboradores: task.colaboradores, fechaLimite: moment(task.fechaLimite.toDate()).format('L') }]
                    )
                }).catch( (e) => {
                    console.log(e)
                })
        } else {
            TaskService.updateTask(task.tareaId, task)
                .then(() => {
                    if (index !== undefined) {
                        const newTasks = tasks.slice() //copy the array
                        newTasks[index] = { tareaId: task.tareaId, titulo: task.titulo, descripcion: task.descripcion, colaboradores: task.aCargo, fechaLimite: moment(task.fechaLimite).format('L') } //execute the manipulations
                        setTasks(newTasks)
                    }
                })
                .catch(e => console.log(e))
        }
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
                <Paper xs={12} sm={6} md={4} className={classes.info} variant="outlined" >
                    <p>Link al foro donde podés encontrar apuntes, examenes, trabajos practicos y más información de la materia <a href={link}  target="_blank">{link}</a></p>
                </Paper>    
                    <AppBar position="static" className={classes.appbar}>
                        <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="simple tabs example">
                        <Tab label="Tareas pendientes" {...a11yProps(0)} />
                        <Tab label="Tareas finalizadas" {...a11yProps(1)} />
                        </Tabs>
                    </AppBar>
                    <TabPanel value={value} index={0}>
                    <Grid container spacing={1}>
                        {pendientes && pendientes.map((task) =>
                            <Grid item xs={12} sm={6} md={4}  key={task.tareaId}>
                                <CardTask data={task} history={props.history} acceptTaskHandler={createTask}/>
                            </Grid>
                            )
                        }
                     </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                    <Grid container spacing={1}>
                        {finalizadas && finalizadas.map((task) =>
                            <Grid item xs={12} sm={6} md={4}  key={task.tareaId}>
                                <CardTask data={task} history={props.history} acceptTaskHandler={createTask}/>
                            </Grid>
                            )
                        }
                     </Grid>
                    </TabPanel>
                        
                {/* tasks && tasks.map((task) =>
                    <Grid item xs={12} sm={6} md={4}  key={task.tareaId}>
                        <CardTask data={task} history={props.history} acceptTaskHandler={createTask} deleteHandler={handleDelete} index={index}/>
                    </Grid>)
                 */}

            


            <IconButton
                className={classes.floatingButtonInvite}
                arial-label="Agregar colaborador"
                onClick={handleClickOpenInvite}
            >
                <PersonAddIcon style={{ fontSize: "28px" }} />
            </IconButton>
            <IconButton variant="contained"
                    className={classes.floatingButtonAddTask}
                    onClick={handleClickOpenTask}>
                    <PostAddIcon style={{ fontSize: "28px" }} />
            </IconButton>
        </>      
    );
}

export default Subject;
