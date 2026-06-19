const cartList = document.getElementById('cart-list')

import { get } from "../servise/service.js"; 

async function getAllProduct(brand) {
    try {
      const endpoint =
        brand && brand !== "all"
          ? `/products?brand=${encodeURIComponent(brand)}`
          : "/products";
  
      const result = await get(endpoint);
      renderHomeCart(result);
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error.message);
      renderHomeCart([]);
    }
  }
  
  window.changeFilter = function (brand) {
    getAllProduct(brand);
  };
  
  document.addEventListener("DOMContentLoaded", () => {
    getAllProduct();
  });
function renderHomeCart(data) {
    let finalHtml = ""

    data.forEach((p) => {
        finalHtml += `
        <!-- Product Card 1 -->
              <a href="cart.html?id=${p.id}">   
                <div class="flex flex-col">
                    <!-- Image Container -->
                    <div class="bg-gray-100 rounded-3xl  flex items-center justify-center p-5 overflow-hidden mb-3">
                        <img src= ${p.image} alt="Product" class="w-36 h-36 ">
                    </div>
                    <!-- Product Info -->
                    <h3 class="text-gray-900 font-bold text-xl truncate px-1">${p.title}</h3>
                    <p class="text-gray-800 font-semibold text-base px-1 mt-2">$ <span> ${p.price}</span></p>
                </div>
              </a>
     `
    });

    cartList.innerHTML = finalHtml;

}
///////////////////////////////category//////////////////////////////////
const categoryList = document.getElementById("category-list");
const categoryTitle = document.getElementById("category-title");

// خوندن مقدار brand از URL (مثلاً category.html?brand=Nike)
const params = new URLSearchParams(window.location.search);
const brand = params.get("brand");

// عنوان صفحه رو با اسم برند پر می‌کنیم
if (categoryTitle) {
    categoryTitle.textContent = brand || "همه محصولات";
}

async function loadCategoryProducts() {
    try {
        const endpoint = brand
            ? `/products?brand=${encodeURIComponent(brand)}`
            : "/products";

        const result = await get(endpoint);
        renderCategoryList(result);
    } catch (error) {
        console.error("خطا در دریافت محصولات:", error.message);
        renderCategoryList([]);
    }
}

function renderCategoryList(data) {
    if (!data || data.length === 0) {
        categoryList.innerHTML = `<p class="col-span-2 text-center text-gray-500 mt-10">محصولی پیدا نشد</p>`;
        return;
    }

    let finalHtml = "";

    data.forEach((p) => {
        finalHtml += `
        <a href="cart.html?id=${p.id}">
            <div class="flex flex-col">
                <div class="bg-gray-100 rounded-3xl flex items-center justify-center p-5 overflow-hidden mb-3">
                    <img src="${p.image}" alt="${p.title}" class="w-36 h-36">
                </div>
                <h3 class="text-gray-900 font-bold text-xl truncate px-1">${p.title}</h3>
                <p class="text-gray-800 font-semibold text-base px-1 mt-2">$ <span>${p.price}</span></p>
            </div>
        </a>
        `;
    });

    categoryList.innerHTML = finalHtml;
}

document.addEventListener("DOMContentLoaded", loadCategoryProducts);

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

