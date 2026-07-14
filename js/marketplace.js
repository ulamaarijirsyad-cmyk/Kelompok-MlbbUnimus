const firebaseConfig = {
  apiKey: "AIzaSyDUDnEkZ5OjpnVzDL8OaPnKqYs4ESsR2x8",
  authDomain: "mlbbunimus.firebaseapp.com",
  projectId: "mlbbunimus",
  storageBucket: "mlbbunimus.firebasestorage.app",
  messagingSenderId: "121855150863",
  appId: "1:121855150863:web:91ca0b826068a819d54c7a",
};

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
  {
    title: "Skin Collector - Gusion Cosmic Sculptor",
    rank: "Collector",
    price: 150000,
    desc: "Skin collector eksklusif, efek recall & entrance khusus, siap kirim kode redeem",
    imageUrl: "images/heroes/gusion cosmic.jpg",
    category: "skin",
  },
  {
    title: "Skin Legend - Alucard Obsidian Blade",
    rank: "Legend",
    price: 120000,
    desc: "Skin legend dengan efek visual premium, cocok untuk push rank",
    imageUrl: "images/heroes/alucard.jpg",
    category: "skin",
  },
  {
    title: "Skin Epic - Fanny Blossom Dance",
    rank: "Epic",
    price: 45000,
    desc: "Skin epic populer, desain elegan, garansi kode belum terpakai",
    imageUrl: "images/heroes/fanny epic.jpg",
    category: "skin",
  },
  {
    title: "Skin Starlight - Lancelot Starlight Member",
    rank: "Starlight",
    price: 65000,
    desc: "Paket skin starlight bulan ini, termasuk bonus fragment",
    imageUrl: "images/heroes/lancelot starlight.jpg",
    category: "skin",
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
              <button class="btn-beli" data-title="${item.title}">Beli</button>
            </div>
          </div>`;
  });
  feather.replace();
}

function loadData() {
  applyFilter();
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

// ── MODAL (FORM JUAL AKUN) ──
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
    return alert("Lengkapi Data");
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

// ── CART ──
const CART_STORAGE_KEY = "mlguide_cart";
let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
  if (totalQty > 0) {
    badge.textContent = totalQty;
    badge.hidden = false;
  } else {
    badge.hidden = true;
  }
}

function addToCart(title) {
  const product = allData.find((d) => d.title === title);
  if (!product) return;

  const existing = cart.find((i) => i.title === title);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1,
    });
  }

  saveCart();

  const badge = document.getElementById("cartBadge");
  badge.classList.remove("bump");
  void badge.offsetWidth; // restart animasi kalau ada
  badge.classList.add("bump");
}

function changeQty(title, delta) {
  const item = cart.find((i) => i.title === title);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.title !== title);
  }
  saveCart();
  renderCart();
}

function removeFromCart(title) {
  cart = cart.filter((i) => i.title !== title);
  saveCart();
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cartList");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartList.innerHTML = `<div class="cart-empty">Keranjang masih kosong.</div>`;
    cartTotal.textContent = formatRupiah(0);
    return;
  }

  cartList.innerHTML = cart
    .map((item) => {
      const thumb = item.imageUrl
        ? `<img class="cart-item-thumb" src="${item.imageUrl}" alt="${item.title}">`
        : `<div class="cart-item-thumb"></div>`;
      return `
        <div class="cart-item">
          ${thumb}
          <div class="cart-item-info">
            <p class="cart-item-title">${item.title}</p>
            <p class="cart-item-price">${formatRupiah(item.price)}</p>
          </div>
          <div class="cart-item-qty">
            <button data-action="dec" data-title="${item.title}">-</button>
            <span>${item.qty}</span>
            <button data-action="inc" data-title="${item.title}">+</button>
          </div>
          <button class="cart-item-remove" data-action="remove" data-title="${item.title}">
            <i data-feather="trash-2"></i>
          </button>
        </div>`;
    })
    .join("");

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  cartTotal.textContent = formatRupiah(total);

  feather.replace();
}

window.openCart = function () {
  renderCart();
  document.getElementById("cartOverlay").classList.add("open");
};

window.closeCart = function () {
  document.getElementById("cartOverlay").classList.remove("open");
};

window.checkoutCart = function () {
  if (cart.length === 0) {
    return alert("Keranjang masih kosong.");
  }
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  alert(
    `Checkout berhasil!\nTotal item: ${cart.reduce((s, i) => s + i.qty, 0)}\nTotal bayar: ${formatRupiah(total)}`,
  );
  cart = [];
  saveCart();
  renderCart();
  window.closeCart();
};

document.getElementById("cartOverlay").addEventListener("click", function (e) {
  if (e.target === this) window.closeCart();
});

// Klik ikon cart di navbar -> buka modal cart
document.getElementById("cart").addEventListener("click", function (e) {
  e.preventDefault();
  window.openCart();
});

// Event delegation: tombol "Beli" di setiap card
list.addEventListener("click", function (e) {
  const btn = e.target.closest(".btn-beli");
  if (!btn) return;
  addToCart(btn.dataset.title);
});

// Event delegation: tombol qty & remove di dalam cart modal
document.getElementById("cartList").addEventListener("click", function (e) {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const { action, title } = btn.dataset;
  if (action === "inc") changeQty(title, 1);
  if (action === "dec") changeQty(title, -1);
  if (action === "remove") removeFromCart(title);
});

updateCartBadge();
loadData();

const searchBtn = document.getElementById("search");
const searchBox = document.getElementById("navbarSearch");

searchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  searchBox.classList.toggle("active");
});