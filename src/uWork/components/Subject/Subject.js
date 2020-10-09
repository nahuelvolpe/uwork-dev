import React from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    textMateria: {
        /*margin: '5px 5px',
        textAlign: "center",
        fontSize: '18px',
        fontStyle: 'bold',*/
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
    const { data } = props
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
                    <Button size="small">INGRESAR</Button>
                    <Button size="small" onClick={() => { props.deleteHander(data.materiaId) }}>ELIMINAR</Button>
                </CardActions>
            </Card>
        </div>
    )
}

export default Subject;

