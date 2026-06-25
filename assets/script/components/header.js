// src/components/header/header.js
export const renderHeader = ({
  name = "amir hossein",
  avatar = "../images/image.png",
} = {}) => {
  // تشخیص greeting بر اساس ساعت
  const hour = new Date().getHours();
  let greeting;
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning 👋";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon 👋";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening 👋";
  } else {
    greeting = "Good Night 🌙";
  }

  return `
    <header class="bg-white h-20 flex w-full items-center justify-between px-6">
  
      <!-- بخش پروفایل (سمت چپ) -->
      <div class="flex items-center gap-4">
        <!-- دایره تصویر پروفایل -->
        <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0">
          <img src="${avatar}" alt="${name}" class="w-full h-full object-cover">
        </div>
  
        <!-- بخش متون -->
        <div class="flex flex-col justify-center">
          <div class="flex items-center gap-1">
            <span id="chang-mod" class="text-[#757475] text-base font-medium">${greeting}</span>
          </div>
          <h2 class="text-[#152536] font-bold text-base leading-tight">${name}</h2>
        </div>
      </div>
  
      <!-- بخش آیکون‌ها (سمت راست) -->
      <div class="flex items-center gap-4">
  
        <button class="text-gray-900 hover:scale-110 transition-transform" aria-label="Notifications">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-bell">
            <path d="M10.268 21a2 2 0 0 0 3.464 0" />
            <path
              d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
          </svg>
        </button>
  
        <a href="./wishlist/wishlist.html"><button class="text-gray-900 hover:scale-110 transition-transform" aria-label="Wishlist">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-heart">
            <path
              d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </button>
        </a>
      </div>
  
    </header>
    `;
};