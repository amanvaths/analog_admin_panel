import * as firebase from "firebase/app"
import { history } from "../../../history"
import "firebase/auth"
import "firebase/database"
import axios from "axios"
import { config } from "../../../authServices/firebase/firebaseConfig"
import { NotificationManager } from "react-notifications";
import {  BaseURLAPI, postAPICall, sendMobileOTP } from "../../helpers/api_functions"

// Init firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

let firebaseAuth = firebase.auth()
// const url = 'https://api.bitflash.io/api';
// const url = 'http://localhost:5000/api';
const url = BaseURLAPI;
// const initAuth0 = new auth0.WebAuth(configAuth)
function N_userLogin(email, password) {
  // console.log("N_login: ", email, password);
  return fetch(`${url}/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },body: JSON.stringify({
      email: email,
      password: password,
    }),
  })
    .then((d) => d.json())
    .catch((e) => e);
}
function N_resendOTP(user_id) {
  return fetch(`${url}/resend-otp`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({ user_id: user_id }),
  })
    .then((res) => res.json())
    .catch((e) => e);
}
export const userLogout = () => {
  console.log("LOGOUT_WITH_NODE");
  return (dispatch) => {
    dispatch({ type: "LOGOUT_WITH_NODE" ,data:{}});
  };
}

export const userLogin = (email, password, mobile_otp) => {
  
  return (dispatch) => {
    N_userLogin(email, password)
      .then((res) => {
        if (res.status === 200 && res.params.role >= 1) {
          if(res.params.role == 1){
            dispatch({ type: "CHANGE_ROLE", userRole: 'editor' })
          }
          if (res.params.ask_login_otp) {
            if(mobile_otp >= 4){
              const data = {
                  user_id : res.params.user_id,
                  otp : mobile_otp,
              }
              postAPICall('varifie/mobile',data).then((res2) => {
                if(res2.data.status === 200){
                  dispatch({ type: "AUTH_LOGIN", data: res });
                  history.push("/") 
                  if(res && res.params.role == 1){
                    document.location.reload();
                  }
                }else{
                  NotificationManager.error('OTP Not Match');
                }
              })
            } else if(res.params.mobile_no){
              sendMobileOTP(res.params.user_id,res.params.mobile_no)
              document.getElementById("askmobileotp").classList.remove("hidden")
            }else{
              NotificationManager.info('Mobile Number Not added');
            }
          } else if (!res.params.ev) {
            N_resendOTP(res.params.user_id).then((res1) => {
              let loggedInUser = {
                email: email, 
                user_id: res.params.user_id,
                params: res.params
              } 
              if (res1.status === 200) {
                dispatch({
                  type: "LOGIN_WITH_EMAIL",
                  payload: { loggedInUser, loggedInWith: "node" }
                });
                history.push("/")
                if(res && res.params.role == 1){
                  document.location.reload();
                }
              } else {
                NotificationManager.error(res.message);
              }
            });
          } else {
            dispatch({ type: "AUTH_LOGIN", data: res });
            history.push("/")
            if(res && res.params.role == 1){
              document.location.reload();
            }
          }
        } else {
          NotificationManager.error(res.message, "Error", 3000);
        }
      })
      .catch((e) => {
        console.log(e);
        NotificationManager.error(e.message);
      });
  };
}
export const submitLoginWithFireBase = (email, password, remember) => {
  return dispatch => {
    let userEmail = null,
      loggedIn = false
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        firebaseAuth.onAuthStateChanged(user => {
          result.user.updateProfile({
            displayName: "Admin"
          })
          let name = result.user.displayName
          if (user) {
            userEmail = user.email
            loggedIn = true
            dispatch({
              type: "LOGIN_WITH_EMAIL",
              payload: {
                email: userEmail,
                name,
                isSignedIn: loggedIn,
                loggedInWith: "firebase"
              }
            })
          }
          if (user && remember) {
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION)
              .then(() => {
                dispatch({
                  type: "LOGIN_WITH_EMAIL",
                  payload: {
                    email: userEmail,
                    name,
                    isSignedIn: loggedIn,
                    remember: true,
                    loggedInWith: "firebase"
                  }
                })
              })
          }
          history.push("/")
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
}

export const loginWithFB = () => {
  return dispatch => {
    let provider = new firebase.auth.FacebookAuthProvider()
    provider.setCustomParameters({
      display: "popup"
    })
    firebaseAuth
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        let token = result.credential.accessToken,
          // The signed-in user info.
          user = result.user.email
        dispatch({
          type: "LOGIN_WITH_FB",
          payload: {
            user,
            token,
            loggedInWith: "firebase"
          }
        })
        if (user) history.push("/")
      })
      .catch(error => {
        console.log(error)
      })
  }
}

export const loginWithTwitter = () => {
  return dispatch => {
    let provider = new firebase.auth.TwitterAuthProvider()
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.user.displayName,
          photoUrl = result.user.photoURL
        dispatch({
          type: "LOGIN_WITH_TWITTER",
          payload: {
            user,
            name,
            photoUrl,
            token,
            loggedInWith: "firebase"
          }
        })
        history.push("/")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

export const loginWithGoogle = () => {
  return dispatch => {
    let provider = new firebase.auth.GoogleAuthProvider()
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.user.displayName,
          photoUrl = result.user.photoURL
        dispatch({
          type: "LOGIN_WITH_GOOGLE",
          payload: {
            email: user,
            name: name,
            photoUrl,
            token,
            loggedInWith: "firebase"
          }
        })
        history.push("/")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

export const loginWithGithub = () => {
  return dispatch => {
    let provider = new firebase.auth.GithubAuthProvider()
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.additionalUserInfo.username,
          photoUrl = result.user.photoURL

        dispatch({
          type: "LOGIN_WITH_GITHUB",
          payload: {
            user,
            name,
            photoUrl,
            token,
            loggedInWith: "firebase"
          }
        })
        history.push("/")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

export const loginWithJWT = user => {
  return dispatch => {
    axios
      .post("/api/authenticate/login/user", {
        email: user.email,
        password: user.password
      })
      .then(response => {
        var loggedInUser

        if (response.data) {
          loggedInUser = response.data.user

          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt" }
          })

          history.push("/")
        }
      })
      .catch(err => console.log(err))
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_JWT", payload: {} })
    history.push("/pages/login")
  }
}
export const logoutWithNODE = () => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_NODE", data: {} })
    history.push("/pages/login")
  }
}

export const logoutWithFirebase = user => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_FIREBASE", payload: {} })
    history.push("/pages/login")
  }
}

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}
