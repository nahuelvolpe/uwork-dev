import { auth } from './setup'

export const watchUserChanges = (callback) => {
  return auth.onAuthStateChanged((user) => {
    if (user && !user.isAnonymous) {
      console.log("IS LOGGED IN")
      callback({
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL
      })
    } else {
      console.log("NOT LOGGED IN")
      callback(null)
    }
  })
}