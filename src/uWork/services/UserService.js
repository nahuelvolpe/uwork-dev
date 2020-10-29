import { auth, db } from './firebase'

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

export const updateUser = (values) => {
  const docUserID = auth.currentUser.uid;
  return db.collection('users').doc(docUserID).update(
    {
      firstName: values.nombre,
      lastName: values.apellido,
      photoURL: values.userImg
    }
  )
}

export const getUserByEmail = (email) => {
  return db.collection('users').where('email', '==', email).get();
}

export const getUserData = (id) => {
  const url = '/users/' + id
  return db.doc(url).get()
}

export const getUserDetail = async(UserId) => {
  let UserDetails;
  const userDoc = await db.collection('users').doc(UserId).get()

  if (userDoc === undefined) {
      throw Error('El usuario no existe');
  }

  UserDetails = {
      firstName: userDoc.data().firstName,
      lastName: userDoc.data().lastName,
      id: userDoc.data().lastName,
      photoURL: userDoc.data().photoURL
  }

  return UserDetails;
}

export const getUserMaterias = async (UserId) => {

  let UserDetails;

  const userDoc = await db.collection('users').doc(UserId).get()

  //console.log(userDoc.data());

  if (userDoc === undefined) {
    throw Error('El usuario no existe');
  }

  UserDetails = {
    firstName: userDoc.data().firstName,
    lastName: userDoc.data().lastName,
    id: userDoc.data().lastName,
    materias: userDoc.data().materias,
    photoURL: userDoc.data().photoURL
  }

  //console.log(UserDetails.materias)

  return UserDetails.materias;
}


