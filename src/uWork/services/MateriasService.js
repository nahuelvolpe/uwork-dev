import { db } from './firebase'
import firebase from 'firebase';
import * as UserService from './UserService'

export const getSubjects = async (userId) => {
    let result = []
    const materias = await UserService.getUserSubjects(userId)
    for (const id in materias) {
        const doc = await db.doc(`/materias/${id}`).get()
        if (doc.exists) {
            const docData = doc.data()
            result.push({
                materiaId: id,
                carrera: docData.carrera,
                nombre: docData.nombre
            });
        }
    }
    return result
}

export const createSubject = (subjectData, userDetails) => {
    return db.collection('materias').add({
        nombre: subjectData.subject,
        carrera: subjectData.career,
        roles: {
            [userDetails.id]: {
                rol: 'admin',
                firstName: userDetails.firstName,
                lastName: userDetails.lastName,
                id: userDetails.id,
                photoURL: userDetails.photoURL
            }
        }
    })
}

export const deleteMateriaAdmin = async (materiaId, user) => {
    let subjectRef = db.collection('materias').doc(materiaId);

    let dataMaterias = await subjectRef.get()
    const roles = dataMaterias.data().roles;

    Object.keys(roles).forEach( (userid) => {
        let userRef = db.collection('users').doc(userid);
        userRef.set({
            materias: {
                [materiaId]: firebase.firestore.FieldValue.delete(),
            }       
        }, {merge: true})
        .then(()=>{console.log('usuario eliminado:' + userid)})
        .catch((e) => {console.log(e)})
    })
    
    const response = db.collection('materias').doc(materiaId).delete()

    return response;
} 

export const exitMateria = async (materiaId, userId) => {
    //eliminar usuario desde materia
    let subjectRef = db.collection('materias').doc(materiaId);
    let userRef = db.collection('users').doc(userId);


    const response = subjectRef.set({
            roles: {
                [userId]: firebase.firestore.FieldValue.delete()
            }       
        }, {merge: true})
        .then(()=>{
            return userRef.set({
                materias: {
                    [materiaId]: firebase.firestore.FieldValue.delete()
                }
            }, {merge: true}) 
        })
        //.catch((e) => {console.log(e)})


    return response;

    //eliminar materia desde el usuario
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