import React, {useState} from 'react'
import {Button, TextField, Snackbar, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { db} from '../../services/firebase/setup';
import { getUserDetail } from '../../services/UserService';


const Invite = ({open, setOpen, materiaId}) => {

    const [email, setEmail] = useState('');
    const [, setUserDetail] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    let user_id;

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClick = () => {
        setOpenSnack(true);
    };

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
        return;
        }

        setOpenSnack(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    const inviteUser = () => {
        var usersRef = db.collection("users");

        //Busca el usuario con el email escrito
        var query = usersRef.where("email", "==", email);

        //Extrae el id de ese usuario
        query.get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    user_id = doc.id;
                });
                return user_id;
        //Agrega en el map 'materias' del usuario el id de la materia con su rol
            }).then(userID => {
                user_id = userID;
                return db.collection('users').doc(userID).set(
                    {
                        materias: {
                            [materiaId]: 'colaborador',
                        }
                    },
                    { merge: true }
                )
        //Cargar los detalles de usuarios
            }).then( () => {
                return getUserDetail(user_id)
        //Agrega a la materia correspodiente, el nuevo usuario
            }).then((users) => {
                setUserDetail(users)
                return db.collection('materias').doc(materiaId)
                    .set({
                        roles: {
                            [user_id]: {
                                rol: 'colaborador',
                                firstName: users.firstName,
                                lastName: users.lastName,
                                id: users.id,
                                photoURL: users.photoURL
                            }
                        }
                    }, {merge: true})
            }).then(() => {
                handleClick();
            })
            .catch(function(error) {                
                console.log("Error getting documents: ", error);
            });
    
    }

    return ( 
        <div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Invitar colaborador</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Escribe el email de la persona que quieres invitar.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email"
                    type="email"
                    fullWidth
                    value={email} 
                    onChange={handleChange} 
                />
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cerrar
                </Button>
                <Button onClick={inviteUser} color="primary">
                    Enviar
                </Button>
                </DialogActions>
                <Snackbar open={openSnack} autoHideDuration={4000} onClose={handleSnackClose}>
                    <Alert onClose={handleSnackClose} severity="success">
                    Invitación enviada correctamente!
                    </Alert>
                </Snackbar>
            </Dialog>
        </div>
     );
}
 
export default Invite;