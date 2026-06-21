// Global variables for order state
let deliveryMethod = 'pickup';
let paymentMethod = 'card';

// Handle Delivery Selection UI
function selectDelivery(method) {
    deliveryMethod = method;
    
    // Update UI classes
    document.getElementById('pickupOption').classList.toggle('selected', method === 'pickup');
    document.getElementById('deliveryOption').classList.toggle('selected', method === 'delivery');
    
    // Toggle Address/Time fields
    const addrField = document.getElementById('deliveryAddress');
    const timeField = document.getElementById('pickupTime');
    
    if (method === 'delivery') {
        addrField.style.display = 'block';
        timeField.style.display = 'none';
        document.getElementById('address').required = true;
    } else {
        addrField.style.display = 'none';
        timeField.style.display = 'block';
        document.getElementById('address').required = false;
    }
}

// Handle Payment Selection UI
function selectPayment(method) {
    paymentMethod = method;
    document.getElementById('cardPayment').classList.toggle('selected', method === 'card');
    document.getElementById('cashPayment').classList.toggle('selected', method === 'cash');
    document.getElementById('digitalPayment').classList.toggle('selected', method === 'digital');
}

// Main Order Submission Handler
function handleOrderSubmit(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('lidiyaCart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }

    // Gather all data into a single object
    window.currentOrderData = {
        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: deliveryMethod === 'delivery' ? document.getElementById('address').value : 'In-store Pickup',
        payment: paymentMethod,
        notes: document.getElementById('notes').value,
        items: cart,
        total: getCartTotal() + (deliveryMethod === 'delivery' ? 3.99 : 0),
        type: deliveryMethod
    };

    // Show the custom Glass Modal instead of browser alert
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    }
}

// Helper: Format text for WhatsApp (with bolding)
function getFormattedOrderText() {
    if (!window.currentOrderData) return '';
    const o = window.currentOrderData;
    
    let text = `*NEW ORDER - LIDIYA CAFE* %0A`;
    text += `---------------------------%0A`;
    text += `*Customer:* ${o.name}%0A`;
    text += `*Phone:* ${o.phone}%0A`;
    text += `*Type:* ${o.type.toUpperCase()}%0A`;
    if (o.type === 'delivery') text += `*Address:* ${o.address}%0A`;
    text += `*Payment:* ${o.payment.toUpperCase()}%0A`;
    if (o.notes) text += `*Notes:* ${o.notes}%0A`;
    text += `---------------------------%0A`;
    text += `*ORDER ITEMS:*%0A`;
    
    o.items.forEach(item => {
        text += `- ${item.quantity}x ${item.name} ($${(item.price * item.quantity).toFixed(2)})%0A`;
    });
    
    text += `---------------------------%0A`;
    text += `*TOTAL AMOUNT: $${o.total.toFixed(2)}*`;
    return text;
}

// Action: Send via WhatsApp
function sendWhatsApp() {
    // ️ REPLACE THIS WITH YOUR ACTUAL BUSINESS NUMBER
    // Format: CountryCode + Number (No + sign, no dashes)
    // Example: 15551234567
    const phoneNumber = "15550000000"; 
    
    const text = getFormattedOrderText();
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    
    window.open(url, '_blank');
    finalizeOrderProcess();
}

// Action: Send via SMS/Messages
function sendSMS() {
    // Clean text for SMS (remove markdown asterisks)
    const rawText = getFormattedOrderText().replace(/%0A/g, '\n').replace(/\*/g, '');
    
    // Universal SMS scheme
    window.location.href = `sms:?body=${encodeURIComponent(rawText)}`;
    finalizeOrderProcess();
}

// Cleanup & Redirect
function finalizeOrderProcess() {
    localStorage.removeItem('lidiyaCart');
    closeOrderModal();
    
    // Small delay to allow app to open before redirecting
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 800);
}

// Close Modal Logic
function closeOrderModal() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}
