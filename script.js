// ======= Data =======
const menuItems = {
  cafe: [
    { name: "Espresso", price: 3, img: "https://picsum.photos/seed/espresso/600/400", type: "veg" },
    { name: "Cappuccino", price: 4, img: "https://picsum.photos/seed/cappuccino/600/400", type: "veg" },
    { name: "Latte", price: 4.5, img: "https://picsum.photos/seed/latte/600/400", type: "veg" }
  ],
  drinks: [
    { name: "Orange Juice", price: 5, img: "https://picsum.photos/seed/oj/600/400", type: "veg" },
    { name: "Mango Smoothie", price: 6, img: "https://picsum.photos/seed/mango/600/400", type: "veg" }
  ],
  food: {
    snacks: [
      { name: "Veg Samosa", price: 2, img: "https://picsum.photos/seed/samosa/600/400", type: "veg" },
      { name: "Chicken Wings", price: 6, img: "https://picsum.photos/seed/wings/600/400", type: "non-veg" },
      { name: "French Fries", price: 3, img: "https://picsum.photos/seed/fries/600/400", type: "veg" }
    ],
    main: [
      { name: "Paneer Butter Masala", price: 8, img: "https://picsum.photos/seed/paneer/600/400", type: "veg" },
      { name: "Grilled Fish", price: 12, img: "https://picsum.photos/seed/fish/600/400", type: "non-veg" },
      { name: "Beef Steak", price: 14, img: "https://picsum.photos/seed/steak/600/400", type: "non-veg" }
    ]
  }
};

// ======= State =======
let orderList = [];
let currentCategory = "cafe";
let orderPanelVisible = true;

// ======= Helpers =======
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function currency(n) {
  return `$${n.toFixed(2)}`; // change to MWK if needed
}

// ======= Rendering =======
function renderMenu(items) {
  const container = $("#menu-items");
  container.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-item";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", `Add ${item.name} to order`);

    card.innerHTML = `
      <img src="${item.img}" alt="${item.name}" />
      <div class="title-row">
        <h2><span class="veg-indicator ${item.type === "veg" ? "veg" : "non-veg"}"></span>${item.name}</h2>
        <div class="price">${currency(item.price)}</div>
      </div>
    `;

    card.addEventListener("click", () => addToOrder(item.name, item.price));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") addToOrder(item.name, item.price);
    });

    container.appendChild(card);
  });
}

function updateOrderSummary() {
  const tbody = $("#order-table tbody");
  tbody.innerHTML = "";
  let grand = 0;

  orderList.forEach((line) => {
    const row = document.createElement("tr");
    const total = line.price * line.qty;
    grand += total;

    row.innerHTML = `
      <td>${line.name}</td>
      <td>${line.qty}</td>
      <td>${currency(line.price)}</td>
      <td>${currency(total)}</td>
    `;
    tbody.appendChild(row);
  });

  $("#grand-total").textContent = `Grand Total: ${currency(grand)}`;
}

// ======= Ordering =======
function addToOrder(name, price) {
  const existing = orderList.find((l) => l.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    orderList.push({ name, price, qty: 1 });
  }
  updateOrderSummary();
}

function clearOrder() {
  orderList = [];
  updateOrderSummary();
}

function confirmOrder() {
  if (orderList.length === 0) {
    alert("No items selected!");
    return;
  }
  // Placeholder: send to kitchen endpoint here (e.g., fetch/POST)
  alert("Order confirmed and sent to kitchen!");
  clearOrder();
}

// ======= Category/Subcategory =======
function showCategory(cat) {
  currentCategory = cat;
  const subnav = $("#food-subcategories");
  if (cat === "food") {
    subnav.classList.remove("hidden");
    renderMenu(menuItems.food.snacks); // default subcategory
  } else {
    subnav.classList.add("hidden");
    renderMenu(menuItems[cat]);
  }
}

function showSubcategory(sub) {
  renderMenu(menuItems.food[sub]);
}

// ======= Panel Toggle =======
function hideOrderPanel() {
  $("#order-panel").classList.add("hidden");
  $("#show-summary-btn").classList.remove("hidden");
  orderPanelVisible = false;
}

function showOrderPanel() {
  $("#order-panel").classList.remove("hidden");
  $("#show-summary-btn").classList.add("hidden");
  orderPanelVisible = true;
}

// ======= Event Wiring =======
document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  showCategory("cafe");
  updateOrderSummary();

  // Category buttons
  $$(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => showCategory(btn.dataset.cat));
  });

  // Subcategory buttons
  $$(".subcategory-btn").forEach((btn) => {
    btn.addEventListener("click", () => showSubcategory(btn.dataset.sub));
  });

  // Order actions
  $("#hide-summary-btn").addEventListener("click", hideOrderPanel);
  $("#show-summary-btn").addEventListener("click", showOrderPanel);
  $("#cancel-btn").addEventListener("click", clearOrder);
  $("#confirm-btn").addEventListener("click", confirmOrder);
});
