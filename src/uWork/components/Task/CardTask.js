import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'

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
    const { data, history } = props
    console.log('pepe')
    console.log(data)

    return (
        <div>
            <Card className={classes.cardContent}>
                <CardContent>
                    <Typography className={classes.textTarea} variant="h5" component="h2">
                        {data.titulo}
                    </Typography>
                    <Typography className={classes.descripcion}>
                        {'Fecha limite: 11/10/2020'}
                    </Typography>
                </CardContent>
                <CardActions className={classes.cardActions}>
                    <Button size="small" onClick={()=> { console.log("Ingresando a la tarea") }}>VER</Button>
                    <Button size="small" onClick={()=> { console.log("Editando la tarea") }}>EDITAR</Button>
                    <Button size="small" onClick={()=> { console.log("Eliminando la tarea, sólo si sos ADMIN") }}>ELIMINAR</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default CardTask;