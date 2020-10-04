
import { auth } from './firebase'



class AuthenticationService {

  loginEmail(email, password) {
     return auth.signInWithEmailAndPassword(email, password)
  }

  loginSocial(provider){
    return auth.signInWithPopup(provider)
  }

  signupEmail(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  logout() {
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