import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUDnEkZ5OjpnVzDL8OaPnKqYs4ESsR2x8",
  authDomain: "mlbbunimus.firebaseapp.com",
  projectId: "mlbbunimus",
  storageBucket: "mlbbunimus.appspot.com",
  messagingSenderId: "121855150863",
  appId: "1:121855150863:web:91ca0b826068a819d54c7a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// LOGIN
window.login = function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login berhasil!");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
}

// REGISTER
window.register = function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => alert("Akun berhasil dibuat!"))
    .catch(err => alert(err.message));
}

// GOOGLE LOGIN
window.loginGoogle = function(){
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then(() => {
      alert("Login Google berhasil!");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
}