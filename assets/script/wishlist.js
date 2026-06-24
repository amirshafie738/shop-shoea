/* ===================== Imports ===================== */
import { get, post, remove } from "../servise/service.js";


/* ===================== DOM Elements ===================== */
const cartList = document.getElementById('cart-list');
const paginationContainer = document.getElementById('pagination');


/* ===================== Pagination State ===================== */
let currentPage = 1;
const itemsPerPage = 6;
let products = [];
let filteredProducts = [];


/* ===================== API - Favorites ===================== */
async function getFavoriteIds() {
    const favorites = await get("/favorites");
    return favorites.map(f => f.productId);
}

async function addFavorite(productId) {
    await post("/favorites", { productId: Number(productId) });
}

async function removeFavorite(productId) {
    // اول آیدی رکورد favorites رو پیدا می‌کنیم
    const favorites = await get("/favorites");
    const record = favorites.find(f => f.productId === Number(productId));
    if (record) {
        await remove(`/favorites/${record.id}`);
    }
}

async function isFavorite(productId) {
    const ids = await getFavoriteIds();
    return ids.includes(Number(productId));
}

async function toggleFavorite(productId) {
    const fav = await isFavorite(productId);
    if (fav) {
        await removeFavorite(productId);
        return false;
    } else {
        await addFavorite(productId);
        return true;
    }
}


/* ===================== Fetch Wishlist Products ===================== */
async function loadWishlist(brand) {
    try {
        const ids = await getFavoriteIds();

        if (ids.length === 0) {
            products = [];
            applyFilter(brand);
            return;
        }

        const results = await Promise.all(
            ids.map((id) => get(`/products/${id}`))
        );

        products = results;
        applyFilter(brand);
    } catch (error) {
        console.error("خطا در دریافت علاقه‌مندی‌ها:", error.message);
        products = [];
        applyFilter(brand);
    }
}


/* ===================== Brand Filter ===================== */
function applyFilter(brand) {
    currentPage = 1;

    filteredProducts =
        brand && brand !== "all"
            ? products.filter((p) => p.brand === brand)
            : products;

    displayProducts();
    createPagination();
}

window.changeFilter = function (brand, el) {
    document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.classList.remove("bg-gray-900", "text-white", "border-gray-900");
        btn.classList.add("bg-white", "text-gray-800", "border-gray-800");
    });
    el.classList.remove("bg-white", "text-gray-800", "border-gray-800");
    el.classList.add("bg-gray-900", "text-white", "border-gray-900");
    applyFilter(brand);
};


/* ===================== Initial Load ===================== */
document.addEventListener("DOMContentLoaded", () => {
    loadWishlist();
});


/* ===================== Render Products ===================== */
async function displayProducts() {
    cartList.innerHTML = "";

    if (!filteredProducts || filteredProducts.length === 0) {
        cartList.innerHTML = `
            <div class="col-span-2 flex flex-col items-center justify-center mt-20 gap-3">
                <span class="text-5xl">🤍</span>
                <p class="text-gray-500 text-base">هنوز محصولی به علاقه‌مندی‌ها اضافه نکردی</p>
            </div>
        `;
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageProducts = filteredProducts.slice(start, end);

    // وضعیت قلب همه محصولات رو یکجا چک می‌کنیم
    const favIds = await getFavoriteIds();

    pageProducts.forEach((p) => {
        const isFav = favIds.includes(Number(p.id));
        cartList.innerHTML += `
            <a href="../detail.html?id=${p.id}" class="block">
                <div class="flex flex-col">
                    <div class="bg-gray-100 rounded-3xl flex items-center justify-center p-5 overflow-hidden mb-3 relative">
                        <img src="${p.image}" class="w-36 h-36 object-contain">
                        <button
                            class="wishlist-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center"
                            data-id="${p.id}"
                            onclick="handleWishlistToggle(event, ${p.id})">
                            <svg width="14" height="14" viewBox="0 0 24 24"
                                fill="${isFav ? 'white' : 'none'}"
                                stroke="white" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </button>
                    </div>
                    <h3 class="text-gray-900 font-bold text-xl truncate px-1">${p.title}</h3>
                    <div class="flex items-center gap-2 px-1 mt-1">
                        ${p.rating ? renderStar(p.rating) : ""}
                        <span class="text-gray-500 text-xs">${p.rating ?? ""}</span>
                        ${p.sold ? `<span class="text-gray-300">|</span><span class="text-gray-500 text-xs">${formatNumber(p.sold)} sold</span>` : ""}
                    </div>
                    <p class="text-gray-900 font-bold text-base px-1 mt-1">
                        $${p.price.toFixed(2)}
                    </p>
                </div>
            </a>
        `;
    });
}


/* ===================== Toggle Wishlist از داخل کارت ===================== */
window.handleWishlistToggle = async function (event, id) {
    event.preventDefault();
    event.stopPropagation();

    const isNowFav = await toggleFavorite(id);

    if (!isNowFav) {
        await loadWishlist(); // 
    }
};


/* ===================== ستاره‌ی واحد ===================== */
function renderStar(rating) {
    const percent = (rating / 5) * 100;
    const id = `star-${rating}-${Math.random().toString(36).slice(2)}`;

    return `
        <svg width="16" height="16" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="${id}" x1="0" x2="100%" y1="0" y2="0">
                    <stop offset="${percent}%" stop-color="#111827"/>
                    <stop offset="${percent}%" stop-color="#D1D5DB"/>
                </linearGradient>
            </defs>
            <polygon
                points="10,2 12.9,7.5 19,8.3 14.5,12.6 15.8,18.8 10,15.7 4.2,18.8 5.5,12.6 1,8.3 7.1,7.5"
                fill="url(#${id})"
            />
        </svg>
    `;
}


/* ===================== Pagination ===================== */
function createPagination() {
    paginationContainer.innerHTML = "";

    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
    if (pageCount <= 1) return;

    for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.innerText = i;
        btn.className =
            "w-9 h-9 flex items-center justify-center rounded-lg border font-medium " +
            (i === currentPage
                ? "bg-gray-900 text-white border-gray-900"
                : "border-gray-300 text-gray-700");

        btn.addEventListener("click", () => {
            currentPage = i;
            displayProducts();
            createPagination();
        });

        paginationContainer.append(btn);
    }
}


/* ===================== Helpers ===================== */
function formatNumber(num) {
    return num.toLocaleString();
}


/* ===================== Navbar & Header ===================== */
import { renderNavbar } from "./components/navbar.js";
import { renderHeader } from "./components/header.js";

const navbarContainer = document.getElementById("navbar");
if (navbarContainer) navbarContainer.innerHTML = renderNavbar();

const headerContainer = document.getElementById("header");
if (headerContainer) headerContainer.innerHTML = renderHeader();
