import { auth } from './firebase'

class AuthenticationService {

  login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

}

export default new AuthenticationService()