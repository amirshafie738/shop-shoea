import { get, post, remove } from "../servise/service.js";

// --- URL params ---
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

// --- state ---
let product = null;
let quantity = 1;
let selectedSize = null;
let selectedColor = null;
let selectedColorName = null;

// --- localStorage key (فقط برای cart نگه می‌داریم) ---
const CART_KEY = "cart";

// ============================================================
// ستاره‌ها با SVG gradient
// ============================================================


function renderStars(rating) {
    const percent = (rating / 5) * 100;
    const id = `star-${Date.now()}`;

    return `
        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
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

// ============================================================
// Favorites (API)
// ============================================================
async function isFavorite(id) {
    const favorites = await get("/favorites");
    return favorites.some(f => f.productId === Number(id));
}

async function toggleFavorite(id) {
    const favorites = await get("/favorites");
    const existing = favorites.find(f => f.productId === Number(id));

    if (existing) {
        await remove(`/favorites/${existing.id}`);
        return false;
    } else {
        await post("/favorites", { productId: Number(id) });
        return true;
    }
}
// برای تغییر ظاهر آیکون
function updateWishlistIcon(active) {
    const svg = document.querySelector("#wishlist-btn svg");
    svg.setAttribute("fill", active ? "currentColor" : "none");
}

// ============================================================
// Cart (localStorage - همینطور می‌مونه)
// ============================================================
function getCart() {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart() {
    const cart = getCart();

    const newItem = {
        productId: Number(productId),
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: quantity,
        size: selectedSize,
        color: selectedColorName,
    };

    const existingIndex = cart.findIndex(
        (c) =>
            c.productId === newItem.productId &&
            c.size === newItem.size &&
            c.color === newItem.color
    );

    if (existingIndex !== -1) {
        const newQty = cart[existingIndex].quantity + newItem.quantity;
        if (newQty > 10) {
            alert("Maximum 10 items allowed");
            return;
        }
        cart[existingIndex].quantity = newQty;
    } else {
        if (newItem.quantity > 10) {
            alert("Maximum 10 items allowed");
            return;
        }
        cart.push(newItem);
    }

    saveCart(cart);
}

// ============================================================
// دریافت محصول از API
// ============================================================
async function loadProduct() {
    try {
        if (!productId) throw new Error("id در URL نیست");
        product = await get(`/products/${productId}`);
        initSwiper(product);
        renderProduct(product);
    } catch (error) {
        console.error("خطا در دریافت محصول:", error.message);
        document.body.innerHTML = `
            <p class="text-center text-gray-500 mt-20">محصول پیدا نشد</p>
        `;
    }
}

// ============================================================
// Swiper
// ============================================================
function initSwiper(p) {
    const wrapper = document.getElementById("swiper-wrapper");
    wrapper.innerHTML = "";
///بررسی می‌کند آیا p.images واقعاً آرایه است یا نه
    const images = Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : [p.image];

    images.forEach((src) => {
        wrapper.innerHTML += `
            <div class="swiper-slide">
                <img src="${src}">
            </div>
        `;
    });

    new Swiper("#product-swiper", {
        loop: images.length > 1,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
    });
}

// ============================================================
// رندر اطلاعات محصول
// ============================================================
async function renderProduct(p) {
    document.getElementById("product-title").textContent = p.title;

    const soldBadge = document.getElementById("sold-badge");
    if (p.sold) {
        soldBadge.textContent = `${formatNumber(p.sold)} sold`;
    } else {
        soldBadge.style.display = "none";
    }

    const ratingContainer = document.getElementById("rating-value");
    ratingContainer.innerHTML = `
        <div class="flex items-center gap-1">
            ${p.rating ? renderStars(p.rating) : ""}
            <span class="text-gray-700 text-sm font-medium">${p.rating ?? "—"}</span>
            <span class="text-gray-400 text-sm">
                ${p.reviewsCount ? `(${formatNumber(p.reviewsCount)} reviews)` : ""}
            </span>
        </div>
    `;

    const fullDesc = p.description || "توضیحاتی ثبت نشده.";
    const shortDesc = fullDesc.length > 70 ? fullDesc.slice(0, 70) + "... " : fullDesc;
    const descEl = document.getElementById("description-text");
    descEl.textContent = shortDesc;

    const viewMoreBtn = document.getElementById("view-more-btn");
    if (fullDesc.length <= 70) {
        viewMoreBtn.style.display = "none";
    } else {
        let expanded = false;
        viewMoreBtn.addEventListener("click", () => {
            expanded = !expanded;
            descEl.textContent = expanded ? fullDesc : shortDesc;
            viewMoreBtn.textContent = expanded ? "view less.." : "view more..";
        });
    }

    const sizeContainer = document.getElementById("size-options");
    sizeContainer.innerHTML = "";
    if (p.sizes && p.sizes.length > 0) {
        selectedSize = p.sizes[p.sizes.length - 1];
        p.sizes.forEach((size) => {
            const isActive = size === selectedSize;
            const btn = document.createElement("button");
            btn.textContent = size;
            btn.className = sizeClass(isActive);
            btn.addEventListener("click", () => {
                selectedSize = size;
                document.querySelectorAll("#size-options button").forEach((b) =>
                    b.className = sizeClass(false)
                );
                btn.className = sizeClass(true);
            });
            sizeContainer.appendChild(btn);
        });
    }

    const colorContainer = document.getElementById("color-options");
    colorContainer.innerHTML = "";
    if (p.colors && p.colors.length > 0) {
        selectedColorName = p.colors[0].name;
        selectedColor = p.colors[0].value;
        p.colors.forEach((color, index) => {
            const isActive = index === 0;
            const btn = document.createElement("button");
            btn.style.backgroundColor = color.value;
            btn.className = colorClass(isActive);
            btn.innerHTML = isActive ? "✓" : "";
            btn.addEventListener("click", () => {
                selectedColor = color.value;
                selectedColorName = color.name;
                document.querySelectorAll("#color-options button").forEach((b, i) => {
                    b.className = colorClass(i === index);
                    b.innerHTML = i === index ? "✓" : "";
                });
            });
            colorContainer.appendChild(btn);
        });
    }

    // وضعیت اولیه‌ی قلب رو از API می‌گیریم
    const fav = await isFavorite(p.id);
    updateWishlistIcon(fav);

    updateTotalPrice();
}

// ============================================================
// کلاس‌ها
// ============================================================
function sizeClass(active) {
    return active
        ? "w-11 h-11 flex items-center justify-center rounded-full bg-gray-900 text-white font-semibold"
        : "w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 font-semibold";
}

function colorClass(active) {
    return "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold " +
        (active ? "ring-2 ring-offset-2 ring-gray-900" : "");
}

function formatNumber(num) {
    return num.toLocaleString();
}

function updateTotalPrice() {
    const total = (product.price * quantity).toFixed(2);
    document.getElementById("total-price").textContent = `$${total}`;
}

// ============================================================
// Event Listeners
// ============================================================
document.getElementById("qty-increase").addEventListener("click", () => {
    quantity++;
    document.getElementById("qty-value").textContent = quantity;
    updateTotalPrice();
});

document.getElementById("qty-decrease").addEventListener("click", () => {
    if (quantity > 1) {
        quantity--;
        document.getElementById("qty-value").textContent = quantity;
        updateTotalPrice();
    }
});

document.getElementById("wishlist-btn").addEventListener("click", async () => {
    const nowActive = await toggleFavorite(productId);
    updateWishlistIcon(nowActive);
});

document.getElementById("add-to-cart-btn").addEventListener("click", () => {
    addToCart();

    const btn = document.getElementById("add-to-cart-btn");
    btn.textContent = "✓ Added!";
    btn.classList.replace("bg-gray-900", "bg-green-600");
    setTimeout(() => {
        btn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                <path d="M3 6h18"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            Add to Cart
        `;
        btn.classList.replace("bg-green-600", "bg-gray-900");
    }, 1500);
});

document.addEventListener("DOMContentLoaded", loadProduct);
