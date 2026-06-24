/* ===================== DOM Elements ===================== */
const cartList = document.getElementById('cart-list');
const paginationContainer = document.getElementById('pagination');

/* ===================== Imports ===================== */
import { get } from "../servise/service.js"; 

/* ===================== Pagination State ===================== */
let currentPage = 1;
const itemsPerPage = 6; // تعداد محصول در هر صفحه
let products = []; // همه‌ی محصولاتی که از API گرفته شدن

/* ===================== Brand Filter ===================== */
async function getAllProduct(brand) {
    try {
      const endpoint =
        brand && brand !== "all"
          ? `/products?brand=${encodeURIComponent(brand)}`
          : "/products";
  
      const result = await get(endpoint);

      products = result; // ذخیره کل محصولات
      currentPage = 1; // با هر فیلتر جدید صفحه به ۱ برمی‌گرد
  
      displayProducts();
      createPagination();
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error.message);
      products = [];
      displayProducts();
      createPagination();
    }
  }
  
 /* ===================== Brand Filter ===================== */
// با کلیک روی هر دکمه، بک‌گراند اون دکمه مشکی می‌شه و بقیه سفید می‌مونن
window.changeFilter = function (brand, el) {
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("bg-gray-900", "text-white", "border-gray-900");
    btn.classList.add("bg-white", "text-gray-800", "border-gray-800");
  });

  if (el) {
    el.classList.remove("bg-white", "text-gray-800", "border-gray-800");
    el.classList.add("bg-gray-900", "text-white", "border-gray-900");
  }

  getAllProduct(brand);
};

  
 /* ===================== Initial Page Load ===================== */
document.addEventListener("DOMContentLoaded", () => {
  getAllProduct();
});


/* ===================== Render Products ===================== */
// نمایش محصولات صفحه‌ی فعلی
function displayProducts() {
  cartList.innerHTML = "";

  if (!products || products.length === 0) {
    cartList.innerHTML = `
      <p class="col-span-2 text-center text-gray-500 mt-10">
        محصولی پیدا نشد
      </p>`;
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageProducts = products.slice(start, end);

  pageProducts.forEach((p) => {
    cartList.innerHTML += `
      <!-- Product Card -->
      <a href="detail.html?id=${p.id}">   
        <div class="flex flex-col">

          <!-- Image Container -->
          <div class="bg-gray-100 rounded-3xl flex items-center justify-center p-5 overflow-hidden mb-3">
            <img src="${p.image}" alt="Product" class="w-36 h-36">
          </div>

          <!-- Product Info -->
          <h3 class="text-gray-900 font-bold text-xl truncate px-1">${p.title}</h3>
          <p class="text-gray-800 font-semibold text-base px-1 mt-2">
            $ <span class="font-semibold text-base">${p.price}</span>
          </p>

        </div>
      </a>
    `;
  });
}
/* ===================== Create Pagination Buttons ===================== */
// ساخت دکمه‌های صفحه‌بندی
function createPagination() {
  paginationContainer.innerHTML = "";

  const pageCount = Math.ceil(products.length / itemsPerPage);

  // اگر فقط یک صفحه باشد نیازی به دکمه نیست
  if (pageCount <= 1) return;

  for (let i = 1; i <= pageCount; i++) {
    const btn = document.createElement('button');
    btn.innerText = i;

    btn.className =
      "w-9 h-9 flex items-center justify-center rounded-lg border font-medium " +
      (i === currentPage
        ? "bg-gray-900 text-white border-gray-900"
        : "border-gray-300 text-gray-700");

    btn.addEventListener('click', () => {
      currentPage = i;
      displayProducts();
      createPagination();
    });

    paginationContainer.append(btn);
  }
}

///////////////////////// navabar & header //////////////////////
import { renderNavbar } from "./components/navbar.js";
import { renderHeader } from "./components/header.js";

const navbarContainer = document.getElementById("navbar");

if (navbarContainer) {
    navbarContainer.innerHTML = renderNavbar();
}

const headerContainer = document.getElementById("header");

if (headerContainer) {
    headerContainer.innerHTML = renderHeader();
}

//////////////////////////////////search////////////////////////////////////////
// دریافت المان‌های سرچ
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// تابع جستجو
async function performSearch() {
  const query = searchInput.value.trim().toLowerCase();
// زمانی که جستجو می کنیکم بخش فیلتر رنگش بر گرده حالت عادی
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("bg-gray-900", "text-white", "border-gray-900");
    btn.classList.add("bg-white", "text-gray-800", "border-gray-800");
  });

  try {
    // همه محصولات رو بگیر
    const allProducts = await get(`/products`);
    
    // اگه query خالیه همه رو نشون بده، وگرنه فیلتر کن
    products = query
      ? allProducts.filter(p =>
          p.title?.toLowerCase().includes(query) ||
          p.brand?.toLowerCase().includes(query)
        )
      : allProducts;

    currentPage = 1;
    displayProducts();
    createPagination();
  } catch (error) {
    console.error("خطا در جستجو:", error);
  }
}

// گوش دادن به کلیک دکمه سرچ
searchBtn.addEventListener("click", performSearch);

// گوش دادن به دکمه Enter در کیبورد
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});
