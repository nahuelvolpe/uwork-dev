import React, { useState, useContext } from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'
import Task from './Task';
import * as TaskService from '../../services/TaskService';
import { SubjectContext } from '../../context/subject';

const useStyles = makeStyles((theme) => ({
    textTarea: {
        fontSize: '1.4rem',
        fontStyle: 'bold',
        color: 'black'
    },
    cardContent: {
        marginTop: theme.spacing(1),
        backgroundColor: 'white'
        
    },
    descripcion: {
        marginBottom: 0,
        color: 'black'
    },
    cardActions: {
        marginTop: 0
    }
}))

const CardTask = (props) => {
    const classes = useStyles()
    const { data, acceptTaskHandler, index } = props
    const [open, setOpen] = useState(false)
    const { subjectId } = useContext(SubjectContext)

    const handleView = () => {
        setOpen(true);
    }

    const acceptDelete = () => {
        TaskService.deleteTask(data.tareaId, subjectId)
            .then(() => {
                console.log('tarea eliminada')
                window.location.reload()
            }).catch((e) => {
                console.log(e)
            })
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

    return (
        <div>
            <Card className={classes.cardContent}>
                <CardContent>
                    <Typography className={classes.textTarea} variant="h5" component="h2">
                        {data.titulo}
                    </Typography>
                    <Typography className={classes.descripcion}>
                        {`Fecha límite: ${data.fechaLimite}`}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Button size="small" onClick={handleView}>VER</Button>
                    <Button size="small" onClick={handleFinished}>FINALIZAR</Button>
                    <Button size="small" onClick={acceptDelete}>ELIMINAR</Button>
                </CardActions>
            </Card>
            {open && <Task
                open={open}
                data={data}
                index={index}
                acceptHandler={acceptTaskHandler}
                />}
        </div>
    )
}

export default CardTask;