import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, CardActions, Button, makeStyles } from '@material-ui/core'
import { auth, db } from '../../services/firebase';

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

const CardSubject = (props) => {
    const classes = useStyles()
    const { data, history } = props
    const materiaId = data.materiaId;
    const [admin, setAdmin] = useState(false)
    

    useEffect(() => {
        const verificarAdmin = async () => {
            const currentUserID = auth.currentUser.uid;
            const response = await db.collection('users').doc(currentUserID).get();
            const materias = response.data().materias;
            Object.keys(materias).forEach(e => {
                if(materias[e] === 'admin'){
                    if(e === materiaId){
                        //console.log('Es admin');
                        setAdmin(true);
                    }
                }
            })
        }
        verificarAdmin()
    }, [])


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
                    <Button size="small" onClick={ ()=> { history.push(`/subject/${materiaId}`) }}>INGRESAR</Button>
                    {admin ? 
                    <Button size="small" onClick={() => { props.deleteHandler(data.materiaId) }}>ELIMINAR</Button>
                    : <Button size="small" onClick={() => { props.exitHandler(data.materiaId) }}>SALIR</Button>
                    }              
                </CardActions>
            </Card>
        </div>
    )
}

export default CardSubject;

