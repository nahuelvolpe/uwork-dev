import { Grid, Paper, makeStyles, Avatar, Card, CardActions, CardContent, Button, Typography, IconButton } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import React, { useEffect, useState } from 'react';
import AuthenticationService from '../../services/AuthenticationService';
import { auth, db } from '../../services/firebase';
import * as UserService from '../../services/UserService';
import * as MateriasService from '../../services/MateriasService';
import AddSubject from './AddSubject'
import Subject from '../Subject/Subject'

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
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0,
        marginBottom: '0px',
        marginRight: '0px',
        color: theme.palette.primary.main
    }

}));


const Dashboard = (props) => {

    const classes = useStyles();
    const userID = auth.currentUser.uid;

    const [materias, setMaterias] = useState([])
    const [userDetail, setUserDetail] = useState('');

    const [open, setOpen] = React.useState(false);
    const [carrera, setCarrera] = React.useState('');
    const [subject, setSubject] = React.useState('');


    //obtener los datos de las materias del usuario
    useEffect(() => {
        AuthenticationService.authMiddleWare(props.history);
        cargarMaterias();
    }, [])


    //cargar materias
    async function cargarMaterias() {

        /* const user = await db.doc('/users/' + userID).get();
        const userMaterias = user.data().materias; */
        let userMaterias = [];
        let userMateriasDetail = [];
        userMaterias = await UserService.getUserMaterias(userID);

        for (const rol in userMaterias) {
            const materiaDetail = await db.doc('/materias/' + rol).get()
            userMateriasDetail.push({
                materiaId: materiaDetail.id,
                carrera: materiaDetail.data().carrera,
                nombre: materiaDetail.data().nombre,
                roles: materiaDetail.data().roles
            });
        }

        //userMateriasDetail.map(materia => console.log(materia))
        setMaterias(userMateriasDetail);

    }


    const handleDelete = (materiaId) => {
        MateriasService.deleteMateria(materiaId, userID)
            .then(() => {
                console.log("materia eliminada");
                window.location.reload();
            })
            .catch((e) => { console.log(e) })
    }


    async function getUserDetail(UserId) {
        let UserDetails;
        const userDoc = await db.collection('users').doc(UserId).get()

        if (userDoc === undefined) {
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

    const handleClickOpen = () => {
        setOpen(true);
    };

    const createSubject = (subject) => {
        getUserDetail(userID)
            .then((users) => {
                setUserDetail(users)

                return db.collection('materias')
                    .add({
                        nombre: subject.subject,
                        carrera: subject.career,
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
                    { merge: true }
                )
            }).then(() => {
                console.log("se cargo bien la materia en usuarios");
                window.location.reload()
            })
            .catch((e) => console.log(e));
    }

    return (
        <div>
            <AddSubject
                open={open}
                setOpen={setOpen}
                acceptHandler={createSubject}
            />

            <Grid
                /* container
                alignItems="center"
                direction="column"
                justify="flex-start"
                style={{ paddingBottom: "1rem" }} */
                container spacing={3}
            >
                {materias && materias.map((materia) =>
                    <Grid item xs={12} sm={6} md={4} key={materia.materiaId}>
                        <Subject data={materia} deleteHandler={handleDelete} history={props.history}/>
                    </Grid>)
                }
                <IconButton
                    className={classes.floatingButton}
                    arial-label="Add"
                    onClick={handleClickOpen}
                >
                    <AddCircleIcon style={{ fontSize: "60px" }} />
                </IconButton>

            </Grid>
        </div>
    );
}

export default Dashboard;