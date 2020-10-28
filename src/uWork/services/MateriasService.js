import { db } from './firebase'
import firebase from 'firebase';


export const deleteMateria = async (materiaId, user) => {
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
