import React, {useEffect, useState} from 'react';
import AuthenticationService from '../../services/AuthenticationService';
import { auth, db } from '../../services/firebase';

const Dashboard = (props) => {

    const userID = auth.currentUser.uid;

    const [materias, setMaterias] = useState('')
    const [titulo, setTitulo] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [materiaId, setMateriaId] = useState('')
    const [nuevaMateria, setNuevaMateria] = useState('');

    //obtener los datos de usuarios
    useEffect(() => {
        AuthenticationService.authMiddleWare(props.history);
        db.doc('/users/' + userID).get()
            .then((doc) => {
                console.log(doc.data());
            })
    }, [])

    //crear nueva materia
    const crearMateria = () => {
        db.collection('materias')
        .add(nuevaMateria)
            .then((doc) => {
                console.log(doc);
            })
            .catch((e) => {
                console.log(e);
            })
    }

    //eliminar una materia
    const eliminarMateia = () => {
        db.doc('/materias/' + materiaId)
            .delete()
            .then(() => {
                console.log("Materia elimianada")
            })
            .catch((e) => {
                console.log(e);
            })
    }


    
    return (
        <>
            <div>
                <p>MATERIAS...</p>
            </div>
        </>
    );
}

export default Dashboard;