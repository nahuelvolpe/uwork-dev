import React from 'react';
import { auth, db } from './firebase'



class UserService {



  getUserDetail (UserId) {
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
    }

    /* async getUserDetail (UserId) {
      let UserDetails;

      const userDoc = await db.collection('users').doc(UserId).get()
      
      console.log(userDoc.data());

      if (userDoc === undefined){
        throw Error('El usuario no existe');
      } 

      UserDetails = {
        firstName: userDoc.data().firstName,
        lastName: userDoc.data().lastName,
        id: userDoc.data().lastName,
        photoURL: userDoc.data().photoURL
      }

      console.log(UserDetails)
      
      return UserDetails;
    } */
        
    } 


export default new UserService()