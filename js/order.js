// Global variables for order state
let deliveryMethod = 'pickup';
let paymentMethod = 'card';

// Handle Delivery Selection UI
function selectDelivery(method) {
    deliveryMethod = method;
    document.getElementById('pickupOption').classList.toggle('selected', method === 'pickup');
    document.getElementById('deliveryOption').classList.toggle('selected', method === 'delivery');
    
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

// Cart Helpers
function getCartTotal() {
    const cart = JSON.parse(localStorage.getItem('lidiyaCart')) || [];
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getFormattedOrderText() {
    if (window.currentOrderData) {
        const d = window.currentOrderData;
        let text = `*New Order from Lidiya Cafe*%0A`;
        text += `Name: ${d.name}%0A`;
        text += `Phone: ${d.phone}%0A`;
        text += `Type: ${d.type === 'delivery' ? 'Delivery' : 'Pickup'}%0A`;
        if (d.type === 'delivery') text += `Address: ${d.address}%0A`;
        text += `Payment: ${d.payment}%0A%0A`;
        text += `*Order Details:*%0A`;
        d.items.forEach(item => {
            text += `- ${item.quantity}x ${item.name} (${item.price} ETB)%0A`;
        });
        text += `%0A*Total: ${d.total} ETB*`;
        if (d.notes) text += `%0ANotes: ${d.notes}`;
        return text;
    }
    return "New order from Lidiya Cafe!";
}

// Main Order Submission Handler
function handleOrderSubmit(event) {
    event.preventDefault();
    
    const cart = JSON.parse(localStorage.getItem('lidiyaCart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }

    window.currentOrderData = {
        name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        address: deliveryMethod === 'delivery' ? document.getElementById('address').value : 'In-store Pickup',
        payment: paymentMethod,
        notes: document.getElementById('notes').value,
        items: cart,
        total: getCartTotal() + (deliveryMethod === 'delivery' ? 50 : 0), // Delivery fee in ETB
        type: deliveryMethod
    };

    if (paymentMethod === 'digital') {
        payWithChapa(window.currentOrderData);
    } else {
        // Save the receipt text to memory
        localStorage.setItem('lidiyaPendingMessage', getFormattedOrderText());
        // Bypass the modal and instantly trigger the SMS for Cash/Pickup
        sendSMS();
    }
}

// Connect to Codespaces backend
async function payWithChapa(orderData) {
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.textContent = 'Connecting to Chapa...';
        submitBtn.disabled = true;

        const nameParts = orderData.name.split(' ');

        const response = await fetch('https://lidiya-payment-server.onrender.com/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: orderData.total,
                email: orderData.email,
                first_name: nameParts[0] || 'Customer',
                last_name: nameParts.slice(1).join(' ') || 'Name'
            })
        });

        const data = await response.json();

        if (data.checkout_url) {
            // Save the receipt text to memory before leaving the page
            localStorage.setItem('lidiyaPendingMessage', getFormattedOrderText());
            
            localStorage.removeItem('lidiyaCart');
            window.location.href = data.checkout_url;
        } else {
            throw new Error('No checkout URL received');
        }

    } catch (error) {
        console.error('Payment Error:', error);
        alert('Could not connect to the payment gateway.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Action: Automatically Send via SMS
function sendSMS() {
    const phoneNumber = "0983064449"; // Your specific number
    const baseText = localStorage.getItem('lidiyaPendingMessage') || getFormattedOrderText();
    
    // Clean up the text format for standard SMS
    const rawText = baseText.replace(/%0A/g, '\n').replace(/\*/g, '');
    
    // Trigger the SMS app with the number and message
    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(rawText)}`;
    
    finalizeOrderProcess();
}

// Cleanup & Redirect
function finalizeOrderProcess() {
    localStorage.removeItem('lidiyaCart');
    localStorage.removeItem('lidiyaPendingMessage');
    
    // Increased delay slightly to give the phone time to switch to the SMS app
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// Catch successful returns from Chapa to trigger the SMS automatically
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('status') === 'success') {
        // Wait just a brief moment to ensure the page has loaded, then fire SMS
        setTimeout(() => {
            sendSMS();
        }, 500);
    }
});
