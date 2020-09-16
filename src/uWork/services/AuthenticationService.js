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

}

export default new AuthenticationService()