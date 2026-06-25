import { get } from "../servise/service.js";
import { renderNavbar } from "./components/navbar.js";

/* ===================== Navbar ===================== */
const navbarContainer = document.getElementById("navbar");
if (navbarContainer) navbarContainer.innerHTML = renderNavbar();

/* ===================== State ===================== */
let allOrders = [];
let currentTab = "active";

/* ===================== Init ===================== */
document.addEventListener("DOMContentLoaded", async () => {
  await loadOrders();
});

/* ===================== Load Orders ===================== */
async function loadOrders() {
  try {
    allOrders = await get("/orders");
    renderOrders();
  } catch (e) {
    console.error("خطا در دریافت سفارش‌ها:", e.message);
  }
}

/* ===================== Switch Tab ===================== */
window.switchTab = function (tab) {
  currentTab = tab;

  // آپدیت استایل تب‌ها
  document.getElementById("tab-active").className =
    `flex-1 py-3 text-sm border-b-2 transition-all ${
      tab === "active"
        ? "font-bold border-gray-900 text-gray-900"
        : "font-semibold border-transparent text-gray-400"
    }`;

  document.getElementById("tab-completed").className =
    `flex-1 py-3 text-sm border-b-2 transition-all ${
      tab === "completed"
        ? "font-bold border-gray-900 text-gray-900"
        : "font-semibold border-transparent text-gray-400"
    }`;

  renderOrders();
};

/* ===================== Render Orders ===================== */
function renderOrders() {
  const container = document.getElementById("orders-container");
  container.innerHTML = "";

  const filtered = allOrders.filter((o) =>
    currentTab === "active" ? o.active === true : o.active === false
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center mt-24 gap-4">
        <div class="relative w-24 h-24">
          <div class="w-20 h-24 bg-gray-200 rounded-sm absolute left-4 top-0 rotate-6"></div>
          <div class="w-20 h-24 bg-gray-300 rounded-sm absolute left-0 top-0 -rotate-3"></div>
        </div>
        <p class="text-gray-900 font-bold text-lg mt-4">You don't have an order yet</p>
        <p class="text-gray-400 text-sm text-center">You don't have an active orders at this time</p>
      </div>
    `;
    return;
  }

  filtered.forEach((order) => {
    order.items.forEach((item) => {
      container.innerHTML += `
        <div class="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
          <!-- Image -->
          <div class="w-20 h-20 bg-white rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src="${item.image}" class="w-full h-full object-contain">
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-bold text-gray-900 text-sm truncate">${item.title}</p>
            <div class="flex items-center gap-2 mt-1">
              ${item.color
                ? `<span class="w-3 h-3 rounded-full flex-shrink-0 border border-gray-200" style="background:${item.color}"></span>`
                : ""}
              ${item.size ? `<span class="text-xs text-gray-400">Size = ${item.size}</span>` : ""}
              <span class="text-xs text-gray-400">| Qty = ${item.quantity}</span>
            </div>

            <!-- Status Badge -->
            <span class="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-md ${
              order.active
                ? "bg-gray-200 text-gray-600"
                : "bg-gray-200 text-gray-600"
            }">
              ${order.active ? "In Delivery" : "Completed"}
            </span>

            <!-- Price & Button -->
            <div class="flex items-center justify-between mt-2">
              <p class="font-bold text-gray-900">$${item.price.toFixed(2)}</p>
              <button class="bg-gray-900 text-white text-xs px-4 py-2 rounded-full font-semibold">
                ${order.active ? "Track Order" : "Buy Again"}
              </button>
            </div>
          </div>
        </div>
      `;
    });
  });
}
