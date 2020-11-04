import React, {useState} from 'react';
import { useParams } from 'react-router-dom'
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'
import ViewTask from './ViewTask';
import * as TaskService from '../../services/TaskService';

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
    const { materiaId } = useParams();
    const { data, history } = props
    const [open, setOpen] = useState(false)


    const handleView = () => {
        setOpen(true);
    }

    const acceptDelete = () => {
        TaskService.deleteTask(data.tareaId, materiaId)
            .then(() => {
                console.log('tarea eliminada')
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
                        {data.fechaLimite}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Button size="small" onClick={handleView}>VER</Button>
                    <Button size="small" onClick={()=> { console.log("Editando la tarea") }}>EDITAR</Button>
                    <Button size="small" onClick={acceptDelete}>ELIMINAR</Button>
                </CardActions>
            </Card>
            <ViewTask
                open={open}
                setOpen={setOpen}
                data={data}
                subjectId={materiaId}
            />
        </div>
    )
}

export default CardTask;