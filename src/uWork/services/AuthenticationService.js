
import { auth } from './firebase'
class AuthenticationService {

  async loginEmail(email, password) {
    const loginResponse = await auth.signInWithEmailAndPassword(email, password)
    const token = await loginResponse.user.getIdToken()
    localStorage.setItem('AuthToken', `${token}`)
    return loginResponse
  }

  loginSocial(provider){
    return auth.signInWithPopup(provider)
  }

  signupEmail(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
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