let deliveryMethod = 'pickup';
let paymentMethod = 'card';

function selectDelivery(method) {
    deliveryMethod = method;
    window.deliveryMethod = method;
    
    document.getElementById('pickupOption').classList.toggle('selected', method === 'pickup');
    document.getElementById('deliveryOption').classList.toggle('selected', method === 'delivery');
    
    document.getElementById('deliveryAddress').style.display = method === 'delivery' ? 'block' : 'none';
    document.getElementById('pickupTime').style.display = method === 'pickup' ? 'block' : 'none';
    
    // Update order summary
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
}

function selectPayment(method) {
    paymentMethod = method;
    document.getElementById('cardPayment').classList.toggle('selected', method === 'card');
    document.getElementById('cashPayment').classList.toggle('selected', method === 'cash');
    document.getElementById('digitalPayment').classList.toggle('selected', method === 'digital');
}

function handleOrderSubmit(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('lidiyaCart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }
    
    alert(`Order placed successfully! \n\nDelivery: ${deliveryMethod}\nPayment: ${paymentMethod}\nTotal: $${(getCartTotal() + (deliveryMethod === 'delivery' ? 3.99 : 0)).toFixed(2)}\n\nThank you for ordering from Lidiya Cafe!`);
    
    // Clear cart after successful order
    localStorage.removeItem('lidiyaCart');
    window.location.href = 'index.html';
}