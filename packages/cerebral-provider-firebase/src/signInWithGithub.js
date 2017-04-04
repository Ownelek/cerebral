import firebase from 'firebase'
import {createUser} from './helpers'
import {FirebaseProviderAuthenticationError} from './errors'

export default function signInWithGithub (options) {
  const scopes = options.scopes || []
  const redirect = options.redirect || false
  const provider = new firebase.auth.GithubAuthProvider()

  scopes.forEach((scope) => {
    provider.addScope(scope)
  })

  return new Promise((resolve, reject) => {
    if (redirect) {
      firebase.auth().signInWithRedirect(provider)
      resolve()
    } else {
      firebase.auth().signInWithPopup(provider)
      .then(
        (result) => {
          const user = createUser(result.user)

          user.accessToken = result.credential.accessToken
          resolve({
            user: user
          })
        }, (error) => {
          reject(new FirebaseProviderAuthenticationError(error))
        })
    }
  })
}
