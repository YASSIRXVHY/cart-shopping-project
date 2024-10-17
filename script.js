document.addEventListener('DOMContentLoaded', function() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cart = document.querySelector('.cart');
    const popup = document.getElementById('orderConfirmationPopup');
    const startNewOrderButton = document.getElementById('startNewOrder');
    let cartItems = [];

    function updateCartDisplay() {
        cart.innerHTML = `<h2>Your Cart (${cartItems.length})</h2>`;

        if (cartItems.length === 0) {
            cart.innerHTML += `
                <div class="cart-empty">
                    <img src="images/illustration-empty-cart.svg" />
                    <p>Your added items will appear here</p>
                </div>
            `;
        } else {
            let cartContent = '';
            let total = 0;
            cartItems.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                cartContent += `
                    <div class="cart-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">${item.quantity}x $${item.price.toFixed(2)}</span>
                        <span class="item-total">$${itemTotal.toFixed(2)}</span>
                        <button class="remove-item" data-name="${item.name}">×</button>
                    </div>
                `;
            });
            cartContent += `
                <div class="order-total">Order Total <span>$${total.toFixed(2)}</span></div>
                <div class="carbon-neutral">
                    <img src="images/icon-carbon-neutral.svg" alt="Leaf icon">
                    This is a carbon-neutral delivery
                </div>
                <button class="confirm-order">Confirm Order</button>
            `;
            cart.innerHTML += cartContent;
        }

        // Add event listener to the confirm order button
        const confirmOrderButton = cart.querySelector('.confirm-order');
        if (confirmOrderButton) {
            confirmOrderButton.addEventListener('click', showOrderConfirmation);
        }
    }

    function createQuantityControl(productType, initialQuantity) {
        const quantityControl = document.createElement('div');
        quantityControl.className = 'quantity-control';
        quantityControl.innerHTML = `
            <button class="decrease"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
            </svg></button>
            <span class="quantity">${initialQuantity}</span>
            <button class="increase"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
            </svg></button>
        `;

        const decreaseButton = quantityControl.querySelector('.decrease');
        const increaseButton = quantityControl.querySelector('.increase');
        const quantitySpan = quantityControl.querySelector('.quantity');

        decreaseButton.addEventListener('click', () => updateQuantity(-1));
        increaseButton.addEventListener('click', () => updateQuantity(1));

        function updateQuantity(change) {
            let quantity = parseInt(quantitySpan.textContent);
            quantity = Math.max(1, quantity + change);
            quantitySpan.textContent = quantity;

            const itemName = productType.querySelector('h5').textContent;
            const itemIndex = cartItems.findIndex(item => item.name === itemName);
            if (itemIndex !== -1) {
                cartItems[itemIndex].quantity = quantity;
                updateCartDisplay();
            }
        }

        return quantityControl;
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productType = this.closest('.product-type');
            const name = productType.querySelector('h5').textContent;
            const price = parseFloat(productType.querySelector('h3').textContent.replace('$', ''));

            this.style.display = 'none';

            const quantityControl = createQuantityControl(productType, 1);
            productType.appendChild(quantityControl);

            cartItems.push({ name, price, quantity: 1 });
            updateCartDisplay();

            productType.querySelector('img').style.border = '2px solid #C73B0F';
        });
    });

    cart.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            const itemName = e.target.getAttribute('data-name');
            cartItems = cartItems.filter(item => item.name !== itemName);
            updateCartDisplay();

            // Reset the product display
            const productType = Array.from(document.querySelectorAll('.product-type')).find(el => el.querySelector('h5').textContent === itemName);
            if (productType) {
                productType.querySelector('.quantity-control').remove();
                productType.querySelector('.add-to-cart').style.display = 'block';
                productType.querySelector('img').style.border = 'none';
            }
        }
    });

    function showOrderConfirmation() {
        const orderSummary = document.getElementById('orderSummary');
        orderSummary.innerHTML = '';

        let total = 0;
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const itemDiv = document.createElement('div');
            itemDiv.innerHTML = `
                <span>${item.name}</span>
                <span>${item.quantity}x $${item.price.toFixed(2)}</span>
                <span>$${itemTotal.toFixed(2)}</span>
            `;
            orderSummary.appendChild(itemDiv);
        });

        const totalDiv = document.createElement('div');
        totalDiv.className = 'order-total';
        totalDiv.innerHTML = `
            <span>Order Total</span>
            <span>$${total.toFixed(2)}</span>
        `;
        orderSummary.appendChild(totalDiv);

        popup.style.display = 'block';
    }

    startNewOrderButton.addEventListener('click', function() {
        popup.style.display = 'none';
        cartItems = [];
        updateCartDisplay();

        // Reset all product displays
        document.querySelectorAll('.product-type').forEach(productType => {
            const quantityControl = productType.querySelector('.quantity-control');
            if (quantityControl) {
                quantityControl.remove();
            }
            productType.querySelector('.add-to-cart').style.display = 'block';
            productType.querySelector('img').style.border = 'none';
        });
    });

    updateCartDisplay();
});