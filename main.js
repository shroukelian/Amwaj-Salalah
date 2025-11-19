// main.js (Amwaj Salalah Store Logic)

let cart = {}; // Global object to hold cart items

// 1. Price/Unit Selector Logic (For the piece/carton feature)
function updatePrice(productId, piecePrice, cartonPrice) {
    const selector = document.getElementById(`unit-${productId}`);
    const priceDisplay = document.getElementById(`price-${productId}`);
    
    // Safety check for the element
    if (!selector || !priceDisplay) return;
    
    const unit = selector.value;
    let price = 0;

    // Prices are hardcoded here for front-end demo. In real app, they come from DB.
    if (unit === 'piece') {
        price = piecePrice;
    } else if (unit === 'carton') {
        price = cartonPrice;
    }

    priceDisplay.textContent = `${price.toFixed(3)} ر.ع`;
    // Update the button's stored price for accurate cart adding
    document.querySelector(`#product-${productId} .add-to-cart-btn`).dataset.price = price;
}

// 2. Add to Cart Logic
function addToCart(id, name, unitName) {
    const productCard = document.getElementById(`product-${id}`);
    const selector = productCard.querySelector(`#unit-${id}`);
    const button = productCard.querySelector('.add-to-cart-btn');

    const unitType = selector ? selector.value : 'piece'; 
    const key = `${id}-${unitType}`; 
    const price = parseFloat(button.dataset.price); // Get dynamic price from the button data-attribute

    if (isNaN(price)) {
        alert('حدث خطأ في تحديد السعر. يرجى تحديث الصفحة.');
        return;
    }
    
    if (cart[key]) {
        cart[key].quantity += 1;
    } else {
        cart[key] = {
            id,
            name,
            price,
            unit: unitType,
            quantity: 1,
            unitDisplay: selector ? selector.options[selector.selectedIndex].text : unitName
        };
    }
    
    updateCartDisplay();
    alert(`"${name}" (${cart[key].unitDisplay}) أُضيف إلى السلة!`);
}

// 3. Update Cart UI and Total Count
function updateCartDisplay() {
    let totalItems = 0;
    for (const key in cart) {
        totalItems += cart[key].quantity;
    }
    document.querySelector('.cart-count').textContent = totalItems;
    // You would typically open a cart modal here
}

// 4. Generate WhatsApp Message (THE KEY FEATURE)
function sendWhatsAppOrder() {
    if (Object.keys(cart).length === 0) {
        alert('سلة المشتريات فارغة. الرجاء إضافة منتجات قبل إرسال الطلب.');
        return;
    }
    
    const phoneNumber = '96896755118'; 
    let message = "✨ *السلام عليكم* ✨\nتكرما أرجو تجهيز الطلب الآتي 🛒\n\n🧾 *تفاصيل الطلب:*\n";
    let totalOverall = 0;

    for (const key in cart) {
        const item = cart[key];
        const itemTotal = item.quantity * item.price;
        totalOverall += itemTotal;

        message += `\n🔹 ${item.name} (${item.unitDisplay})
   الكمية: ${item.quantity}
   السعر: ${item.price.toFixed(3)} ر.ع
   المجموع: ${itemTotal.toFixed(3)} ر.ع
`;
    }

    message += `\n💰 *المجموع الإجمالي: ${totalOverall.toFixed(3)} ر.ع*`;
    message += `\n\n🙏 شكراً *بقالة أمواج صلالة* وموعدنا معكم في طلب قادم بإذن الله 💙`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
}

// 5. Utility Functions (Scroll to Top/Search/PWA)
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToCategoryPage() {
    window.location.href = 'ar_categories.html';
}

function handleSearch(event) {
    event.preventDefault(); 
    const query = document.getElementById('product-search').value.trim();

    if (query.length > 0) {
        // توجيه لصفحة المنتجات مع نتائج البحث (Products Search Results)
        // (ستحتاج لإنشاء هذه الصفحة products.html)
        window.location.href = `products.html?q=${encodeURIComponent(query)}`;
    } else {
        // إذا كان فارغاً، يمكن توجيهه إلى صفحة جميع الفئات
        goToCategoryPage();
    }
}

// Initializers
document.addEventListener('DOMContentLoaded', () => {
    // Initial Price Setup (for demo product)
    updatePrice('1', 1.350, 2.500);
    
    // Attach Search Handler
    const searchInput = document.getElementById('product-search');
    const searchForm = document.querySelector('.search-bar-container').closest('form');
    if(searchForm) {
        searchForm.addEventListener('submit', handleSearch);
    }
});
