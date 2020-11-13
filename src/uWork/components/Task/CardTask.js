import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, Typography, CardActions,
    makeStyles, Avatar, Box, CardActionArea, IconButton,
    Tooltip, Chip } from '@material-ui/core'
import { VisibilityRounded, Delete, CheckCircle, Timer, TimerOff, Undo } from '@material-ui/icons'
import AvatarGroup from '@material-ui/lab/AvatarGroup'
import Task from './Task';
import * as TaskService from '../../services/TaskService';
import { SubjectContext } from '../../context/subject';
import moment from 'moment'
import 'moment/locale/es-mx'
moment().locale('es-mx')

const useStyles = makeStyles((theme) => ({
    textTarea: {
        fontSize: '1.4rem',
        fontStyle: 'bold',
        color: 'black'
    },
    cardContent: {
        paddingTop: '4px',
        paddingBottom: '4px'        
    },
    descripcion: {
        marginBottom: 0,
        color: 'black'
    },
    actionArea: {
        padding: '4px'
    },
    actionButtons: {
        marginLeft: theme.spacing(1),
        padding: 0,
        color: 'black'
    },
    tooltip: {
        marginTop: 0,
    },
    finalizarButton: {
        color: 'green'
    },
    chipOutline: {
        border: '2px solid rgb(59 128 4)',
        backgroundColor: '#abf76e'
    },
    chipLabel: {
        color: 'rgb(59 128 4)',
        fontWeight: 'bold'
    },
    chipOutlineExpired: {
        border: '2px solid rgb(152 8 8)',
        backgroundColor: '#ff7e7d'
    },
    chipLabelExpired: {
        color: 'rgb(152 8 8)',
        fontWeight: 'bold'
    }
}))

const CardTask = (props) => {
    const classes = useStyles()
    const { data, acceptTaskHandler, deleteHandler, index } = props
    const [open, setOpen] = useState(false)
    const { subjectId } = useContext(SubjectContext)

    useEffect(() => {
        setOpen(false)
        return () => setOpen(false);
    }, [])

    const handleView = async () => {
        if (open) {
            await setOpen(false)
        }
        setOpen(true);
    }

    const handleFinished = () => {
        TaskService.finishedTask(data.tareaId, subjectId)
            .then(() => {
                console.log('tarea finalizada')
                window.location.reload()
            }).catch((e) => {
                console.log(e)
            })
    }

    const handlePendiente = () => {
        TaskService.pendienteTask(data.tareaId, subjectId)
            .then(() => {
                console.log('tarea pendiente')
                window.location.reload()
            }).catch((e) => {
                console.log(e)
            })
    }

    return (
        <>
            <Card>
                <CardActionArea onClick={handleView}>
                    <CardContent className={classes.cardContent}>
                        <Box display="flex" flexDirection="row" alignItems="center">
                            <Box flexGrow={1} style={{width: '50%'}}>
                                <Typography className={classes.textTarea} noWrap variant="h6" component="h2" align="left">
                                    {data.titulo}
                                </Typography>
                            </Box>
                            <AvatarGroup max={3}>
                                {
                                    Object.keys(data.colaboradores).map(id => {
                                        return <Avatar key={id} alt={data.colaboradores[id].name} src={data.colaboradores[id].photoURL} />
                                    })
                                }
                            </AvatarGroup>
                        </Box>
                    </CardContent>
                </CardActionArea>
                <CardActions disableSpacing className={classes.actionArea}>
                    <Tooltip classes={{tooltip: classes.tooltip}} title="Ver" enterTouchDelay={400}>
                        <IconButton className={classes.actionButtons} onClick={handleView}>
                            <VisibilityRounded fontSize="large" />
                        </IconButton>
                    </Tooltip>
                    {
                        data.estado === 'pendiente' ?
                            <>
                                <Tooltip classes={{tooltip: classes.tooltip}} title="Finalizar" enterTouchDelay={400}>
                                    <IconButton className={`${classes.actionButtons} ${classes.finalizarButton}`} onClick={handleFinished}>
                                        <CheckCircle fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip classes={{tooltip: classes.tooltip}} title="Eliminar" enterTouchDelay={400}>
                                    <IconButton className={classes.actionButtons} onClick={() => {deleteHandler(data.tareaId, Object.keys(data.colaboradores).length)}}>
                                        <Delete fontSize="large" color="error" />
                                    </IconButton>
                                </Tooltip>
                            </>
                            :   <Tooltip classes={{tooltip: classes.tooltip}} title="Volver a pendiente" enterTouchDelay={400}>
                                    <IconButton className={classes.actionButtons} onClick={handlePendiente}>
                                        <Undo fontSize="large" />
                                    </IconButton>
                                </Tooltip>
                    }
                    {(moment().isBefore(moment(data.fechaLimite, 'DD-MM-YYYY'))) ?
                        <Chip classes={{
                                outlined: classes.chipOutline,
                                root: classes.chipLabel}}
                            variant="outlined"
                            label={data.fechaLimite}
                            icon={<Timer />} />
                    : <Chip classes={{
                                outlined: classes.chipOutlineExpired,
                                root: classes.chipLabelExpired}}
                            variant="outlined"
                            label={data.fechaLimite}
                            icon={<TimerOff />} />}
                </CardActions>
            </Card>
            {open && <Task
                open={open}
                setOpen={setOpen}
                data={data}
                index={index}
                acceptHandler={acceptTaskHandler}
                />}
        </>
    )
}

export default CardTask;