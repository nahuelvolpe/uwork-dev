import { db, storage } from './firebase/setup'

export const createTask = async (values, materiaId) => {
    subjectRef = db.collection('materias').doc(materiaId);

    const response = await db.collection('tareas').add({
        titulo: values.titulo,
        descripcion: values.descripcion,
        fechaLimite: values.fechaLimite,
        colaboradores: values.colaboradores
    }).then((doc) => {
        return subjectRef.set({
            tareas: {
                [doc.id]: 'pendiente'
            }
        }, {merge: true})
    })

    return response;
}


export const deleteTask = async (taskId, materiaId) => {
    subjectRef = db.collection('materias').doc(materiaId);
    taskRef = db.collection('tareas').doc(taskId);

    const response = await db.collection('tareas').doc(taskId).delete()
        .then(() => {
            return subjectRef.set({
                tareas: {
                    [taskId]: firebase.firestore.FieldValue.delete()
                }
            }, {merge: true})
        })

    return response;
}