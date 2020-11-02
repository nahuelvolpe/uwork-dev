import { db } from './firebase/setup'
import firebase from 'firebase';
import * as MateriasService from './MateriasService';


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

export const getTasks = async (materiaId) => {
    let result = []
    const tareas = await MateriasService.getSubjectTasks(materiaId)
    for (const id in tareas) {
        const doc = await db.doc(`/tareas/${id}`).get()
        if (doc.exists) {
            const docData = doc.data()
            result.push({
                tareaId: id,
                titulo: docData.titulo,
                descripcion: docData.descripcion,
                colaboradores: docData.colaboradores,
                fechaLimite: docData.fechaLimite,
            });
        }
    }
    return result
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