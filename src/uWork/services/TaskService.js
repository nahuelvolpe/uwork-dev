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
        })
    })

    return response;
}