// /////////////////////////جلوگیری از ورود تکراری //////////////////////////
if (localStorage.getItem("rememberMe") === "true") {
    window.location.href = '../page/Home.html';
}

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");

const signInBtn = document.getElementById("signInBtn");

const emailWrapper = document.getElementById("emailWrapper");
const passwordWrapper = document.getElementById("passwordWrapper");

const eyeIcon = document.getElementById("eye-icon");

const rememberMe = document.getElementById("rememberMe");



// ۲. فوکوس و بلر فیلدها
const handleFocus = (wrapper, icon) => {
    wrapper.classList.replace('border-transparent', 'border-black');
    wrapper.classList.replace('bg-gray-50', 'bg-white');
    if (icon) icon.classList.replace('text-gray-400', 'text-black');
};



const handleBlur = (wrapper, icon) => {
    wrapper.classList.replace('border-black', 'border-transparent');
    wrapper.classList.replace('bg-white', 'bg-gray-50');
    if (icon) icon.classList.replace('text-black', 'text-gray-400');
};


emailInput.addEventListener('focus', () => handleFocus(emailWrapper));
emailInput.addEventListener('blur', () => handleBlur(emailWrapper));


passwordInput.addEventListener('focus', () => handleFocus(passwordWrapper, eyeIcon));
passwordInput.addEventListener('blur', () => handleBlur(passwordWrapper, eyeIcon));

// ۳. بررسی پر بودن فیلدها برای فعال کردن دکمه
function checkFields() {
    const isFilled = emailInput.value.trim().length > 0 && passwordInput.value.trim().length > 0;
    if (isFilled) {
        signInBtn.disabled = false;
        signInBtn.classList.replace('bg-gray-400', 'bg-black');
    } else {
        signInBtn.disabled = true;
        signInBtn.classList.replace('bg-black', 'bg-gray-400');
    }
}

emailInput.addEventListener("input", checkFields);
passwordInput.addEventListener("input", checkFields);

// ۴. نمایش/مخفی کردن پسورد
function togglePassword() {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
}

// ۵. برگشت به صفحه قبل
function goBack() {
    window.history.back();
}

// ۶. کلیک نهایی لاگین
signInBtn.addEventListener('click', () => {

    // اگه Remember Me تیک داشت، ذخیره کن
    if (rememberMe.checked) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("userEmail", emailInput.value.trim());
    } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("userEmail");
    }


    console.log("Logging in with:", emailInput.value);
    window.location.href = '../page/Home.html';
});