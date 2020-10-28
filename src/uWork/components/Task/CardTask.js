import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    textTarea: {
        fontSize: '1.4rem',
        fontStyle: 'bold',
        color: '#FFFFFF'
    },
    cardContent: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.info.main,
    },
    descripcion: {
        marginBottom: 0,
        color: '#FFFFFF'
    },
}))

const CardTask = (props) => {
    const classes = useStyles()
    const { data, history } = props

    return (
        <div>
            <Card className={classes.cardContent}>
                <CardContent>
                    <Typography className={classes.textTarea} variant="h5" component="h2">
                        TITULO
                    </Typography>
                    <Typography className={classes.descripcion}>
                        Descripcion
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={()=> { console.log("Ingresando a la tarea") }}>INGRESAR</Button>
                    <Button size="small" onClick={()=> { console.log("Editando la tarea") }}>EDITAR</Button>
                    <Button size="small" onClick={()=> { console.log("Eliminando la tarea, sólo si sos ADMIN") }}>ELIMINAR</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default CardTask;