import { auth } from './firebase'

class AuthenticationService {

  loginEmail(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  signupEmail(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

}

export default new AuthenticationService()