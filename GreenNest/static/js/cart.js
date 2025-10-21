/* ==========================================
   CART PAGE - FUNCTIONALITY
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeCart();
});

function initializeCart() {
    // Quantity Controls
    setupQuantityControls();
    
    // Remove Item Buttons
    setupRemoveButtons();
    
    // Clear Cart Button
    setupClearCart();
    
    // Discount Code
    setupDiscountCode();
    
    // Add Recommended Items
    setupRecommendedItems();
    
    // Update Total on Load
    updateCartTotal();
}

// ==================== QUANTITY CONTROLS ====================
function setupQuantityControls() {
    const qtyButtons = document.querySelectorAll('.qty-btn');
    
    qtyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.dataset.action;
            const input = this.parentElement.querySelector('.qty-input');
            let value = parseInt(input.value);
            
            if (action === 'increase' && value < 10) {
                value++;
            } else if (action === 'decrease' && value > 1) {
                value--;
            }
            
            input.value = value;
            updateCartTotal();
            
            // Animation feedback
            animateQuantityChange(this);
        });
    });
    
    // Direct input change
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
            updateCartTotal();
        });
    });
}

function animateQuantityChange(button) {
    button.style.transform = 'scale(1.3)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// ==================== REMOVE ITEM ====================
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.btn-remove');
    
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            
            // Confirm dialog
            if (confirm('Are you sure you want to remove this item?')) {
                removeItemWithAnimation(cartItem);
            }
        });
    });
}

function removeItemWithAnimation(item) {
    item.style.transform = 'translateX(-100%)';
    item.style.opacity = '0';
    
    setTimeout(() => {
        item.remove();
        updateCartTotal();
        updateItemCount();
        checkEmptyCart();
    }, 300);
}

// ==================== CLEAR CART ====================
function setupClearCart() {
    const clearBtn = document.querySelector('.clear-cart-btn');
    
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your entire cart?')) {
                const cartItems = document.querySelectorAll('.cart-item');
                cartItems.forEach((item, index) => {
                    setTimeout(() => {
                        removeItemWithAnimation(item);
                    }, index * 100);
                });
            }
        });
    }
}

// ==================== DISCOUNT CODE ====================
function setupDiscountCode() {
    const applyBtn = document.querySelector('.btn-apply-discount');
    const discountInput = document.querySelector('.discount-input');
    const discountRow = document.querySelector('.discount-applied');
    
    if (applyBtn && discountInput) {
        applyBtn.addEventListener('click', function() {
            const code = discountInput.value.trim().toUpperCase();
            
            if (code === 'SAVE10') {
                // Show discount
                if (discountRow) {
                    discountRow.style.display = 'flex';
                }
                
                // Update total
                updateCartTotal(true);
                
                // Show success message
                showNotification('Discount code applied! 🎉', 'success');
                
                // Clear input
                discountInput.value = '';
            } else if (code) {
                showNotification('Invalid discount code', 'error');
            }
        });
        
        // Enter key support
        discountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyBtn.click();
            }
        });
    }
}

// ==================== RECOMMENDED ITEMS ====================
function setupRecommendedItems() {
    const addButtons = document.querySelectorAll('.btn-add-rec');
    
    addButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.recommended-card');
            const productName = card.querySelector('p').textContent;
            
            // Animation
            this.innerHTML = '<i class="lni lni-checkmark"></i> Added';
            this.style.background = 'var(--primary-color)';
            this.style.color = 'var(--white)';
            
            setTimeout(() => {
                this.innerHTML = 'Add +';
                this.style.background = 'var(--accent-yellow)';
                this.style.color = 'var(--black)';
            }, 2000);
            
            showNotification(`${productName} added to cart!`, 'success');
        });
    });
}

// ==================== UPDATE CART TOTAL ====================
function updateCartTotal(applyDiscount = false) {
    const items = document.querySelectorAll('.cart-item');
    let subtotal = 0;
    let itemCount = 0;
    
    items.forEach(item => {
        const price = parseFloat(
            item.querySelector('.item-price').textContent.replace('$', '')
        );
        const qty = parseInt(
            item.querySelector('.qty-input').value
        );
        
        subtotal += price * qty;
        itemCount += qty;
    });
    
    const tax = subtotal * 0.1;
    let total = subtotal + tax;
    
    // Apply discount if code is active
    if (applyDiscount) {
        const discount = subtotal * 0.1;
        total -= discount;
        
        // Update discount amount display
        const discountAmountEl = document.querySelector('.discount-amount');
        if (discountAmountEl) {
            discountAmountEl.textContent = `-$${discount.toFixed(2)}`;
        }
    }
    
    // Update display
    document.querySelector('.summary-row .amount').textContent = 
        `$${subtotal.toFixed(2)}`;
    document.querySelector('.summary-row:nth-child(3) .amount').textContent = 
        `$${tax.toFixed(2)}`;
    document.querySelector('.total-amount').textContent = 
        `$${total.toFixed(2)} USD`;
    
    // Update item count
    updateItemCount(itemCount);
}

function updateItemCount(count) {
    if (!count) {
        const items = document.querySelectorAll('.cart-item');
        count = 0;
        items.forEach(item => {
            count += parseInt(item.querySelector('.qty-input').value);
        });
    }
    
    const itemCountEl = document.querySelector('.item-count');
    if (itemCountEl) {
        itemCountEl.textContent = `${count} items`;
    }
    
    // Update header badge
    const headerBadge = document.querySelector('.cart-wrapper .badge');
    if (headerBadge) {
        headerBadge.textContent = count;
    }
}

// ==================== CHECK EMPTY CART ====================
function checkEmptyCart() {
    const cartList = document.getElementById('cartItemsList');
    const items = cartList.querySelectorAll('.cart-item');
    
    if (items.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <button class="btn btn-primary" onclick="window.location.href='Product_list.html'">
                    Start Shopping
                    <i class="lni lni-arrow-right"></i>
                </button>
            </div>
        `;
        
        // Hide checkout sidebar
        document.querySelector('.checkout-sidebar').style.display = 'none';
    }
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="lni lni-${type === 'success' ? 'checkmark-circle' : 'close-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification styles dynamically
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: calc(var(--header-height) + 20px);
        right: 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px 24px;
        background: var(--white);
        border: 3px solid var(--black);
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-brutal-md);
        font-weight: 700;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: #D4EDDA;
        border-color: var(--primary-color);
        color: var(--primary-dark);
    }
    
    .notification-error {
        background: #F8D7DA;
        border-color: #DC3545;
        color: #721C24;
    }
    
    .notification i {
        font-size: 1.5rem;
    }
    
    .empty-cart-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 80px 20px;
        background: var(--white);
        border: 4px solid var(--black);
        border-radius: var(--radius-2xl);
        box-shadow: var(--shadow-brutal-md);
    }
    
    .empty-icon {
        font-size: 6rem;
        margin-bottom: 20px;
        animation: bounce 2s ease-in-out infinite;
    }
    
    .empty-cart-message h3 {
        font-size: 2rem;
        font-weight: 900;
        margin-bottom: 16px;
        text-transform: uppercase;
    }
    
    .empty-cart-message p {
        font-size: 1.1rem;
        color: var(--gray-600);
        margin-bottom: 32px;
    }
`;
document.head.appendChild(style);

// Order Detail Modal
const orderDetailModal = document.getElementById('orderDetailModal');
const orderDetailButtons = document.querySelectorAll('.btn-details');

// Open the order detail modal when "View Details" is clicked
orderDetailButtons.forEach(button => {
    button.addEventListener('click', function() {
        orderDetailModal.classList.add('active');
    });
});

// Tab switching functionality for order details
document.querySelectorAll('.tab-btn').forEach(tab => {
    tab.addEventListener('click', function() {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');
        
        // Get the tab ID
        const tabId = this.getAttribute('data-tab');
        
        // Hide all panels
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // Show corresponding panel
        document.getElementById(tabId + '-panel').classList.add('active');
    });
});

// Xử lý nút thanh toán
document.addEventListener('DOMContentLoaded', function() {
    const checkoutBtn = document.querySelector('.checkout-btn, #checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            if (cart.length === 0) {
                alert('Giỏ hàng trống!');
                return;
            }
            window.location.href = 'checkout.html';
        });
    }

    // Nút tiếp tục mua hàng
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'Product_list.html';
        });
    }
});