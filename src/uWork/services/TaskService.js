import { db } from './firebase/setup'
import firebase from 'firebase';

export const createTask = async (task, materiaId) => {
    console.log(materiaId)
    const subjectRef = db.collection('materias').doc(materiaId);
    let dataMaterias = await subjectRef.get()
    console.log(dataMaterias.data())
    console.log(task)

    const response = await db.collection('tareas').add({
        titulo: task.titulo,
        descripcion: task.descripcion,
        fechaLimite: task.fechaLimite,
        colaboradores: task.colabCargo
    }).then((doc) => {
        console.log(doc.id)
        return subjectRef.set({
            tareas: {
                [doc.id]: 'pendiente'
            }
        }, {merge: true})
    })

    return response;
}


export const deleteTask = async (taskId, materiaId) => {
    const subjectRef = db.collection('materias').doc(materiaId);
    const taskRef = db.collection('tareas').doc(taskId);

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