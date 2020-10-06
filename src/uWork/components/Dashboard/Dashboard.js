import { Grid, Paper, makeStyles, Avatar, Card, CardActions, CardContent, Button, Typography} from '@material-ui/core';
import { AvatarGroup } from "@material-ui/lab"
import { AddAlarmOutlined } from '@material-ui/icons';
import React, {useEffect, useState} from 'react';
import AuthenticationService from '../../services/AuthenticationService';
import { auth, db } from '../../services/firebase';
import * as UserService from '../../services/UserService';


const useStyles = makeStyles((theme) => ({
    materiaContent: {
        marginTop: theme.spacing(2),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minWidth: 300,
        maxHeight: 100,
        background: '#30E3CA'
    },
    textMateria:{
        margin: '5px 5px',
        textAlign: "center",
        fontSize: '18px',
        fontStyle: 'bold'
    },
    cardContent:{
        marginTop: theme.spacing(2),
    },
    carrera:{
        marginBottom: 0
    }
    
  }));


const Dashboard = (props) => {

    const classes = useStyles();
    const userID = auth.currentUser.uid;

    const [materias, setMaterias] = useState([])
    const [userDetail, setUserDetail] = useState('');

    //obtener los datos de las materias del usuario
    useEffect(() => {
        AuthenticationService.authMiddleWare(props.history);
        cargarMaterias();
    }, [])


    //cargar materias
    async function cargarMaterias(){

        /* const user = await db.doc('/users/' + userID).get();
        const userMaterias = user.data().materias; */
        let userMaterias = [];
        let userMateriasDetail = [];
        userMaterias = await UserService.getUserMaterias(userID);
        
        for (const rol in userMaterias){
            const materiaDetail = await db.doc('/materias/' + rol).get()
            userMateriasDetail.push({
                materiaId: materiaDetail.id,
                carrera: materiaDetail.data().carrera,
                nombre: materiaDetail.data().nombre,
                roles: materiaDetail.data().roles
            });               
        }

        userMateriasDetail.map(materia => console.log(materia))
        setMaterias(userMateriasDetail); 
       
    }

    
    //crear nueva materia
    const crearMateria = () => {
        let usuarioDetalles = [];
           
        getUserDetail(userID)
        .then( (users) => { 

            console.log(users)          
            setUserDetail(users)

            return db.collection('materias')
                .add({
                nombre: 'Matematica Discreta',
                carrera: 'Licenciatura en Informática',
                roles: {
                    [userID]: {
                        rol: 'admin',
                        firstName: users.firstName,
                        lastName: users.lastName,
                        id: users.id,
                        photoURL: users.photoURL
                    }
                }
            })
        }).then((doc) => {
            console.log(doc);
            return db.collection('users').doc(userID).set(
                {
                    materias: {
                        [doc.id]: 'admin',
                    }
                }, 
                {merge: true}
            )
        }).then(() => {
            console.log("se cargo bien la materia en usuarios");
            window.location.reload()
        })          
        .catch( (e) => console.log(e)); 

        
            
    }

    
    async function getUserDetail (UserId) {
        let UserDetails;
        const userDoc = await db.collection('users').doc(UserId).get()
  
        if (userDoc === undefined){
          throw Error('El usuario no existe');
        } 
  
        UserDetails = {
          firstName: userDoc.data().firstName,
          lastName: userDoc.data().lastName,
          id: userDoc.data().lastName,
          photoURL: userDoc.data().photoURL
        }
        
        return UserDetails;
      }
 

    
    return (
        <>
                <Button variant="contained" color="secondary" onClick={crearMateria}>CREAR MATERIA</Button>
                <Grid container spacing={3} style={{ minHeight: "100vh" }}>
                         <Grid
                                container
                                item
                                xs={12}
                                sm={6}
                                alignItems="center"
                                direction="column"
                                justify="flex-start"
                            >

                        {materias.map( (materia) => {
                            return (
                                <Card className={classes.cardContent} key={materia.materiaId}>
                                    <CardContent>
                                        <Typography variant="h5" component="h2">
                                            {materia.nombre}
                                        </Typography>
                                        <Typography className={classes.carrera} color="textSecondary">
                                            {materia.carrera}
                                        </Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small">INGRESAR</Button>
                                        <Button size="small" >ELIMINAR</Button>
                                    </CardActions>
                                </Card>
                            

                        )
                        })   
                    }
                    </Grid>                
                </Grid>
                
                
                
        </>
    );
}

export default Dashboard;