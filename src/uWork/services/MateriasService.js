import { db, auth } from './firebase'
import firebase from 'firebase';
import * as UserService from './UserService';


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
}


export const deleteCollabMateria = async (userId, materiaId) => {
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
}

export const updateUserDetail = async (values, userId) => {
    let userRef = db.collection('users').doc(userId);
    let dataUsers = await userRef.get()
    const materias = dataUsers.data().materias;

    if(Object.keys(materias).length === 0){
        return db.collection('users').doc(userId).set(
          {
            firstName: values.nombre,
            lastName: values.apellido,
            photoURL: values.userImg
          }, {merge: true}
        )        
    }else{
        const userMaterias = await UserService.getUserMaterias(userId)
        let response;

        for (const materiaId in userMaterias) {
            response = await db.collection('materias').doc(materiaId).set({
                roles: {
                    [userId]: {
                        firstName: values.nombre,
                        lastName: values.apellido,
                        photoURL: values.userImg
                    }
                }
            }, {merge: true})       
        }

        return db.collection('users').doc(userId).set(
            {
              firstName: values.nombre,
              lastName: values.apellido,
              photoURL: values.userImg
            }, {merge: true}
        )
    }


}