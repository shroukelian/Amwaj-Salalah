// main.js (FINAL UNIFIED VERSION)

let cart = {}; // Global object for cart items

// ---------------------------------------------------
// 1. UTILITY FUNCTIONS (TOAST, SCROLL, PWA)
// ---------------------------------------------------

// Function to show the custom Toast Notification
function showToast(message) {
    const toast = document.getElementById('custom-toast');
    const toastMessage = document.getElementById('toast-message');

    if (!toast || !toastMessage) {
        // Fallback to console error if Toast HTML is missing
        console.error("Toast element not found. Cannot display notification.");
        return; 
    }

    toastMessage.textContent = message;
    
    // Reset and Show Logic (for animation restart)
    toast.classList.remove('show');
    setTimeout(() => {
        toast.classList.add('show');
    }, 10); 

    // Hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('product-search').value.trim();

    if (query.length > 0) {
        window.location.href = `products.html?q=${encodeURIComponent(query)}`;
    } else {
        window.location.href = 'ar_categories.html'; 
    }
}

// ---------------------------------------------------
// 2. PRODUCT LOGIC (PRICE, QUANTITY, CART)
// ---------------------------------------------------

// Updates price display and stores it in the button's data-price
function updatePrice(productId, piecePrice, cartonPrice, originalPriceValue = null) {
    const productCard = document.getElementById(`product-${productId}`);
    if (!productCard) return; 

    const selector = productCard.querySelector(`#unit-${productId}`);
    const priceSection = productCard.querySelector('.price-section');
    const currentPriceDisplay = productCard.querySelector('.current-price');
    const originalPriceDisplay = productCard.querySelector('.original-price');
    const button = productCard.querySelector('.add-to-cart-btn');

    const unit = selector.value;
    let price = (unit === 'piece') ? piecePrice : cartonPrice;

    // Set Price Display
    currentPriceDisplay.textContent = `${price.toFixed(3)} ر.ع`;
    
    // Set Discount Price Display
    if (originalPriceValue && originalPriceDisplay) {
        originalPriceDisplay.textContent = `${originalPriceValue.toFixed(3)} ر.ع`;
        // Check if there is a real discount
        originalPriceDisplay.style.display = (price < originalPriceValue) ? 'block' : 'none';
    } else if (originalPriceDisplay) {
        originalPriceDisplay.style.display = 'none';
    }
    
    // Store price in the button's data-attribute
    button.dataset.price = price.toFixed(3);
}

// Updates quantity display on the product card (+ and - buttons)
function updateQuantity(productId, action) {
    const qtyDisplay = document.getElementById(`qty-${productId}`);
    let currentQty = parseInt(qtyDisplay.textContent);

    if (action === 'increment') {
        currentQty += 1;
    } else if (action === 'decrement' && currentQty > 0) {
        currentQty -= 1;
    }
    
    qtyDisplay.textContent = currentQty;
}

// Adds items to the cart using the quantity set on the card
function addToCart(productId) {
    const productCard = document.getElementById(`product-${productId}`);
    const selector = productCard.querySelector(`#unit-${productId}`);
    const button = productCard.querySelector('.add-to-cart-btn');
    const qtyInput = productCard.querySelector('.qty-display');

    const quantity = parseInt(qtyInput.textContent);
    const price = parseFloat(button.dataset.price); 
    const name = productCard.querySelector('h4').textContent.trim();
    const unitType = selector.value;
    const key = `${productId}-${unitType}`; 

    if (quantity <= 0) {
        showToast('الرجاء تحديد الكمية المطلوبة.');
        return;
    }

    if (isNaN(price)) {
        showToast('خطأ: السعر غير محدد.');
        return;
    }

    // Cart Logic
    if (cart[key]) {
        cart[key].quantity += quantity;
    } else {
        cart[key] = {
            id: productId,
            name: name,
            price: price,
            unit: unitType,
            quantity: quantity,
            unitDisplay: selector.options[selector.selectedIndex].text
        };
    }
    
    // Reset quantity on card and update cart UI
    qtyInput.textContent = 0;
    updateCartDisplay();
    showToast(`تم إضافة ${quantity} وحدة من "${name}" إلى السلة.`);
}

// Updates the cart icon count
function updateCartDisplay() {
    let totalItems = 0;
    for (const key in cart) {
        totalItems += cart[key].quantity;
    }
    document.querySelector('.cart-count').textContent = totalItems;
}


// ---------------------------------------------------
// 3. INITIALIZERS
// ---------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // Determine if we are on the product page to initialize prices
    const urlParams = new URLSearchParams(window.location.search);
    const isProductPage = document.URL.includes('products.html');
    
    if (isProductPage) {
        // Example: Initialize prices for product 3 & 4 on products.html
        updatePrice('3', 0.500, 5.500); 
        updatePrice('4', 1.200, 10.000); 

        // Example: Logic for displaying the correct category name (fix)
        const categorySlug = urlParams.get('category');
        let categoryName = "جميع المنتجات";
        if (categorySlug === 'dairy') categoryName = "الألبان والأجبان";
        if (categorySlug === 'meat') categoryName = "اللحوم والدواجن";
        if (categorySlug === 'drinks') categoryName = "العصائر والمشروبات";
        if (categorySlug === 'snacks') categoryName = "الوجبات الخفيفة";
        
        const nameDisplay = document.getElementById('category-name-display');
        if(nameDisplay) nameDisplay.textContent = categoryName;

    } else {
        // Initialize prices for product 1, 2, and best-1 on index.html
        updatePrice('1', 1.350, 2.500, 1.500); // Ex: with discount price
        updatePrice('2', 0.150, 1.500); 
        updatePrice('best-1', 1.350, 2.500);
    }
});
// main.js - إضافة دالة liveSearch (جاهزة للـ AJAX)

function liveSearch(query) {
    const resultsDiv = document.getElementById('live-search-results');
    const minLength = 3; // الحد الأدنى لعدد الأحرف

    if (query.length >= minLength) {
        // **********************************************
        // * هذا هو المكان الذي سيقوم فيه مطور الباك-إند *
        // * بوضع كود AJAX لجلب المنتجات المشابهة من قاعدة البيانات *
        // **********************************************
        
        // محاكاة لنتائج البحث (يجب استبدالها بـ AJAX/Fetch API)
        const dummyResults = [
            `منتج مشابه: ${query} (1.500 ر.ع)`,
            `فئة: ${query} للمشروبات`,
            `زيتون بـ ${query}`
        ];

        // عرض النتائج
        resultsDiv.innerHTML = dummyResults.map(item => 
            `<div style="padding: 10px 15px; border-bottom: 1px solid #EEE; cursor: pointer;" 
                  onclick="selectSearchResult('${item.replace(/'/g, "\\'")}')">${item}</div>`
        ).join('');
        
        resultsDiv.style.display = 'block';

    } else {
        resultsDiv.style.display = 'none';
        resultsDiv.innerHTML = '';
    }
}

// دالة لمعالجة النقر على النتيجة (اختياري)
function selectSearchResult(resultText) {
    const searchInput = document.getElementById('product-search');
    searchInput.value = resultText.split(':')[0].trim(); // يضع اسم المنتج في حقل البحث
    document.getElementById('live-search-results').style.display = 'none';
}
// main.js - داخل دالة DOMContentLoaded

document.addEventListener('DOMContentLoaded', () => {
    // ... (Your existing code) ...
    
    if (isProductPage) {
        // ... (product page initialization) ...
    } else {
        // Initialize prices for product 1, 2, and best-1 on index.html
        updatePrice('1', 1.350, 2.500, 1.500); 
        updatePrice('2', 0.150, 1.500); 
        updatePrice('best-1', 1.350, 2.500); // <--- تأكد من وجود هذا السطر
    }
});