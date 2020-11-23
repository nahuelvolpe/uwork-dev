import { db, storage } from './firebase/setup'
import * as MateriasService from './MateriasService';


export const createUser = (credentials) => {
  const userId = credentials.user.uid;
  return db.collection('users').doc(userId).set({
    firstName: "",
    lastName: "",
    email: credentials.user.email,
    uid: credentials.user.uid,
    photoURL: credentials.user.photoURL ? credentials.user.photoURL : "",
    materias: {}
  })
}

export const createUserFromProfile = (credentials) => {
  const userId = credentials.user.uid;
  const profile = credentials.additionalUserInfo.profile
  return db.collection('users').doc(userId).set({
    firstName: profile.given_name,
    lastName: profile.family_name,
    email: profile.email,
    uid: userId,
    photoURL: profile.picture,
    materias: {}
  })
}

export const updateUser = async (id, values) => {
  const userData = await getUserDataById(id)
  return db.collection('users').doc(id).set(
    {
      firstName: values.nombre ? values.nombre : userData.firstName,
      lastName: values.apellido ? values.apellido : userData.lastName,
      photoURL: values.userImg ? values.userImg : userData.photoURL,
      materias: values.materias ? values.materias : userData.materias
    }, { merge: true }
  )
}

export const getUserByEmail = (email) => {
  return db.collection('users').where('email', '==', email).get();
}

export const getUserData = (id) => {
  const url = '/users/' + id
  return db.doc(url).get()
}

export const uploadUserFile = (referencePath, file, errorFn, completeFn) => {
  const reference = storage.ref(referencePath)
  const uploadTask = reference.put(file)
  uploadTask.on('state_changed', null, errorFn, completeFn)
}

export const getUserDetail = async (userId) => {
  let userDetails;
  const userDoc = await db.collection('users').doc(userId).get()

  if (!userDoc.exists) {
      throw Error('El usuario no existe');
  }
  userDetails = {
      firstName: userDoc.data().firstName,
      lastName: userDoc.data().lastName,
      id: userDoc.data().uid,
      photoURL: userDoc.data().photoURL,
      materias: userDoc.data().materias
  }
  return userDetails;
}

export const getUserDataById = async (id) => {
  const doc = await db.collection('users').doc(id).get()
  if (doc.exists) {
    return doc.data()
  } else {
    throw new Error('El usuario no existe')
  }
}

export const getUserSubjects = async (id) => {
  let user
  try {
    user = await getUserDataById(id)
  } catch (err) {
    throw new Error(err)
  }

  return user.materias;
}

export const existSubject = async (subject, career, userID) => {
  const userMaterias = await MateriasService.getSubjects(userID)
  let exist = false;
  userMaterias.forEach(materia => {
    if (materia.nombre === subject && materia.carrera === career) {
      exist = true;
    }
  })

  return exist;
}




