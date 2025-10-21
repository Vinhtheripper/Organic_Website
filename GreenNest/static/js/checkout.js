/* ==========================================
   CHECKOUT PAGE - FUNCTIONALITY
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeCheckout();
});

function initializeCheckout() {
    // Shipping method change
    setupShippingMethod();
    
    // Address validation
    setupAddressValidation();
    
    // Payment card formatting
    setupCardFormatting();
    
    // Summary calculations
    updateSummary();
}

// ==================== SHIPPING METHOD ====================
function setupShippingMethod() {
    const shippingOptions = document.querySelectorAll('input[name="shipping"]');
    
    shippingOptions.forEach(option => {
        option.addEventListener('change', function() {
            updateSummary();
            
            // Visual feedback
            const parentLabel = this.closest('.shipping-option');
            animateSelection(parentLabel);
        });
    });
}

function animateSelection(element) {
    element.style.transform = 'scale(1.02)';
    setTimeout(() => {
        element.style.transform = '';
    }, 200);
}

// ==================== ADDRESS VALIDATION ====================
function setupAddressValidation() {
    const addressInput = document.getElementById('address-input');
    const warningBox = document.getElementById('po-box-warning');
    
    if (addressInput) {
        addressInput.addEventListener('input', function() {
            const value = this.value.toLowerCase();
            
            if (value.includes('po box') || value.includes('p.o. box')) {
                warningBox.style.display = 'flex';
                this.classList.add('error');
            } else {
                warningBox.style.display = 'none';
                this.classList.remove('error');
            }
        });
    }
}

// ==================== CARD FORMATTING ====================
function setupCardFormatting() {
    const cardNumberInput = document.querySelector('input[placeholder*="1234"]');
    const expiryInput = document.querySelector('input[placeholder*="MM / YY"]');
    const cvvInput = document.querySelector('input[placeholder*="123"]');
    
    // Format card number (4 digits groups)
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date (MM / YY)
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + ' / ' + value.slice(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV - numbers only
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// ==================== SUMMARY CALCULATIONS ====================
function updateSummary() {
    // Get product prices
    let subtotal = 0;
    const finalPrices = document.querySelectorAll('.final-price');
    
    finalPrices.forEach(priceElement => {
        const price = parseFloat(priceElement.textContent.replace('$', ''));
        if (!isNaN(price)) {
            subtotal += price;
        }
    });
    
    // Get shipping cost
    let shipping = 0;
    const selectedShipping = document.querySelector('input[name="shipping"]:checked');
    if (selectedShipping) {
        const shippingPrice = selectedShipping.closest('.shipping-option').querySelector('.shipping-price');
        shipping = parseFloat(shippingPrice.textContent.replace('$', ''));
    }
    
    // Calculate total
    const total = subtotal + shipping;
    
    // Update display
    document.getElementById('summary-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summary-shipping').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('summary-total').textContent = `$${total.toFixed(2)} USD`;
}

// ==================== FORM VALIDATION ====================
function validateAndPay() {
    const requiredFields = [
        'email',
        'first-name',
        'last-name',
        'address-input',
        'city-province',
        'zip-code',
        'phone'
    ];
    
    let isValid = true;
    let firstInvalidField = null;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            // Remove previous error state
            field.classList.remove('error');
            
            // Check if empty
            if (field.value.trim() === '') {
                field.classList.add('error');
                isValid = false;
                
                if (!firstInvalidField) {
                    firstInvalidField = field;
                }
                
                // Add shake animation
                field.style.animation = 'shake 0.3s ease';
                setTimeout(() => {
                    field.style.animation = '';
                }, 300);
            }
        }
    });
    
    // Check for PO Box
    const addressInput = document.getElementById('address-input');
    if (addressInput && addressInput.value.toLowerCase().includes('po box')) {
        isValid = false;
    }
    
    if (isValid) {
        // Show success message
        showNotification('Processing your order...', 'success');
        
        // Simulate processing
        setTimeout(() => {
            window.location.href = 'order-confirmation.html';
        }, 2000);
    } else {
        // Scroll to first error
        if (firstInvalidField) {
            firstInvalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstInvalidField.focus();
        }
        
        showNotification('Please fill in all required fields', 'error');
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

// Add notification styles
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
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thanh toán!');
        window.location.href = 'login.html';
        return;
    }

    // Kiểm tra giỏ hàng
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        alert('Giỏ hàng trống! Chuyển về trang sản phẩm.');
        window.location.href = 'Product_list.html';
        return;
    }

    // Hiển thị sản phẩm trong checkout
    displayCheckoutItems(cart);

    // Xử lý form thanh toán
    const checkoutForm = document.querySelector('#checkout-form, .checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Kiểm tra thông tin
            const name = document.querySelector('#customer-name, [name="name"]').value;
            const phone = document.querySelector('#customer-phone, [name="phone"]').value;
            const address = document.querySelector('#customer-address, [name="address"]').value;
            
            if (!name || !phone || !address) {
                alert('Vui lòng điền đầy đủ thông tin!');
                return;
            }
            
            // Xử lý đặt hàng
            alert('Đặt hàng thành công!');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        });
    }
});

function displayCheckoutItems(cart) {
    const container = document.querySelector('.checkout-items, #checkout-items');
    if (!container) return;
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = parseFloat(item.price) * (item.quantity || 1);
        total += itemTotal;
        
        html += `
            <div class="checkout-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Số lượng: ${item.quantity || 1}</p>
                    <p>Giá: ${formatPrice(item.price)} VNĐ</p>
                </div>
                <div class="item-total">
                    ${formatPrice(itemTotal)} VNĐ
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Cập nhật tổng tiền
    const totalElement = document.querySelector('.total-amount, #total-amount');
    if (totalElement) {
        totalElement.textContent = formatPrice(total) + ' VNĐ';
    }
}

function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}