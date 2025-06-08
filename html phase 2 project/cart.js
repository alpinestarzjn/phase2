document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTable = document.getElementById('cart-table');
    const cartCount = document.getElementById('cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const shippingCost = document.getElementById('shipping-cost');
    const discountAmount = document.getElementById('discount-amount');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const applyCouponBtn = document.getElementById('apply-coupon');
    const couponMessage = document.getElementById('coupon-message');
    
    let discount = 0;
    const shippingFee = 50;
    
    // Available coupons
    const coupons = {
        'FRESH10': 0.1,  // 10% off
        'FARM20': 0.2,   // 20% off
        'WELCOME15': 0.15 // 15% off
    };
    
    // Display cart items
    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTable.style.display = 'none';
            cartCount.textContent = '0';
        } else {
            emptyCartMessage.style.display = 'none';
            cartTable.style.display = 'table';
            cartCount.textContent = cart.length;
            
            cart.forEach((item, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><i class="fas fa-times-circle remove-item" data-index="${index}"></i></td>
                    <td><img src="${item.image}" alt="${item.name}"></td>
                    <td>${item.name}</td>
                    <td>Rs.${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-control">
                            <button class="decrease-qty" data-index="${index}">-</button>
                            <input type="number" class="item-qty" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="increase-qty" data-index="${index}">+</button>
                        </div>
                    </td>
                    <td>Rs.${(item.price * item.quantity).toFixed(2)}</td>
                `;
                cartItemsContainer.appendChild(row);
            });
        }
        
        calculateTotals();
    }
    
    // Calculate cart totals
    function calculateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountValue = subtotal * discount;
        const total = subtotal - discountValue + shippingFee;
        
        cartSubtotal.textContent = `Rs.${subtotal.toFixed(2)}`;
        discountAmount.textContent = `-Rs.${discountValue.toFixed(2)}`;
        cartTotal.textContent = `Rs.${total.toFixed(2)}`;
        
        // Update cart count in header
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    // Remove item from cart
    function removeItem(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
    
    // Update item quantity
    function updateQuantity(index, newQuantity) {
        if (newQuantity < 1) newQuantity = 1;
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }
    
    // Apply coupon
    function applyCoupon(code) {
        if (coupons[code]) {
            discount = coupons[code];
            couponMessage.textContent = `Coupon applied! ${discount * 100}% off`;
            couponMessage.style.color = '#088178';
            calculateTotals();
        } else {
            discount = 0;
            couponMessage.textContent = 'Invalid coupon code';
            couponMessage.style.color = '#ff6b6b';
            calculateTotals();
        }
    }
    
    // Event listeners
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const index = e.target.getAttribute('data-index');
            removeItem(index);
        }
        
        if (e.target.classList.contains('decrease-qty')) {
            const index = e.target.getAttribute('data-index');
            const newQty = cart[index].quantity - 1;
            updateQuantity(index, newQty);
        }
        
        if (e.target.classList.contains('increase-qty')) {
            const index = e.target.getAttribute('data-index');
            const newQty = cart[index].quantity + 1;
            updateQuantity(index, newQty);
        }
    });
    
    cartItemsContainer.addEventListener('change', function(e) {
        if (e.target.classList.contains('item-qty')) {
            const index = e.target.getAttribute('data-index');
            const newQty = parseInt(e.target.value);
            updateQuantity(index, newQty);
        }
    });
    
    applyCouponBtn.addEventListener('click', function() {
        const couponCode = document.getElementById('coupon-code').value.trim();
        applyCoupon(couponCode);
    });
    
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        alert('Proceeding to checkout!');
        
    });
    
  
    displayCartItems();
    
    
    if (sessionStorage.getItem('itemAdded')) {
        cartCount.classList.add('animate-bounce');
        setTimeout(() => {
            cartCount.classList.remove('animate-bounce');
        }, 1000);
        sessionStorage.removeItem('itemAdded');
    }
});