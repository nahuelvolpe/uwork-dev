import React from 'react';
import { auth, db } from './firebase'

/* getUserDetail (UserId) {
  let UserDetails;

  db.collection('users').doc(UserId).get()
    .then( (userDoc) => {

      console.log(userDoc.data());

      UserDetails = {
        firstName: userDoc.data().firstName,
        lastName: userDoc.data().lastName,
        id: userDoc.data().lastName,
        photoURL: userDoc.data().photoURL
    }
    }).catch((e) => {
      console.log(e)
    })

    console.log(UserDetails)
  
    return UserDetails;
  } */

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


