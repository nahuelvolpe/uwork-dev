import { Grid, Paper, makeStyles, Avatar } from '@material-ui/core';
import { AvatarGroup } from "@material-ui/lab"
import { AddAlarmOutlined } from '@material-ui/icons';
import React, {useEffect, useState} from 'react';
import AuthenticationService from '../../services/AuthenticationService';
import { auth, db } from '../../services/firebase';
import UserService from '../../services/UserService';


const useStyles = makeStyles((theme) => ({
    materiaContent: {
        padding: '5px 5px 5px 5px',
        display: "flex",
        //alignItems: "center",
        maxWidth: 500,
        maxHeight: 100,
        //borderRadius: '26px'
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

        const user = await db.doc('/users/' + userID).get();
        const userMaterias = user.data().materias;
        let userMateriasDetail = [];
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
                <button onClick={crearMateria}>CREAR MATERIA</button>
                <Grid container style={{ minHeight: "100vh" }}>

                        {materias.map( (materia) => {
                            return (<Grid
                                container
                                item
                                xs={12}
                                sm={6}
                                alignItems="center"
                                direction="column"
                                justify="center"
                                key={materia.materiaId}
                            >
                            <Paper className={classes.materia} elevation={3}>
                                <p>{materia.nombre}</p>
                                <p>{materia.carrera}</p>
                                {/* <AvatarGroup max={4}>
                                    {
                                    materia.roles.map( (user) => {
                                        return (<Avatar key={materia.materiaId} src={user.photoURL} />)
                                      })
                                    }          
                                </AvatarGroup> */}
                            </Paper>

                        </Grid>)
                        })   
                    }                
                </Grid>
                
                
                
        </>
    );
}

export default Dashboard;