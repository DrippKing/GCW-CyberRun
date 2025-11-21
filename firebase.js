
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

  import { getDatabase, 
    ref, 
    onValue,
    set 
  } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";


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
  const db = getDatabase();//instacnia BD

  const btnLogin = document. getElementById("btn-login");
  const btnLogout = document. getElementById("btn-logout");

  let currentUser;//usuario actaul

async function login(){
  await signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    currentUser  = result.user;
  writeUserData(currentUser.uid, 0, 0);
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

//leer
const starCountRef = ref(db, 'jugadores');//ej para adaptarse
//bd, a donde se dirgie
onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();//valores
 // updateStarCount(postElement, data);
 console.log(data);

 Object.entries(data).forEach(([key, value])=> {
console.log(`${key} ${value}`);// a 5,  b 7, c 9

const jugador=scene.getObjectByName(key);
if(!jugador){
    /*  const gltfLoader = new GLTFLoader();
      gltfLoader.load("Robot.glb", (gltf) => {
        const model = gltf.scene;
        model.scale.set(0.6, 0.6, 0.6);
        model.position.set(playerMesh.position.x, playerMesh.position.y - 1.1, playerMesh.position.z);
        model.rotation.y = Math.PI;
        scene.add(model);
        }*/
      }
  });
});


//escribir
function writeUserData(userId, positionX, positionZ) {
  //function writeUserData(userId, name, email, imageUrl) {
  set(ref(db, 'jugadores/' + userId), {
    x: positionX,
    z: positionZ,
  });
}
