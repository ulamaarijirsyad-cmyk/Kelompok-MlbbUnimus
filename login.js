import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// 1. TAMBAHKAN updateProfile DI BAGIAN IMPORT
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, signOut } 
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

// ================= LOGIN =================
window.login = function(){
  // Ambil nilai dari HTML dengan aman (pakai tanda tanya '?' untuk menghindari error)
  const username = document.getElementById("username") ? document.getElementById("username").value : "";
  let email = document.getElementById("email") ? document.getElementById("email").value : "";
  const password = document.getElementById("password") ? document.getElementById("password").value : "";

  // Trik: Jika login hanya pakai Username (karena email tidak ada di layar)
  if (!email && username) {
     email = username.replace(/\s+/g, '').toLowerCase() + "@mlbbunimus.com";
  }

  // Jika username atau password kosong
  if (!email || !password) {
     alert("Silakan isi Username dan Password!");
     return;
  }

  // Proses login ke Firebase
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login berhasil! Mengalihkan ke Dashboard...");
      window.location.href = "index.html"; // Redirect ke Dashboard
    })
    .catch(err => {
      alert("Gagal Login: Username atau Password salah.");
      console.error(err);
    });
}

// ================= REGISTER =================
window.register = function(){
  // Ambil nilai dari HTML
  const username = document.getElementById("username") ? document.getElementById("username").value : "";
  let email = document.getElementById("email") ? document.getElementById("email").value : "";
  const password = document.getElementById("password") ? document.getElementById("password").value : "";

  // Validasi Wajib Isi
  if (!username) {
      alert("Nama User (Username) wajib diisi!");
      return;
  }
  if (!password) {
      alert("Password wajib diisi!");
      return;
  }
  
  // ATURAN FIREBASE: Password WAJIB minimal 6 karakter
  if (password.length < 6) {
      alert("Password terlalu pendek! Minimal harus 6 karakter.");
      return;
  }

  // Trik: Jika email kosong, buat email buatan otomatis dari username
  if (!email && username) {
     email = username.replace(/\s+/g, '').toLowerCase() + "@mlbbunimus.com";
  }

  // Proses Daftar ke Firebase
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      
      // Simpan Nama User
      updateProfile(userCredential.user, {
        displayName: username
      }).then(() => {
        
        // KARENA FIREBASE OTOMATIS LOGIN SETELAH DAFTAR, KITA KELUARKAN DULU (LOGOUT)
        signOut(auth).then(() => {
          alert("Akun berhasil dibuat! Silakan Masuk (Login) menggunakan Username dan Password kamu tadi.");
          // Arahkan kembali ke halaman Login
          window.location.href = "login.html"; 
        });

      });
    })
    .catch(err => {
      // Tangkap pesan eror jika username sudah pernah dipakai
      if(err.code === 'auth/email-already-in-use') {
          alert("Username tersebut sudah dipakai orang lain! Silakan buat Username yang berbeda.");
      } else {
          alert("Gagal Daftar: " + err.message);
      }
    });
}

// ================= GOOGLE LOGIN =================
window.loginGoogle = function(){
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
    .then((result) => {
      alert("Login Google berhasil! Selamat datang, " + result.user.displayName);
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
}

window.togglePassword = function() {
  const pwInput = document.getElementById("password");
  const icon = document.getElementById("toggleIcon");

  if (pwInput.type === "password") {
    pwInput.type = "text";
    // Ganti class ikon menjadi mata dicoret (fa-eye-slash)
    icon.className = "fas fa-eye-slash"; 
  } else {
    pwInput.type = "password";
    // Kembalikan class ikon menjadi mata terbuka (fa-eye)
    icon.className = "fas fa-eye";
  }
};