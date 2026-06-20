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
                    <p class="text-gray-800 font-semibold text-base px-1 mt-2">$ <span class="font-semibold text-base"> ${p.price}</span></p>
                </div>
              </a>
     `
    });

    cartList.innerHTML = finalHtml;

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

