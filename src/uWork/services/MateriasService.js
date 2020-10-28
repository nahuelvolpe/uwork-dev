import { db } from './firebase'
import firebase from 'firebase';


export const deleteMateriaAdmin = async (materiaId, user) => {
    let userRef = db.collection('users').doc(user);
    let subjectRef = db.collection('materias').doc(materiaId);

    let dataMaterias = await subjectRef.get()
    const roles = dataMaterias.data().roles;
    
    Object.keys(roles).forEach( (userid) => {
        userRef.set({
            roles: {
                [userid]: firebase.firestore.FieldValue.delete(),
            }       
        }, {merge: true})
        .then(()=>{console.log('usuario eliminado:' + userid)})
        .catch((e) => {console.log(e)})
    })
    
    const response = db.collection('materias').doc(materiaId).delete()

    return response;
} 

export const exitMateria = async (materiaId, user) => {
    //eliminar materia desde el usuario
    //eliminar usuario desde materia
}

//NO USARLA, SOLO DE PRUEBA
export const eliminarMateria = async (materiaId, user) => {
    let userRef = db.collection('users').doc(user);
    const response = db.collection('materias').doc(materiaId).delete()
        .then(() => {
            return userRef.set({
                    materias: {
                        [materiaId]: firebase.firestore.FieldValue.delete()
                    }   
            }, {merge: true})
        })
    return response;
}

export const deleteCollabMateria = async (userId, materiaId) => {
    let subjectRef = db.collection('materias').doc(materiaId);
    let userRef =  db.collection('user').doc(userId);

    const response = userRef.set({
        materias: {
            [materiaId]: firebase.firestore.FieldValue.delete()
        }
    }, {merge: true}).then(() => {
        return subjectRef.set({
            roles: {
                [userId]: firebase.firestore.FieldValue.delete()
            }
        }, {merge: true})
    })
    
    return response;  
}