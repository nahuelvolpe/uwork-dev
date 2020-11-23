import { db } from './firebase/setup'
import firebase from 'firebase';
import * as MateriasService from './MateriasService';
import moment from 'moment'
import 'moment/locale/es-mx'
moment.locale('es-mx')

export const createTask = async (task, materiaId) => {
    const response = await db.collection('tareas').add({
        titulo: task.titulo,
        descripcion: task.descripcion,
        fechaLimite: task.fechaLimite,
        colaboradores: task.aCargo,
        estado: 'pendiente'
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
        colaboradores: task.aCargo ? task.aCargo : taskData.aCargo,
        estado: task.estado ? task.estado : taskData.estado
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
                estado: docData.estado,
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

export const finishedTask = async (taskId, materiaId) => {
    const subjectRef = db.collection('materias').doc(materiaId);

    const response = await db.collection('tareas').doc(taskId).set({
        estado: 'finalizada'
    }, {merge: true})
        .then(() => {
            return subjectRef.set({
                tareas: {
                    [taskId]: 'finalizada'
                }
            }, {merge: true})
        })

    return response;
}

export const pendienteTask = async (taskId, materiaId) => {
    const subjectRef = db.collection('materias').doc(materiaId);

    const response = await db.collection('tareas').doc(taskId).set({
        estado: 'pendiente'
    }, {merge: true})
        .then(() => {
            return subjectRef.set({
                tareas: {
                    [taskId]: 'pendiente'
                }
            }, {merge: true})
        })

    return response;
}


