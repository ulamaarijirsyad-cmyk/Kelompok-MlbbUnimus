import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut // Pastikan signOut tetap ada di sini
}
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

// ================= AUTH =================
document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("navAuth");

  onAuthStateChanged(auth, (user) => {
    if (!nav) return;

    if (user) {
      // TRICK: Ambil displayName (Username). 
      // Jika kosong atau berupa email, kita potong teks setelah tanda '@'
      let namaTampilan = user.displayName;

      if (!namaTampilan && user.email) {
        namaTampilan = user.email.split('@')[0]; // Ambil tulisan sebelum @
      }

      // Ambil foto profil (PP). Jika tidak ada, pakai gambar kosong bawaan
      // Ambil foto profil custom per akun
      const fotoProfil =
        localStorage.getItem("profilePhoto_" + user.uid) ||
        user.photoURL ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

      // Tampilkan foto profil mini dan nama user di pojok kanan
      nav.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; cursor: pointer;" onclick="window.location.href='profile.html'">
          <img src="${fotoProfil}" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid #00ffc8; object-fit: cover;">
          <span style="font-weight: bold; color: #00ffc8;">Halo, ${namaTampilan}!</span>
        </div>
        <button onclick="logout()" class="update-btn" style="padding: 5px 12px; font-size: 12px; margin-left: 15px;">
          Logout
        </button>
      `;
    } else {
      nav.innerHTML = `
        <a href="login.html" class="update-btn" style="text-decoration: none; padding: 5px 12px; display: inline-block;">
          Login / Register
        </a>
      `;
    }
  });
});

// ================= FUNGSI LOGOUT (PERBAIKAN 1) =================
window.logout = function () {
  signOut(auth).then(() => {
    alert("Berhasil Logout!");
    window.location.reload(); // Muat ulang halaman setelah logout
  }).catch((error) => {
    console.error("Gagal Logout:", error);
  });
};


// ================= LOAD MPL DATA =================

async function loadMPLData() {
  // PENCEGAH ERROR (PERBAIKAN 2): 
  // Cek apakah halaman ini punya tabel "metaTableBody" (berarti ini Dashboard).
  // Jika tidak ada (berarti lagi di Marketplace/Profile), maka STOP eksekusi script ini.
  const tableBody = document.getElementById("metaTableBody");
  if (!tableBody) return;

  try {
    const response = await fetch("heroes.json");
    const data = await response.json();

    // ================= HERO CARDS =================
    const cards = document.querySelectorAll(".analytics-card");
    cards.forEach((card, index) => {
      const hero = data[index];
      if (!hero) return;
      card.querySelector("h4").innerText = hero.hero;
      card.querySelector(".winrate").innerText = hero.winrate;
      card.querySelector(".meta-detail").innerText = "Pickrate: " + hero.pickrate;
      card.querySelector(".trend").innerHTML = `<i class="fas fa-chart-line"></i> MPL Statistics`;
    });

    // ================= WR LIST =================
    const wrList = document.querySelector(".wr-list");
    // urutkan winrate tertinggi
    const sortedWR = [...data].sort((a, b) => {
      return (parseFloat(b.winrate) - parseFloat(a.winrate));
    });

    // ambil top 5
    const topWR = sortedWR.slice(0, 5);
    wrList.innerHTML = "";
    topWR.forEach((hero, index) => {
      wrList.innerHTML += `
      <li>
        <span>${index + 1}. ${hero.hero}</span>
        <span class="percent">${hero.winrate}</span>
      </li>`;
    });

    // ================= TABLE =================
    const showAllBtn = document.getElementById("showAllBtn");
    let showAll = false;

    function renderTable() {
      tableBody.innerHTML = "";
      const heroesToShow = showAll ? data : data.slice(0, 10);

      heroesToShow.forEach((hero, index) => {
        tableBody.innerHTML += `
        <tr class="hero-row">
          <td>${index + 1}</td>
          <td>${hero.hero}</td>
          <td>${hero.pickrate}</td>
          <td>${hero.winrate}</td>
        </tr>`;
      });
    }

    renderTable();

    // ================= SHOW ALL =================
    if (showAllBtn) {
      showAllBtn.addEventListener("click", () => {
        showAll = !showAll;
        renderTable();
        showAllBtn.innerText = showAll ? "Show Less" : "Show All Heroes";
      });
    }

    // ================= SEARCH =================
    const searchInput = document.getElementById("heroSearch");
    if (searchInput) {
      searchInput.addEventListener("keyup", function () {
        let value = this.value.toLowerCase();
        let rows = document.querySelectorAll(".hero-row");
        rows.forEach(row => {
          row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
        });
      });
    }

    // ================= CHART =================
    const ctx = document.getElementById("heroChart");
    if (ctx) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.map(h => h.hero),
          datasets: [{
            label: "Winrate",
            data: data.map(h => parseFloat(h.winrate.replace("%", "")))
          }]
        }
      });
    }

    // ================= MODAL =================
    const modal = document.getElementById("heroModal");
    const modalHero = document.getElementById("modalHero");
    const modalPick = document.getElementById("modalPick");
    const modalWR = document.getElementById("modalWR");

    document.querySelectorAll(".hero-row").forEach((row, index) => {
      row.addEventListener("click", () => {
        if (modal) modal.style.display = "block";
        if (modalHero) modalHero.innerText = data[index].hero;
        if (modalPick) modalPick.innerText = "Pickrate: " + data[index].pickrate;
        if (modalWR) modalWR.innerText = "Winrate: " + data[index].winrate;
      });
    });

    const closeModalBtn = document.getElementById("closeModal");
    if (closeModalBtn) {
      closeModalBtn.onclick = () => {
        if (modal) modal.style.display = "none";
      };
    }

    // ================= PATCH INFO =================
    const patch = document.querySelector(".patch-stats");
    if (patch) {
      patch.innerHTML = `
        <span>
          <i class="fas fa-calendar-alt"></i>
          Updated ${new Date().toLocaleTimeString()}
        </span>
        <span>
          <i class="fas fa-database"></i>
          MPL Analytics Live
        </span>
      `;
    }

  } catch (err) {
    console.error("Gagal load data MPL: ", err);
  }
}

// ================= BUTTON =================
document.getElementById("updateBtn")?.addEventListener("click", async () => {
  await loadMPLData();
  alert("MPL Data Refreshed!");
});

// ================= INIT =================
loadMPLData();