// import { initializeApp }
//       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
//     import {
//       getFirestore, collection, getDocs, addDoc
//     } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
//     import {
//       getStorage, ref, uploadBytes, getDownloadURL
//     } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";
//     import {
//       getAuth, onAuthStateChanged, signOut
//     } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
alert("marketplace.js terbaca");
const firebaseConfig = {
  apiKey: "AIzaSyDUDnEkZ5OjpnVzDL8OaPnKqYs4ESsR2x8",
  authDomain: "mlbbunimus.firebaseapp.com",
  projectId: "mlbbunimus",
  storageBucket: "mlbbunimus.firebasestorage.app",
  messagingSenderId: "121855150863",
  appId: "1:121855150863:web:91ca0b826068a819d54c7a",
};

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const storage = getStorage(app);
// const auth = getAuth(app);

// ── AUTH ──
// onAuthStateChanged(auth, (user) => {
//   const nav = document.getElementById("navAuth");
//   if (!nav) return;
//   nav.innerHTML = user
//     ? `<span>${user.email}</span><button onclick="window.logout()">Logout</button>`
//     : `<a href="login.html">Masuk</a><a href="register.html">Daftar</a>`;
// });

// window.logout = () => signOut(auth).then(() => location.reload());

// ── DATA ──
const list = document.getElementById("list");
let allData = [
  {
    title: "Akun Mythic Glory 87 Skin",
    rank: "Mythic",
    price: 750000,
    desc: "87 Skin, 130 Hero, 2 Collector, 1 Legend",
    imageUrl: "https://picsum.photos/300/180",
    category: "akun",
  },
];
let activeCategory = "semua";

function formatRupiah(num) {
  return "Rp " + parseInt(num).toLocaleString("id-ID");
}

function renderCards(data) {
  list.innerHTML = "";
  if (data.length === 0) {
    list.innerHTML = `
          <div class="state-box">
            <i data-feather="inbox"></i>
            <p>Belum ada item untuk kategori ini.</p>
          </div>`;
    feather.replace();
    return;
  }
  data.forEach((item) => {
    const thumb = item.imageUrl
      ? `<img class="card-thumb" src="${item.imageUrl}" alt="${item.title}">`
      : `<div class="card-thumb-placeholder">🎮</div>`;
    list.innerHTML += `
          <div class="card">
            ${thumb}
            <div class="card-body-inner">
              <p class="card-title">${item.title}</p>
              <span class="card-rank">${item.rank || item.category || "-"}</span>
              <p class="card-desc">${item.desc}</p>
            </div>
            <div class="card-footer">
              <span class="card-price">${formatRupiah(item.price)}</span>
              <button class="btn-beli">Beli</button>
            </div>
          </div>`;
  });
  feather.replace();
}

function loadData() {
  applyFilter();
  //   const snapshot = await getDocs(collection(db, "posts"));
  //   allData = [];
  //   snapshot.forEach((doc) => allData.push(doc.data()));
  //   applyFilter();
}

function applyFilter() {
  const filtered =
    activeCategory === "semua"
      ? allData
      : allData.filter(
          (d) => (d.category || "akun").toLowerCase() === activeCategory,
        );
  renderCards(filtered);
}

loadData();

// ── CATEGORY FILTER ──
const categoryLabels = {
  semua: "🛒 Semua Item",
  hero: "⚔️ Hero",
  skin: "✨ Skin",
  akun: "👤 Akun",
  bundle: "📦 Bundle",
  event: "⚡ Event",
};

document.querySelectorAll(".cat-item").forEach((item) => {
  item.addEventListener("click", () => {
    document
      .querySelectorAll(".cat-item")
      .forEach((c) => c.classList.remove("active"));
    item.classList.add("active");
    activeCategory = item.dataset.cat;
    document.getElementById("categoryTitle").textContent =
      categoryLabels[activeCategory];
    applyFilter();
  });
});

// ── MODAL ──
window.openForm = () =>
  document.getElementById("modalOverlay").classList.add("open");
window.closeForm = () =>
  document.getElementById("modalOverlay").classList.remove("open");
document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) window.closeForm();
});

// ── UPLOAD ──

window.uploadPost = function () {
  const title = document.getElementById("title").value.trim();
  const rank = document.getElementById("rank").value;
  const price = document.getElementById("price").value;
  const desc = document.getElementById("desc").value.trim();

  if (!title || !rank || !price || !desc) {
    return alert("Isi semua field dulu!");
  }

  allData.push({
    title,
    rank,
    price,
    desc,
    imageUrl: "https://picsum.photos/300/180?random=" + Date.now(),
    category: "akun",
  });

  applyFilter();

  document.getElementById("title").value = "";
  document.getElementById("rank").value = "";
  document.getElementById("price").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("image").value = "";

  window.closeForm();

  alert("Listing berhasil ditambahkan!");
};

// window.uploadPost = async function () {
//   const title = document.getElementById("title").value.trim();
//   const rank  = document.getElementById("rank").value;
//   const price = document.getElementById("price").value;
//   const desc  = document.getElementById("desc").value.trim();
//   const file  = document.getElementById("image").files[0];

//   if (!title || !rank || !price || !desc) return alert("Isi semua field dulu!");
//   if (!file) return alert("Upload screenshot dulu!");

//   const btn = document.querySelector(".btn-submit");
//   btn.disabled = true;
//   btn.textContent = "Uploading...";

//   try {
//     const storageRef = ref(storage, "images/" + Date.now() + "_" + file.name);
//     await uploadBytes(storageRef, file);
//     const imageUrl = await getDownloadURL(storageRef);
//     await addDoc(collection(db, "posts"), {
//       title, rank, price, desc, imageUrl,
//       category: "akun",
//       createdAt: new Date()
//     });
//     alert("Listing berhasil diupload!");
//     window.closeForm();
//     loadData();
//   } catch (err) {
//     alert("Gagal upload: " + err.message);
//   } finally {
//     btn.disabled = false;
//     btn.textContent = "Upload Listing";
//   }
// };

loadData();



const searchBtn = document.getElementById("search");
const searchBox = document.getElementById("navbarSearch");

console.log(searchBtn)
console.log(searchBox);

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();

  console.log("Search diklik!");

  searchBox.classList.toggle("active");
});