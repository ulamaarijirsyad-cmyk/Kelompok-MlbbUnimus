import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
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

      nav.innerHTML = `
        <span>${user.email}</span>
        <button onclick="logout()">
          Logout
        </button>
      `;

    } else {

      nav.innerHTML = `
        <a href="login.html">Masuk</a>
        <a href="register.html">Daftar</a>
      `;
    }
  });

});

window.logout = function () {

  signOut(auth).then(() => {

    alert("Logout berhasil");

    location.reload();

  });

};

// ================= LOAD MPL DATA =================

async function loadMPLData() {

  const response =
    await fetch("heroes.json");

  const data =
    await response.json();

  // ================= HERO CARDS =================

  const cards =
    document.querySelectorAll(".analytics-card");

  cards.forEach((card, index) => {

    const hero = data[index];

    if (!hero) return;

    card.querySelector("h4").innerText =
      hero.hero;

    card.querySelector(".winrate").innerText =
      hero.winrate;

    card.querySelector(".meta-detail").innerText =
      "Pickrate: " + hero.pickrate;

    card.querySelector(".trend").innerHTML =
      `<i class="fas fa-chart-line"></i> MPL Statistics`;

  });

  // ================= WR LIST =================

  const wrList =
    document.querySelector(".wr-list");

  // urutkan winrate tertinggi
  const sortedWR =
    [...data].sort((a, b) => {

      return (
        parseFloat(b.winrate) -
        parseFloat(a.winrate)
      );

    });

  // ambil top 5
  const topWR =
    sortedWR.slice(0, 5);

  wrList.innerHTML = "";

  topWR.forEach((hero, index) => {

    wrList.innerHTML += `
    <li>

      <span>
        ${index + 1}. ${hero.hero}
      </span>

      <span class="percent">
        ${hero.winrate}
      </span>

    </li>
  `;

  });


  // ================= TABLE =================

  const tableBody =
    document.getElementById("metaTableBody");

  const showAllBtn =
    document.getElementById("showAllBtn");

  let showAll = false;

  function renderTable() {

    tableBody.innerHTML = "";

    const heroesToShow =
      showAll
        ? data
        : data.slice(0, 10);

    heroesToShow.forEach((hero, index) => {

      tableBody.innerHTML += `
      <tr class="hero-row">

        <td>${index + 1}</td>

        <td>${hero.hero}</td>

        <td>${hero.pickrate}</td>

        <td>${hero.winrate}</td>

      </tr>
    `;

    });

  }

  renderTable();

  // ================= SHOW ALL =================

  showAllBtn.addEventListener("click", () => {

    showAll = !showAll;

    renderTable();

    showAllBtn.innerText =
      showAll
        ? "Show Less"
        : "Show All Heroes";

  });

  // ================= SEARCH =================

  document
    .getElementById("heroSearch")
    .addEventListener("keyup", function () {

      let value =
        this.value.toLowerCase();

      let rows =
        document.querySelectorAll(".hero-row");

      rows.forEach(row => {

        row.style.display =
          row.innerText.toLowerCase()
            .includes(value)
            ? ""
            : "none";

      });

    });

  // ================= CHART =================

  const ctx =
    document.getElementById("heroChart");

  new Chart(ctx, {

    type: "bar",

    data: {

      labels:
        data.map(h => h.hero),

      datasets: [{

        label: "Winrate",

        data:
          data.map(h =>
            parseFloat(
              h.winrate.replace("%", "")
            )
          )

      }]
    }

  });

  // ================= MODAL =================

  const modal =
    document.getElementById("heroModal");

  const modalHero =
    document.getElementById("modalHero");

  const modalPick =
    document.getElementById("modalPick");

  const modalWR =
    document.getElementById("modalWR");

  document
    .querySelectorAll(".hero-row")
    .forEach((row, index) => {

      row.addEventListener("click", () => {

        modal.style.display = "block";

        modalHero.innerText =
          data[index].hero;

        modalPick.innerText =
          "Pickrate: " + data[index].pickrate;

        modalWR.innerText =
          "Winrate: " + data[index].winrate;

      });

    });

  document
    .getElementById("closeModal")
    .onclick = () => {

      modal.style.display = "none";

    };

  // ================= PATCH INFO =================

  const patch =
    document.querySelector(".patch-stats");

  patch.innerHTML = `
    <span>
      <i class="fas fa-calendar-alt"></i>

      Updated
      ${new Date().toLocaleTimeString()}
    </span>

    <span>
      <i class="fas fa-database"></i>
      MPL Analytics Live
    </span>
  `;

}

// ================= BUTTON =================

document
  .getElementById("updateBtn")
  ?.addEventListener("click", async () => {

    await loadMPLData();

    alert("MPL Data Refreshed!");

  });

// ================= INIT =================

loadMPLData();