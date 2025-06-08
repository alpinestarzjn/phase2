
document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.pro');
            const productName = product.querySelector('h5').textContent;
            const productPrice = parseFloat(product.querySelector('h4').textContent.replace('Rs.', ''));
            const productImage = product.querySelector('img').src;

            addToCart({
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

          
            sessionStorage.setItem('itemAdded', 'true');
            window.location.href = 'cart.html';
        });
    });

    
    function addToCart(item) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.name === item.name && cartItem.price === item.price
        );

        if (existingItemIndex >= 0) {
            
            cart[existingItemIndex].quantity += 1;
        } else {
            
            cart.push(item);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
    }
});


const mobile = document.getElementById('mobile');
const navbar = document.getElementById('navbar');

if (mobile && navbar) {
    mobile.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
}


const navLinks = document.querySelectorAll('#navbar li a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
    });
});

