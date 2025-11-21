// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";//6
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  import { 
    getAuth, 
    signOut,
    signInWithPopup, 
    GoogleAuthProvider 
  } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";//5

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCWuR1EeefTapQE2qQpoYzaz7R7KwYLnwU",
    authDomain: "gcw-cyberrun.firebaseapp.com",
    databaseURL: "https://gcw-cyberrun-default-rtdb.firebaseio.com",
    projectId: "gcw-cyberrun",
    storageBucket: "gcw-cyberrun.firebasestorage.app",
    messagingSenderId: "674852434984",
    appId: "1:674852434984:web:c920345a5d5c7f0875311d"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const btnLogin = document. getElementById("btn-login");
  const btnLogout = document. getElementById("btn-logout");

async function login(){
  await signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });

}

btnLogin.addEventListener("click", async() =>{
  await login();
});
btnLogout.addEventListener("click", async() =>{
  await signOut(auth).then(() => {
  console.log('sign-out sucessful');
}).catch((error) => {
  console.log('An error happened');
});
});
