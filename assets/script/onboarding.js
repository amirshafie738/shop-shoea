
/////////////////////////جلوگیری از ورود تکراری //////////////////////////
(function() {
    const hasSeenOnboarding = localStorage.getItem('onboarding_complete');

    if (hasSeenOnboarding === 'true') {
        // اگر قبلاً دیده، بفرستش صفحه بعد
        window.location.href = './assets/page/login.html';
    }
})();

/// take elment loading 
const splashScreenOnboarding = document.getElementById('splash-screen')
//emlmet onboarding page2 
const onboardingContentPage2 = document.getElementById('onboarding-content-page2')

//emlmet onboarding page3
const onboardingSlider = document.getElementById('onboarding-slider')

//////////////////////// loading ////////////////////////
setTimeout(() => {

    splashScreenOnboarding.classList.add('opacity-0')

    setTimeout(() => {
        splashScreenOnboarding.style.display = 'none'
        onboardingContentPage2.classList.remove('hidden');
        onboardingContentPage2.classList.add( 'animate-fade-in');
    }, 700)
}, 1000)
//////////////////////// Switch between page two and three ////////////////////////
onboardingContentPage2.addEventListener('click', () => {
    // اضافه کردن انیمیشن محوشدن
    onboardingContentPage2.classList.add('opacity-0', 'transition-opacity', 'duration-500');
    // hide page 2 and show page three
    setTimeout(() => {
        onboardingContentPage2.classList.add('hidden'); 
        // action on page 3 with settimeout
        onboardingSlider.classList.remove('hidden'); 
        onboardingSlider.classList.add('flex', 'animate-fade-in'); 
    }, 500);
});

//////////////////////// slider ////////////////////////
const swiper = new Swiper(".mySwiper", {
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  // برای اینکه کاربر نتواند به عقب برگردد
  allowTouchMove: true, 
});

// مدیریت دکمه‌های Next داخل اسلایدها
const nextButtons = document.querySelectorAll('.next-btn');
nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        swiper.slideNext(); // رفتن به اسلاید بعدی Swiper
    });
});

//////////////////////// switch to login html ////////////////////////
// دکمه نهایی
// پیدا کردن دکمه Get Started
const getStartedBtn = document.getElementById('get-started');

if (getStartedBtn) {
    getStartedBtn.addEventListener('click', () => {
        // ۱. ذخیره کردن اینکه کاربر Onboarding را دیده است
        localStorage.setItem('onboarding_complete', 'true');
        
        // ۲. انتقال به صفحه بعدی (مثلاً لاگین یا صفحه اصلی)
        window.location.href = './assets/page/login.html'; 
    });
}
