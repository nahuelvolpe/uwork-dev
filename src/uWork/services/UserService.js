import { auth, db } from './firebase'

export const updateUser = (values, img) => {
  const docUserID = auth.currentUser.uid;
  return db.collection('users').doc(docUserID).update(
    {
      firstName: values.nombre,
      lastName: values.apellido,
      photoURL: img
    }
  )
}

export const getUserData = (id) => {
  const url = '/users/' + id
  return db.doc(url).get()
}