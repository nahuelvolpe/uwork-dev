
import { auth } from './firebase'
import * as UserService from './UserService'
class AuthenticationService {

  getSessionUserId() {
    return auth.currentUser.uid
  }

  getCurrentUser() {
    return auth.currentUser
  }

  updateProfilePhoto(photoUrl) {
    return auth.currentUser.updateProfile(
      {
        photoURL: photoUrl
      }
    )
  }

  async loginEmail(email, password) {
    const loginResponse = await auth.signInWithEmailAndPassword(email, password)
    const token = await loginResponse.user.getIdToken()
    localStorage.setItem('AuthToken', `${token}`)
    return loginResponse
  }

  async loginSocial(provider){
    const response = await auth.signInWithPopup(provider)
    const token = await response.user.getIdToken()
    if (response.additionalUserInfo.isNewUser) {
      try {
        await UserService.createUserFromProfile(response)
      } catch (error) {
        console.log(error)
        throw new Error("Error al registrarse.")
      }
    }
    localStorage.setItem('AuthToken', `${token}`)
    return
  }

  async register(email, password) {
    let credentials
    const user = await UserService.getUserByEmail(email)
    if (!user.docs.length) {
      credentials = await auth.createUserWithEmailAndPassword(email, password)
      const token = await credentials.user.getIdToken()
      try {
        await UserService.createUser(credentials)
        localStorage.setItem('AuthToken', `${token}`)
      } catch (error) {
        console.log(error)
        throw new Error("Error al registrarse.")
      }
    } else {
      throw new Error("Ya existe un usuario con este mail.")
    }
    return credentials;
  }

  logout() {
    localStorage.removeItem('AuthToken')
    return auth.signOut()
  }

  authMiddleWare(history){
    const authToken = localStorage.getItem('AuthToken');
    if(authToken === null){
      history.push('/login');
    }
  }
}

export default new AuthenticationService()