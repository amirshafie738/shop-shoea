/* ===================== Imports ===================== */
import { get } from "../servise/service.js";
import { renderNavbar } from "./components/navbar.js";

/* ===================== Navbar ===================== */
const navbarContainer = document.getElementById("navbar");
if (navbarContainer) navbarContainer.innerHTML = renderNavbar();

/* ===================== DOM Elements ===================== */
const cartList = document.getElementById("cart-list");
const emptyState = document.getElementById("empty-state");
const totalPriceEl = document.getElementById("total-price");

/* ===================== Pending Remove State ===================== */
let pendingRemove = null;

/* ===================== LocalStorage ===================== */
function getCart() {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateQuantity(id, color, size, delta) {
    let cart = getCart();
    const item = cart.find(
        (i) => i.productId === id && i.color === color && String(i.size) === String(size)
    );
    if (!item) return;

    if (item.quantity + delta <= 0) {
        showRemoveSheet(id, color, size);
        return;
    }
    if (item.quantity + delta > 10) {
        alert("حداکثر ۱۰ عدد می‌تونی سفارش بدی");
        return;
    }
    item.quantity += delta;
    saveCart(cart);
    renderCart();
}

function removeItem(id, color, size) {
    let cart = getCart().filter(
        (i) => !(i.productId === id && i.color === color && String(i.size) === String(size))
    );
    saveCart(cart);
    renderCart();
}

/* ===================== Bottom Sheet ===================== */
function showRemoveSheet(id, color, size) {
    pendingRemove = { id, color, size };
    const cart = getCart();
    const item = cart.find(
        (i) => i.productId === id && i.color === color && String(i.size) === String(size)
    );

    get(`/products/${id}`).then((p) => {
        document.getElementById("sheet-img").src = p.image;
        document.getElementById("sheet-img").alt = p.title;
        document.getElementById("sheet-title").textContent = p.title;
        document.getElementById("sheet-color-dot").style.backgroundColor = color;
        document.getElementById("sheet-color-text").textContent = color;
        document.getElementById("sheet-size").textContent = `Size = ${size}`;
        document.getElementById("sheet-price").textContent = `$${(p.price * item.quantity).toFixed(2)}`;
        document.getElementById("sheet-quantity").textContent = item.quantity;
    });

    document.getElementById("remove-overlay").classList.remove("hidden");
    document.getElementById("remove-sheet").classList.remove("translate-y-full");
}

function hideRemoveSheet() {
    pendingRemove = null;
    document.getElementById("remove-overlay").classList.add("hidden");
    document.getElementById("remove-sheet").classList.add("translate-y-full");
}

/* ===================== Render ===================== */
async function renderCart() {
    const cart = getCart();
    cartList.innerHTML = "";

    const bottomBar = document.getElementById("bottom-bar"); //  کل بار رو می‌گیریم

    if (cart.length === 0) {
        cartList.classList.add("hidden");
        emptyState.classList.remove("hidden");
        emptyState.classList.add("flex");
        totalPriceEl.textContent = "$0.00";
        if (bottomBar) bottomBar.classList.add("hidden"); //  کل بار مخفی می‌شه
        return;
    }

    cartList.classList.remove("hidden");
    emptyState.classList.add("hidden");
    emptyState.classList.remove("flex");
    if (bottomBar) bottomBar.classList.remove("hidden"); //  کل بار نشون داده می‌شه

    const products = await Promise.all(
        cart.map((item) => get(`/products/${item.productId}`)) // 
    );

    let total = 0;

    cart.forEach((item, index) => {
        const p = products[index];
        if (!p) return;

        const itemTotal = p.price * item.quantity;
        total += itemTotal;

        cartList.innerHTML += `
            <div class="flex items-center gap-4 py-5 px-5  border-gray-100  shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-3xl ">

                <!-- عکس -->
                <div class="w-28 h-28 bg-gray-100 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden p-2">
                    <img src="${p.image}" alt="${p.title}" class="w-full h-full object-contain">
                </div>

                <!-- اطلاعات -->
                <div class="flex-1 min-w-0">

                    <!-- عنوان + دکمه حذف -->
                    <div class="flex items-start justify-between gap-2">
                        <h3 class="text-gray-900 font-bold text-base truncate">${p.title}</h3>
                        <button onclick="handleRemove('${item.productId}', '${item.color}', '${item.size}')"
                            class="text-gray-400 hover:text-red-500 transition-colors shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                            </svg>
                        </button>
                    </div>

                    <!-- رنگ و سایز -->
                    <div class="flex items-center gap-2 mt-1">
                        <span class="w-4 h-4 rounded-full border border-gray-300 shrink-0"
                            style="background-color: ${item.color}"></span>
                        <span class="text-gray-500 text-sm capitalize">${item.color}</span>
                        <span class="text-gray-300">|</span>
                        <span class="text-gray-500 text-sm">Size = ${item.size}</span>
                    </div>

                    <!-- قیمت + تعداد -->
                    <div class="flex items-center justify-between mt-2">
                        <span class="text-gray-900 font-bold text-base">$${itemTotal.toFixed(2)}</span>

                        <!-- کنترل تعداد -->
                        <div class="flex items-center gap-3 bg-[#e7e7e7] rounded-full px-2">
                            <button onclick="handleQuantity('${item.productId}', '${item.color}', '${item.size}', -1)"
                                class="w-7 h-7  flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-bold">
                                −
                            </button>
                            <span class="text-gray-900 font-semibold w-4 text-center">${item.quantity}</span>
                            <button onclick="handleQuantity('${item.productId}', '${item.color}', '${item.size}', 1)"
                                class="w-7 h-7  flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors font-bold">
                                +
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
    });

    totalPriceEl.textContent = `$${total.toFixed(2)}`;
}

/* ===================== Global Handlers ===================== */
window.handleQuantity = function (id, color, size, delta) {
    updateQuantity(Number(id), color, size, delta);
};

window.handleRemove = function (id, color, size) {
    showRemoveSheet(Number(id), color, size);
};

window.confirmRemove = function () {
    if (!pendingRemove) return;
    removeItem(pendingRemove.id, pendingRemove.color, pendingRemove.size);
    hideRemoveSheet();
};

window.cancelRemove = function () {
    hideRemoveSheet();
};

window.handleCheckout = function () {
    window.location.href = "checkout.html"; 
};

/* ===================== Initial Load ===================== */
document.addEventListener("DOMContentLoaded", () => {
    renderCart();
});