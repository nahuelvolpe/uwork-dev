import React, {useContext, useEffect, useState} from 'react'
import { Redirect, useParams } from 'react-router-dom'
import PropTypes from 'prop-types';
import { Grid, IconButton, makeStyles, Paper, AppBar, Tabs, Tab, Box, Button, Hidden, Tooltip } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert'
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import PostAddIcon from '@material-ui/icons/PostAdd';
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Close from '@material-ui/icons/Close'
import Invite from './Invite';
import { SubjectContext } from '../../context/subject';
import * as MateriasService from '../../services/MateriasService'
import * as TaskService from '../../services/TaskService'
import CustomizedSnackbars from '../CustomSnackBar/CustomSnackBar'
import CardTask from '../Task/CardTask';
import Task from '../Task/Task';
import moment from 'moment'
import AlertTaskDialog from './AlertTaskDialog'
import LinealLoading from '../LoadingPage/LinealLoading'

const useStyles = makeStyles((theme) => ({   
    floatingButtons: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'fixed',
        right: 0,
        bottom: 0,
        marginRight: 8,
        marginBottom: 8
    },
    floatingButtonAddTask: {
        color: 'white',
        backgroundColor: theme.palette.success.main
    },
    floatingButtonInvite: {
        color: 'white',
        marginBottom: '8px',
        backgroundColor: theme.palette.primary.dark
    },
    info: {
        margin: '5px 5px 5px 5px',
        padding: '5px 5px 5px 10px',
        fontSize: '13px',
        fontWeight: 'bold',
        backgroundColor: '#F5F5F5',
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    container: {
        marginTop: '5px',
        padding: '10px',
    },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    sizeSmallPadding: {
        padding: 8
    }
}));

export function TabPanel(props) {
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
    const [pendientes, setPendientes] = useState([]);
    const [finalizadas, setFinalizadas] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [tareaId, setTareaId] = useState('')
    const [cantColabs, setCantColabs] = useState(0)
    const [value, setValue] = useState(0)
    const [showInfo, setShowInfo] = useState(true)
    const [loading, setLoading] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [guide, setGuide] = useState(false)

    const [openSuccessBar, setOpenSuccessBar] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        let mounted = true
        async function setSubjectData() {
            setLoading(true)
            try {
                const materia = await MateriasService.getSubjectById(materiaId)
                if(mounted) {
                    setLink(materia.link)
                    setSubjectName(materia.nombre)
                    setSubjectId(materiaId)
                }
            } catch (err) {
                if (mounted) {
                    setNotFound(true)
                }
            }
        }
        async function cargarTareas() {
            let tasksSubject = []
            try {
                tasksSubject = await TaskService.getTasks(materiaId)
                if(mounted) {
                    if(tasksSubject.length < 1){
                        setGuide(true);
                        setLoading(false)
                    }else{
                        tasksSubject.forEach( (task) => {
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
                        setLoading(false)
                    }
                    
                }
            } catch(err) {
                if (mounted) {
                    setNotFound(true)
                }
            }
        }
        setSubjectData()
        cargarTareas()

        return () => mounted = false
    }, [materiaId, setSubjectId, setSubjectName])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    }

    const handleClickOpenInvite = () => {
        setOpenInvite(true);
    }

    const handleClickOpenTask = async () => {
        if (openTask) {
            await setOpenTask(false)
        }
        setOpenTask(true);
    }

    const handleCloseSnackBarSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSuccessBar(false);
    }

    const onTaskDelete = (taskId) => {
        setMessage('La tarea ha sido eliminada correctamente')
        setOpenSuccessBar(true)
        setPendientes(prevState => prevState.filter(e => e.tareaId !== taskId))
    }

    const handleDelete = (taskId, colaboradores) => {
        setTareaId(taskId)
        setCantColabs(colaboradores)
        setOpenAlert(true)
    }

    const handleFinished = (tareaId, subjectId) => {
        TaskService.finishedTask(tareaId, subjectId)
            .then(() => {
                let tareaPendiente = pendientes.filter(e => e.tareaId === tareaId)
                tareaPendiente[0].estado = 'finalizada';
                setPendientes(prevState => prevState.filter(e => e.tareaId !== tareaId))
                setFinalizadas(prevState =>
                    [...prevState, tareaPendiente[0]]
                )
                setMessage('La tarea se ha cambiado a la lista de tareas finalizadas.')
                setOpenSuccessBar(true)
            }).catch((e) => {
                console.log(e)
            })
    }

    const handlePendiente = (tareaId, subjectId) => {
        TaskService.pendienteTask(tareaId, subjectId)
            .then(() => {
                let tareaFinalizada = finalizadas.filter(e => e.tareaId === tareaId)
                tareaFinalizada[0].estado = 'pendiente';
                setFinalizadas(prevState => prevState.filter(e => e.tareaId !== tareaId))
                setPendientes(prevState =>
                    [...prevState, tareaFinalizada[0]]
                )
                setMessage('La tarea se ha cambiado a la lista de tareas pendiente.')
                setOpenSuccessBar(true)
            }).catch((e) => {
                console.log(e)
            })
    }

    const onCreationSuccess = (id, task, index) => {
        if (index === undefined) {
            setGuide(false);
            setMessage('Tarea creada con éxito!')
            setOpenSuccessBar(true)
            setPendientes(prevState =>
                [...prevState, { tareaId: id, titulo: task.titulo, descripcion: task.descripcion, colaboradores: task.colaboradores, fechaLimite: moment(task.fechaLimite.toDate()).format('L'), estado: task.estado }]
            )
        } else {
            setMessage('Tarea editada con éxito!')
            setOpenSuccessBar(true)
            const newPendientes = pendientes.slice()
            newPendientes[index] = { tareaId: task.tareaId, titulo: task.titulo, descripcion: task.descripcion, colaboradores: task.aCargo, fechaLimite: moment(task.fechaLimite).format('L'), estado: task.estado }
            setPendientes(newPendientes)
        }
    }

    const onSuccessInvitation = () => {
        setMessage('Invitación enviada!')
        setOpenSuccessBar(true)
    }

    const closeLinkInfo = () => {
        setShowInfo(false)
    }

    if(notFound) {
        return (<Redirect to="/404"></Redirect>)
    }

    return (
        <>
            {openInvite && <Invite 
                open={openInvite}
                setOpen={setOpenInvite}
                materiaId={materiaId}
                successHandler={onSuccessInvitation}
            />}
            {openTask && <Task
                open={openTask}
                setOpen={setOpenTask}
                acceptHandler={onCreationSuccess}
            />}
            {openAlert && <AlertTaskDialog
                open={openAlert}
                setOpen={setOpenAlert}
                taskId={tareaId}
                subjectId={materiaId}
                cantColaboradores={cantColabs}
                acceptHandler={onTaskDelete}
            />}
            { loading ?
                <LinealLoading>Cargando sus tareas...</LinealLoading>
            : <>{showInfo && <Paper xs={12} sm={6} md={4} className={classes.info} variant="outlined" >
                <p>Para encontrar apuntes, exámenes, trabajos prácticos y más información sobre esta materia, ingresá al <a href={link} style={{textDecoration: 'none'}} rel="noopener noreferrer" target="_blank">foro de la UNO</a></p>
                <Close onClick={closeLinkInfo}/>
            </Paper>}
            <Hidden smDown>
                <div style={{ width: '100%', marginBottom: 8, marginLeft: 4, marginTop: showInfo ? 8 : 16}}>
                    <Button style={{ color: 'white' }} variant="contained" startIcon={<AddCircleIcon />} color="secondary" label="Agregar Tarea" onClick={handleClickOpenTask}>Agregar Tarea</Button>
                    <Button style={{marginLeft: 8}} variant="outlined" startIcon={<PersonAddIcon />} color="primary" label="Añadir Colaborador" onClick={handleClickOpenInvite}>Añadir colaborador</Button>
                </div>
            </Hidden>
            <AppBar position="static" style={{marginTop: showInfo ? 0 : 16}}>
                <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="simple tabs example">
                    <Tab label="Tareas pendientes" {...a11yProps(0)} />
                    <Tab label="Tareas finalizadas" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Grid container spacing={1}>
                    {guide &&
                            <>
                                <Hidden smDown>
                                    <Alert id="guide-alert" severity="info">No tenés tareas pendientes! Para agregar una tarea hacé click en el botón "+ AGREGAR TAREA" de arriba a la izquierda</Alert>
                                </Hidden>
                                <Hidden mdUp>
                                    <Alert id="guide-alert" severity="info">No tenés tareas pendientes! Para agregar una tarea hacé click en el botón <PostAddIcon /> de abajo a la derecha</Alert>
                                </Hidden>
                            </>
                            
                    }
                    {pendientes && pendientes.map((task, index) =>
                        <Grid item xs={12} sm={6} md={4}  key={task.tareaId}>
                            <CardTask data={task} history={props.history} acceptTaskHandler={onCreationSuccess} deleteHandler={handleDelete} finishedHandler={handleFinished} index={index}/>
                        </Grid>
                        )
                    }
                </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Grid container spacing={1}>
                    {finalizadas && finalizadas.map((task, index) =>
                        <Grid item xs={12} sm={6} md={4}  key={task.tareaId}>
                            <CardTask data={task} history={props.history} acceptTaskHandler={onCreationSuccess} deleteHandler={handleDelete} pendienteHandler={handlePendiente} index={index}/>
                        </Grid>
                        )
                    }
                </Grid>
            </TabPanel>
            <Hidden mdUp>
                <div className={classes.floatingButtons}>
                    <Tooltip classes={{ tooltip: classes.tooltip }} placement="left" title="Invitar Colaborador" label="Add Colab" enterTouchDelay={400}>
                        <IconButton
                            className={classes.floatingButtonInvite}
                            arial-label="Agregar colaborador"
                            onClick={handleClickOpenInvite}
                            size="small"
                            classes={{
                                sizeSmall: classes.sizeSmallPadding
                            }}
                        >
                            <PersonAddIcon style={{ fontSize: "24px" }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip classes={{ tooltip: classes.tooltip }} placement="left" title="Agregar Tarea" label="Add Tarea" enterTouchDelay={400}>
                        <IconButton variant="contained"
                            arial-label="Agregar tarea"
                            className={classes.floatingButtonAddTask}
                            onClick={handleClickOpenTask}>
                            <PostAddIcon style={{ fontSize: "28px" }} />
                        </IconButton>
                    </Tooltip>
                </div>
            </Hidden></>
            }
            <CustomizedSnackbars open={openSuccessBar} handleClose={handleCloseSnackBarSuccess} severity="success">
                {message}
            </CustomizedSnackbars>
        </>      
    );
}

export default Subject;
