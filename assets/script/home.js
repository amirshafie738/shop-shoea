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
// دریافت المان‌های رابط کاربری (UI) برای تعامل با کاربر
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

/**
 * تابع اصلی برای اجرای عملیات جستجو در سمت سرور
 * این تابع مقدار ورودی را می‌گیرد، آن را به سرور می‌فرستد و نتایج را نمایش می‌دهد.
 */
async function performSearch() {
  // دریافت مقدار ورودی کاربر و حذف فضاهای خالی اضافی از ابتدا و انتهای آن
  const query = searchInput.value.trim();

  // بازنشانی وضعیت ظاهری دکمه‌های فیلتر برند (Reset Filter UI)
  // با این کار وقتی کاربر جستجو می‌کند، فیلتر قبلی غیرفعال می‌شود تا تجربه کاربری بهتری داشته باشیم
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.remove("bg-gray-900", "text-white", "border-gray-900");
    btn.classList.add("bg-white", "text-gray-800", "border-gray-800");
  });

  try {
    // تعیین آدرس درخواست (Endpoint):
    // اگر عبارتی در سرچ باشد، از پارامتر ?q= استفاده می‌کنیم (جستجوی سرور-ساید)
    // اگر عبارت خالی باشد، تمام محصولات را درخواست می‌کنیم
    // استفاده از encodeURIComponent برای جلوگیری از خرابی آدرس در صورت وجود کاراکترهای خاص
    const endpoint = query ? `/products?q=${encodeURIComponent(query)}` : `/products`;
    
    // دریافت اطلاعات از سرور و ذخیره در متغیر عمومی products
    products = await get(endpoint);

    // بازنشانی به صفحه اول برای نمایش نتایج جدید از ابتدا
    currentPage = 1;

    // به‌روزرسانی نمایش لیست محصولات و دکمه‌های صفحه‌بندی بر اساس نتایج جدید
    displayProducts();
    createPagination();
    
  } catch (error) {
    // مدیریت خطا در صورت عدم برقراری ارتباط با سرور
    console.error("خطا در عملیات جستجو:", error);
  }
}

// فعال‌سازی رویداد کلیک برای دکمه سرچ
searchBtn.addEventListener("click", performSearch);

// فعال‌سازی رویداد فشردن دکمه Enter روی کیبورد برای سرعت بیشتر کاربر
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    performSearch();
  }
});

