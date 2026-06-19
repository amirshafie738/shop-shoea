// آدرس پایه سرور (Base URL)
// همه درخواست‌های API به این آدرس اضافه می‌شوند
const BASE_URL = "http://localhost:3000";

// تابع مرکزی برای ارسال همه درخواست‌های HTTP
// endpoint → مسیر API مثل /products
// options → تنظیمات اضافی مثل method ،body ،headers
const request = async (endpoint, options = {}) => {

  // ساخت تنظیمات نهایی برای fetch
  const config = {

    // تمام option هایی که کاربر داده (method, body, signal ...)
    ...options,

    // تعریف هدرها
    headers: {

      // مشخص می‌کنیم داده‌هایی که ارسال می‌کنیم JSON هستند
      "Content-Type": "application/json",

      // اگر هدر سفارشی ارسال شده باشد (مثلا Authorization)
      // به اینجا اضافه می‌شود
      ...options.headers,
    },
  };

  // ارسال درخواست واقعی به سرور
  // آدرس نهایی = BASE_URL + endpoint
  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  // اگر status خارج از بازه 200 تا 299 باشد یعنی خطا رخ داده
  if (!response.ok) {

    // متغیر برای نگه داشتن بدنه خطا
    let errorBody = null;

    try {
      // تلاش می‌کنیم پیام خطا که سرور برگردانده را بخوانیم
      errorBody = await response.json();
    } catch {
      // اگر بدنه خالی یا غیر JSON باشد
      // خطا را نادیده می‌گیریم
    }

    // ساخت یک Error جدید
    const error = new Error(
      // اگر سرور message داده همان را نشان بده
      // وگرنه status را نمایش بده
      errorBody?.message || `Request failed: ${response.status}`
    );

    // اضافه کردن status به شیء خطا
    error.status = response.status;

    // ذخیره بدنه کامل خطا
    error.body = errorBody;

    // پرتاب خطا تا در try/catch بیرون گرفته شود
    throw error;
  }

  // اگر پاسخ 204 باشد یعنی No Content
  // یعنی هیچ داده‌ای برای برگرداندن وجود ندارد
  if (response.status === 204) {
    return null;
  }

  // ابتدا پاسخ را به صورت متن می‌خوانیم
  const text = await response.text();

  // اگر متن وجود داشت آن را به JSON تبدیل می‌کنیم
  // اگر نبود null برمی‌گردانیم
  return text ? JSON.parse(text) : null;
};



// --------------------
// توابع کمکی برای استفاده در بقیه پروژه
// --------------------


// درخواست GET
// برای دریافت داده از سرور
export const get = (endpoint, options = {}) => {

  // فقط request را صدا می‌زنیم
  return request(endpoint, options);
};



// درخواست POST
// برای ساخت یک داده جدید در سرور
// data → آبجکت جاوااسکریپتی که می‌خواهیم ارسال کنیم
export const post = (endpoint, data, options = {}) => {

  return request(endpoint, {

    // حفظ options های اضافی
    ...options,

    // تعیین نوع درخواست
    method: "POST",

    // تبدیل object جاوااسکریپت به JSON string
    body: JSON.stringify(data),
  });
};



// درخواست PUT
// برای آپدیت کامل یک داده در سرور
export const put = (endpoint, data, options = {}) => {

  return request(endpoint, {

    ...options,

    // نوع درخواست
    method: "PUT",

    // تبدیل داده به JSON
    body: JSON.stringify(data),
  });
};



// درخواست DELETE
// برای حذف داده از سرور
export const remove = (endpoint, options = {}) => {

  return request(endpoint, {

    ...options,

    // نوع درخواست حذف
    method: "DELETE",
  });
};
