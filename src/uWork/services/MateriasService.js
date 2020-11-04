import { db } from './firebase'
import firebase from 'firebase';
import * as UserService from './UserService'
import AuthenticationService from './AuthenticationService';

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
                nombre: docData.nombre,
                link: docData.link
            });
        }
    }
    return result
}

export const getSubjectById = async (subjectId) => {
    const doc = await db.collection('materias').doc(subjectId).get()
    if (doc.exists) {
        const data = doc.data()
        return {
            materiaId: subjectId,
            carrera: data.carrera,
            nombre: data.nombre,
            roles: data.roles,
            link: data.link,
            tareas: data.tareas
        }
    } else {
        throw new Error('El usuario no existe')
    }
}

export const createSubject = (subjectData, userId) => {
    return db.collection('materias').add({
        nombre: subjectData.subject,
        carrera: subjectData.career,
        roles: {
            [userId]: 'admin'
        },
        link: subjectData.link,
        tareas: {}
    })
}

export const getCollabsFromSubject = async (subjectId) => {
    let usuarios = []
    const subject = await getSubjectById(subjectId)
    const roles = Object.keys(subject.roles)
    usuarios = await db.collection('users').where('uid', 'in', roles).get()
    usuarios = usuarios.docs.map(x => {
        const u = x.data()
        u.rol = subject.roles[u.uid]
        return u
    })
    return usuarios
}

export const verifyAdmin = async (subjectId) => {
    const userId = AuthenticationService.getSessionUserId()
    const user = await UserService.getUserDataById(userId)
    let isAdmin
    Object.keys(user.materias).forEach(e => {
        if(e === subjectId && user.materias[e] === 'admin') {
            isAdmin = true
        }
    })
    return isAdmin
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

    return response; 
}

export const inviteUser = async (inviteEmail, subjectId) => {
    const user = await UserService.getUserByEmail(inviteEmail)
    if (user.docs) {
        const userData = user.docs[0].data()
        try {
            await UserService.updateUser(userData.uid, { materias: { [subjectId]: 'colaborador' } })
            await updateSubject(subjectId, { roles: { [userData.uid]: 'colaborador' } })
        } catch (err) {
            throw new Error(err)
        }
    }
}

export const updateSubject = async (subjectId, values) => {
    const subject = await getSubjectById(subjectId)
    return db.collection('materias').doc(subjectId).set(
        {
            roles: values.roles ? values.roles : subject.roles,
            tareas: values.tareas ? values.tareas : subject.tareas
        }, { merge: true }
    )
}

export const getSubjectTasks = async (materiaId) => {
    let materia
    try {
        materia = await getSubjectById(materiaId)
    } catch (err) {
      throw new Error(err)
    }
  
    return materia.tareas;
  }

  export const verificarColaboradores = async (email, subjectId) => {
    const usuarios = await getCollabsFromSubject(subjectId)
    let response = false;
    usuarios.map( (user) => {
        if(user.email === email){
            response = true
        }
    })
    return response
}