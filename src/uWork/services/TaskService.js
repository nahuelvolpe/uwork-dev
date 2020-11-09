import { db } from './firebase/setup'
import firebase from 'firebase';
import * as MateriasService from './MateriasService';
import moment from 'moment'


export const createTask = async (task, materiaId) => {
    const response = await db.collection('tareas').add({
        titulo: task.titulo,
        descripcion: task.descripcion,
        fechaLimite: task.fechaLimite,
        colaboradores: task.aCargo
    })
    await MateriasService.updateSubject(materiaId, { tareas: { [response.id]: 'pendiente' }})
    return response
}

export const updateTask = async (id, task) => {
    const taskData = await getTaskDataById(id)
    return await db.collection('tareas').doc(id).set({
        titulo: task.titulo ? task.titulo : taskData.titulo,
        descripcion: task.descripcion ? task.descripcion : taskData.descripcion,
        fechaLimite: task.fechaLimite ? task.fechaLimite : taskData.fechaLimite,
        colaboradores: task.aCargo ? task.aCargo : taskData.aCargo
    }, { merge: true })
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
                fechaLimite: moment(docData.fechaLimite.toDate()).format('L'),
            });
        }
    }
    return result
}

export const getTaskDataById = async (id) => {
    const doc = await db.collection('tareas').doc(id).get()
    if (doc.exists) {
        return doc.data()
    } else {
        throw new Error('La tarea no existe')
    }
}


export const deleteTask = async (taskId, materiaId) => {
    const subjectRef = db.collection('materias').doc(materiaId);

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