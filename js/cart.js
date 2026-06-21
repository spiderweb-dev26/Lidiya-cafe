let cart = JSON.parse(localStorage.getItem('lidiyaCart')) || [];

function saveCart() {
    localStorage.setItem('lidiyaCart', JSON.stringify(cart));
    updateCartUI();
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    saveCart();
    showNotification(`${item.name} added to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
}

function updateQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
        }
    }
}

function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
    return cart.reduce((count, item) => count + item.quantity, 0);
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) cartCount.textContent = getCartCount();
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p style="color: var(--coffee-brown); font-weight: bold;">$${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">×</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotal) cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    if (cartSidebar) cartSidebar.classList.toggle('open');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `position: fixed; top: 100px; right: 20px; background: rgba(107, 68, 35, 0.95); color: white; padding: 15px 25px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); z-index: 3000;`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
});