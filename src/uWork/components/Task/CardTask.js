import React, {useState} from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'
import Task from './Task';

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
    const { data, acceptTaskHandler, history } = props
    const [open, setOpen] = useState(false)

    const handleView = () => {
        setOpen(true);
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
                    {/* <Button size="small" onClick={()=> { console.log("Editando la tarea") }}>EDITAR</Button> */}
                    <Button size="small" onClick={()=> { console.log("Eliminando la tarea, sólo si sos ADMIN") }}>ELIMINAR</Button>
                </CardActions>
            </Card>
            {open && <Task
                open={open}
                setOpen={setOpen}
                data={data}
                acceptHandler={acceptTaskHandler}
                isView
                />}
        </div>
    )
}

export default CardTask;