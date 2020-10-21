import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    textMateria: {
        fontSize: '1.4rem',
        fontStyle: 'bold',
        color: '#FFFFFF'
    },
    cardContent: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.info.main,
    },
    carrera: {
        marginBottom: 0,
        color: '#FFFFFF'
    },
}))

const Subject = (props) => {
    const classes = useStyles()
    const { data, history } = props
    const materiaId = data.materiaId;
    console.log(materiaId)
    return (
        <div>
            <Card className={classes.cardContent} key={data.materiaId}>
                <CardContent>
                    <Typography className={classes.textMateria} variant="h5" component="h2">
                        {data.nombre}
                    </Typography>
                    <Typography className={classes.carrera}>
                        {data.carrera}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={ ()=> { history.push({pathname: '/tasks', state: { materiaId: materiaId } }) } }>INGRESAR</Button>
                    <Button size="small" onClick={() => { props.deleteHandler(data.materiaId) }}>ELIMINAR</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default Subject;

