import React, {useState} from 'react'
import {Button, TextField} from '@material-ui/core';
import { db} from '../../services/firebase/setup';

const Tasks = (props) => {

    const [email, setEmail] = useState('');

    const materiaId = props.location.state.materiaId;
    console.log(materiaId)

    const handleChange = (event) => {
        setEmail(event.target.value);
    };

    //buscar usuario con ese email
    const searchUser = () => {
        var usersRef = db.collection("users");

        var query = usersRef.where("email", "==", email);

        query.get()
            .then(function(querySnapshot) {
                let userid = '';
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    userid = doc.id;
                    //console.log(doc.id, " => ", doc.data());
                });
                return userid;
            }).then(userID => {

                return db.collection('users').doc(userID).set(
                    {
                        materias: {
                            [materiaId]: 'colaborador',
                        }
                    },
                    { merge: true }
                )
            })
            .catch(function(error) {
            console.log("Error getting documents: ", error);
            });
    
    }
    //agregar la materia a ese usuario

    return (
        <>
            <h1>Invitar colaboradores</h1>
            <form noValidate autoComplete="off">
                <TextField id="outlined-basic" label="Outlined" variant="outlined" value={email} onChange={handleChange} />
                <Button variant="contained" color="primary" onClick={searchUser}>
                    Enviar invitación
                </Button>
            </form>
            
        </>      
     );
}
 
export default Tasks;
