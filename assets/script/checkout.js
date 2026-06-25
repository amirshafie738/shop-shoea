import { get, post } from "../servise/service.js";

/* ===================== State ===================== */
let cartItems = [];
let selectedAddress = null;
let selectedShipping = null;
let appliedPromo = null;

/* ===================== Init ===================== */
document.addEventListener("DOMContentLoaded", async () => {
  loadCart();
  await loadDefaultAddress();
  updateSummary();
});

/* ===================== Cart (localStorage) ===================== */
function loadCart() {
  const stored = localStorage.getItem("cart");
  cartItems = stored ? JSON.parse(stored) : [];
  renderOrderList();
}

function renderOrderList() {
  const container = document.getElementById("order-list");
  container.innerHTML = "";

  if (cartItems.length === 0) {
    container.innerHTML = `<p class="text-gray-400 text-sm text-center">Your cart is empty</p>`;
    return;
  }

  cartItems.forEach((item) => {
    container.innerHTML += `
      <div class="flex items-center gap-4 bg-gray-50 rounded-2xl p-3">
        <img src="${item.image}" class="w-16 h-16 object-contain rounded-xl bg-white">
        <div class="flex-1 min-w-0">
          <p class="font-bold text-gray-900 text-sm truncate">${item.title}</p>
          <div class="flex items-center gap-2 mt-1">
            ${item.color ? `<span class="w-3 h-3 rounded-full inline-block border border-gray-200" style="background:${item.color}"></span>` : ""}
            ${item.size ? `<span class="text-xs text-gray-400">Size ${item.size}</span>` : ""}
          </div>
          <p class="font-bold text-gray-900 text-sm mt-1">$${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div class="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-700">
          ${item.quantity}
        </div>
      </div>
    `;
  });
}

/* ===================== Address ===================== */
async function loadDefaultAddress() {
  try {
    const addresses = await get("/addresses");
    selectedAddress = addresses.find((a) => a.isDefault) || addresses[0];
    renderAddressSection();
  } catch (e) {
    console.error("خطا در دریافت آدرس:", e.message);
  }
}

function renderAddressSection() {
  if (!selectedAddress) return;
  document.getElementById("address-label").textContent = selectedAddress.label;
  document.getElementById("address-text").textContent = selectedAddress.address;
}

/* ===================== Address Modal ===================== */
window.goToAddresses = async function () {
  document.getElementById("address-modal").classList.remove("hidden");
  try {
    const addresses = await get("/addresses");
    const list = document.getElementById("address-list");
    list.innerHTML = "";

    addresses.forEach((addr) => {
      const isSelected = selectedAddress?.id === addr.id;
      list.innerHTML += `
        <div id="addr-${addr.id}"
          class="flex items-center justify-between bg-gray-50 rounded-2xl p-4 cursor-pointer border-2 ">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <p class="font-bold text-gray-900 text-sm">${addr.label}</p>
                ${addr.isDefault ? `<span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Default</span>` : ""}
              </div>
              <p class="text-xs text-gray-400 mt-0.5">${addr.address}</p>
            </div>
          </div>
          <input type="radio" name="address" value="${addr.id}"
            class="w-5 h-5 accent-gray-900"
            ${isSelected ? "checked" : ""}>
      </div>
      `;
    });

    window._allAddresses = addresses;
  } catch (e) {
    console.error("خطا:", e.message);
  }
};

window.applyAddress = function () {
  const selected = document.querySelector('input[name="address"]:checked');
  if (!selected) return;
  const addr = window._allAddresses?.find((a) => a.id === selected.value);
  if (addr) {
    selectedAddress = addr;
    renderAddressSection();
  }
  closeAddressModal();
};

window.closeAddressModal = function () {
  document.getElementById("address-modal").classList.add("hidden");
};

/* ===================== Shipping Modal ===================== */
window.goToShipping = function () {
  document.getElementById("shipping-modal").classList.remove("hidden");
};

window.closeShippingModal = function () {
  document.getElementById("shipping-modal").classList.add("hidden");
};

window.applyShipping = function () {
  const selected = document.querySelector('input[name="shipping"]:checked');
  if (!selected) {
    alert("Please select a shipping type");
    return;
  }

  selectedShipping = {
    label: selected.dataset.label,
    arrival: selected.dataset.arrival,
    price: Number(selected.value),
  };

  // آپدیت بخش shipping در صفحه اصلی
  const section = document.getElementById("shipping-section");
  section.innerHTML = `
    <div class="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div>
          <p class="font-bold text-gray-900">${selectedShipping.label}</p>
          <p class="text-xs text-gray-400">Estimated · ${selectedShipping.arrival}</p>
        </div>
      </div>
      <button onclick="goToShipping()" class="p-1">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </button>
    </div>
  `;

  updateSummary();
  closeShippingModal();
};

/* ===================== Promo Code ===================== */
window.applyPromo = async function () {
  const code = document.getElementById("promo-input").value.trim().toUpperCase();
  if (!code) return;

  try {
    const promos = await get("/promoCodes");
    const found = promos.find((p) => p.code.toUpperCase() === code);

    if (!found) {
      alert("Invalid promo code");
      return;
    }

    appliedPromo = found;

    // نمایش badge
    document.getElementById("promo-input").closest("div").classList.add("hidden");
    const applied = document.getElementById("promo-applied");
    applied.classList.remove("hidden");
    document.getElementById("promo-label").textContent = `Discount ${found.discount}% Off`;

    updateSummary();
  } catch (e) {
    console.error("خطا در promo:", e.message);
  }
};

window.removePromo = function () {
  appliedPromo = null;
  document.getElementById("promo-applied").classList.add("hidden");
  document.getElementById("promo-input").closest("div").classList.remove("hidden");
  document.getElementById("promo-input").value = "";
  updateSummary();
};

/* ===================== Summary ===================== */
function updateSummary() {
  const amount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = selectedShipping ? selectedShipping.price : 0;
  const promoDiscount = appliedPromo ? (amount * appliedPromo.discount) / 100 : 0;
  const total = amount + shipping - promoDiscount;

  document.getElementById("summary-amount").textContent = `$${amount.toFixed(2)}`;
  document.getElementById("summary-shipping").textContent = selectedShipping
    ? `$${shipping.toFixed(2)}`
    : "-";

  const promoRow = document.getElementById("promo-row");
  if (appliedPromo) {
    promoRow.classList.remove("hidden");
    document.getElementById("summary-promo").textContent = `-$${promoDiscount.toFixed(2)}`;
  } else {
    promoRow.classList.add("hidden");
  }

  document.getElementById("summary-total").textContent =
    selectedShipping ? `$${total.toFixed(2)}` : "-";
}

/* ===================== Payment ===================== */
window.goToPayment = function () {
  if (!selectedAddress) {
    alert("Please select a shipping address");
    return;
  }
  if (!selectedShipping) {
    alert("Please choose a shipping type");
    return;
  }
  document.getElementById("payment-modal").classList.remove("hidden");
};

window.closePaymentModal = function () {
  document.getElementById("payment-modal").classList.add("hidden");
};

window.confirmPayment = async function () {
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
  const total = parseFloat(document.getElementById("summary-total").textContent.replace("$", ""));

  const order = {
    items: cartItems,
    address: selectedAddress,
    shipping: selectedShipping,
    total,
    paymentMethod,
    active: false,  // ← این رو اضافه کن
  };

  try {
    await post("/orders", order);

    // پاک کردن cart
    localStorage.removeItem("cart");

    closePaymentModal();
    document.getElementById("success-modal").classList.remove("hidden");
  } catch (e) {
    console.error("خطا در ثبت سفارش:", e.message);
    alert("Something went wrong. Please try again.");
  }
};

window.viewOrder = function () {
  window.location.href = "orders.html";
};
