import { auth } from './setup'

export const watchUserChanges = (callback) => {
  return auth.onAuthStateChanged((user) => {
    if (user) {
      callback({
        id: user.uid,
        email: user.email,
        displayName: user.displayName,
        avatar: user.photoURL
      })
    } else {
      callback(null)
    }
  })
}