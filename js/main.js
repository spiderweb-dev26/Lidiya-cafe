// Menu Data - Placeholder items (you'll update Tuesday)
const menuData = [
    { id: 1, name: "Espresso", category: "coffee", price: 3.50, description: "Rich and bold single shot", image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop" },
    { id: 2, name: "Cappuccino", category: "coffee", price: 4.50, description: "Espresso with steamed milk foam", image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop" },
    { id: 3, name: "Croissant", category: "pastries", price: 3.00, description: "Buttery, flaky French pastry", image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop" },
    { id: 4, name: "Margherita Pizza", category: "pizza", price: 12.99, description: "Fresh mozzarella, basil, tomato sauce", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop" },
    { id: 5, name: "Club Sandwich", category: "sandwiches", price: 9.99, description: "Turkey, bacon, lettuce, tomato", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=300&fit=crop" },
    { id: 6, name: "Latte", category: "coffee", price: 4.75, description: "Smooth espresso with steamed milk", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop" }
];

// Display menu items
function displayMenu(items, containerId = 'menuGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="menu-item glass-card">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="description">${item.description}</p>
                <p class="price">$${item.price.toFixed(2)}</p>
                <button class="glass-button primary add-to-cart-btn" onclick='addToCart(${JSON.stringify(item)})'>Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Filter menu by category
function filterMenu(category) {
    const filtered = category === 'all' ? menuData : menuData.filter(item => item.category === category);
    displayMenu(filtered);
    
    // Update active button
    document.querySelectorAll('.active-category').forEach(btn => btn.classList.remove('active-category'));
    event.target.classList.add('active-category');
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Display featured items on homepage
    if (document.getElementById('featuredItems')) {
        displayMenu(menuData.slice(0, 4), 'featuredItems');
    }
    
    // Display full menu on menu page
    if (document.getElementById('menuGrid')) {
        displayMenu(menuData);
    }
});

// Contact form handler
function handleContactSubmit(event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    event.target.reset();
}