import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import { getAuth, onAuthStateChanged, signOut } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDUDnEkZ5OjpnVzDL8OaPnKqYs4ESsR2x8",
  authDomain: "mlbbunimus.firebaseapp.com",
  projectId: "mlbbunimus",
  storageBucket: "mlbbunimus.firebasestorage.app",
  messagingSenderId: "121855150863",
  appId: "1:121855150863:web:91ca0b826068a819d54c7a"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ===== AUTH NAVBAR =====
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navAuth");

  onAuthStateChanged(auth, (user) => {
    console.log("User:", user);

    if (!nav) return;

    if (user) {
      nav.innerHTML = `
        <span>${user.email}</span>
        <button onclick="logout()">Logout</button>
      `;
    } else {
      nav.innerHTML = `
        <a href="login.html">Masuk</a>
        <a href="login.html">Daftar</a>
      `;
    }
  });
});

window.logout = function(){
  signOut(auth).then(() => {
    alert("Logout berhasil");
    location.reload();
  });
};

// ===== SEARCH HERO =====
window.searchHero = function () {
  let input = document.getElementById("searchHero").value.toLowerCase();
  let heroes = document.querySelectorAll(".hero-card");

  heroes.forEach(hero => {
    let name = hero.querySelector("h3").textContent.toLowerCase();
    hero.style.display = name.includes(input) ? "" : "none";
  });
};