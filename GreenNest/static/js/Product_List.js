document.addEventListener('DOMContentLoaded', function() {
    // Debug sticky
    const cartSidebar = document.querySelector('.cart-sidebar');
    const pageWrapper = document.querySelector('.page-wrapper');
    
    console.log('Cart Sidebar:', cartSidebar);
    console.log('Position:', window.getComputedStyle(cartSidebar).position);
    console.log('Top:', window.getComputedStyle(cartSidebar).top);
    console.log('Align-self:', window.getComputedStyle(cartSidebar).alignSelf);
    console.log('Page Wrapper align-items:', window.getComputedStyle(pageWrapper).alignItems);
    
    // Visual indicator khi sticky đang hoạt động
    window.addEventListener('scroll', function() {
        const rect = cartSidebar.getBoundingClientRect();
        if (rect.top <= 100) {
            cartSidebar.style.boxShadow = '0 12px 32px rgba(46, 125, 50, 0.2)';
        } else {
            cartSidebar.style.boxShadow = '';
        }
    });

    // ========================================
    // Pack Size Selection & Dynamic Slots
    // ========================================
    const packSizeSelect = document.getElementById('pack-size');
    const packSlotsContainer = document.querySelector('.pack-slots');
    const summarySelect = document.querySelector('.summary-select span');
    const fillButton = document.querySelector('.btn-fill-slots');
    
    let selectedCount = 0;
    let totalSlots = 6;

    // Update pack slots based on selected size
    function updatePackSlots(size = 6) {
        totalSlots = parseInt(size);
        selectedCount = 0;
        
        // Clear existing slots
        packSlotsContainer.innerHTML = '';
        
        // Calculate rows (3 slots per row)
        const rows = Math.ceil(totalSlots / 3);
        
        for (let i = 0; i < rows; i++) {
            const row = document.createElement('div');
            row.className = 'slot-row';
            
            const slotsInRow = Math.min(3, totalSlots - (i * 3));
            
            for (let j = 0; j < slotsInRow; j++) {
                const slot = document.createElement('div');
                slot.className = 'pack-slot empty';
                slot.innerHTML = `
                    <button class="add-slot-btn">
                        <i class="lni lni-plus"></i>
                    </button>
                `;
                row.appendChild(slot);
            }
            
            packSlotsContainer.appendChild(row);
        }
        
        updateSummary();
    }

    // Update summary display
    function updateSummary() {
        summarySelect.textContent = `${selectedCount}/${totalSlots} Selected`;
        
        const remaining = totalSlots - selectedCount;
        const price = (remaining * 11.99).toFixed(2);
        
        if (remaining > 0) {
            fillButton.textContent = `Fill ${remaining} More Slots • $${price}`;
            fillButton.disabled = true;
        } else {
            fillButton.textContent = `Checkout • $${(totalSlots * 11.99).toFixed(2)}`;
            fillButton.disabled = false;
        }
    }

    // Handle pack size change
    packSizeSelect.addEventListener('change', function(e) {
        const newSize = e.target.value;
        updatePackSlots(newSize);
        
        // Add animation effect
        packSizeSelect.style.transform = 'scale(1.05)';
        setTimeout(() => {
            packSizeSelect.style.transform = 'scale(1)';
        }, 200);
    });

    // Handle add to cart
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-add-cart')) {
            e.preventDefault();
            
            if (selectedCount >= totalSlots) {
                showNotification('Pack is full! Please remove an item or choose a larger pack.', 'warning');
                return;
            }
            
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productImg = productCard.querySelector('.product-img').src;
            const productPrice = productCard.querySelector('.btn-price').textContent;
            
            // Find empty slot
            const emptySlot = document.querySelector('.pack-slot.empty');
            if (emptySlot) {
                emptySlot.classList.remove('empty');
                emptySlot.classList.add('filled');
                emptySlot.innerHTML = `
                    <img src="${productImg}" alt="${productName}">
                    <button class="remove-btn">
                        <i class="lni lni-close"></i>
                    </button>
                `;
                
                selectedCount++;
                updateSummary();
                
                // Animation feedback
                emptySlot.style.animation = 'none';
                setTimeout(() => {
                    emptySlot.style.animation = 'fadeInUp 0.4s ease';
                }, 10);
                
                // Scroll to cart sidebar on mobile
                if (window.innerWidth <= 992) {
                    document.querySelector('.cart-sidebar').scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
                
                showNotification(`${productName} added to your pack!`, 'success');
            }
        }
        
        // Handle remove from slot
        if (e.target.closest('.remove-btn')) {
            const slot = e.target.closest('.pack-slot');
            slot.classList.remove('filled');
            slot.classList.add('empty');
            slot.innerHTML = `
                <button class="add-slot-btn">
                    <i class="lni lni-plus"></i>
                </button>
            `;
            
            selectedCount--;
            updateSummary();
            
            showNotification('Item removed from pack', 'info');
        }
    });

    // ========================================
    // Sticky Cart - Enhanced
    // ========================================
    // Reuse the cartSidebar declared earlier to avoid redeclaration error
    const header = document.querySelector('.site-header');
    
    if (cartSidebar && header) {
        function updateStickyPosition() {
            const headerHeight = header.offsetHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Update CSS variable cho sticky position
            cartSidebar.style.top = `${headerHeight + 20}px`;
        }
        
        // Update on scroll
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    updateStickyPosition();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Initial update
        updateStickyPosition();
    }

    // ========================================
    // Category Navigation Auto Scroll
    // ========================================
    const scrollWrapper = document.querySelector('.category-scroll-wrapper');
    
    if (scrollWrapper) {
        let isScrolling = false;
        let scrollSpeed = 0;
        
        scrollWrapper.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const wrapperWidth = rect.width;
            
            const leftDistance = mouseX;
            const rightDistance = wrapperWidth - mouseX;
            const scrollZone = 100;
            
            if (leftDistance < scrollZone) {
                scrollSpeed = -((scrollZone - leftDistance) / scrollZone) * 5;
                startScrolling();
            } else if (rightDistance < scrollZone) {
                scrollSpeed = ((scrollZone - rightDistance) / scrollZone) * 5;
                startScrolling();
            } else {
                stopScrolling();
            }
        });
        
        scrollWrapper.addEventListener('mouseleave', stopScrolling);
        
        function startScrolling() {
            if (isScrolling) return;
            isScrolling = true;
            scroll();
        }
        
        function stopScrolling() {
            isScrolling = false;
            scrollSpeed = 0;
        }
        
        function scroll() {
            if (!isScrolling) return;
            scrollWrapper.scrollLeft += scrollSpeed;
            requestAnimationFrame(scroll);
        }
    }

    // ========================================
    // Category Links Active State
    // ========================================
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all
            categoryLinks.forEach(l => l.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = header.offsetHeight + 20;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // Notification System
    // ========================================
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="lni ${type === 'success' ? 'lni-checkmark-circle' : type === 'warning' ? 'lni-warning' : 'lni-information'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize with default 6-pack
    updatePackSlots(6);

    // ========================================
    // Add hover effect to product cards
    // ========================================
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ========================================
    // Checkout Button Handler
    // ========================================
    fillButton.addEventListener('click', function() {
        if (!this.disabled) {
            // Redirect to checkout or show modal
            showNotification(`Proceeding to checkout with ${totalSlots} items!`, 'success');
            // window.location.href = 'checkout.html';
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Biến toàn cục để theo dõi giỏ hàng
    let cartItems = [];
    const PRICE_PER_ITEM = 11.99; // Giá mỗi sản phẩm
    const MAX_SLOTS = 6; // Số lượng slot tối đa
    
    // Các phần tử DOM
    const summarySelect = document.querySelector('.summary-select span');
    const fillSlotsBtn = document.querySelector('.btn-fill-slots');
    const packSlots = document.querySelectorAll('.pack-slot');
    const addToCartBtns = document.querySelectorAll('.btn-add-cart');
    
    // Reset giá và số lượng ban đầu
    updateCartSummary();
    
    // Xử lý nút "Add" cho các sản phẩm
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Nếu giỏ hàng đã đầy
            if (cartItems.length >= MAX_SLOTS) {
                alert('Giỏ hàng đã đầy! Bạn chỉ có thể chọn tối đa ' + MAX_SLOTS + ' sản phẩm.');
                return;
            }
            
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productImg = productCard.querySelector('.product-img').src;
            const productPrice = parseFloat(this.querySelector('.btn-price').textContent.replace('$', ''));
            
            // Thêm sản phẩm vào giỏ
            cartItems.push({
                name: productName,
                image: productImg,
                price: productPrice
            });
            
            // Lưu vào localStorage
            localStorage.setItem('cart', JSON.stringify(cartItems));
            
            // Cập nhật UI
            updateCartSummary();
            updatePackSlots();
        });
    });
    
    // Nút "Fill Slots" - Chuyển đến trang checkout
    fillSlotsBtn.addEventListener('click', function() {
        if (cartItems.length > 0) {
            // Lưu giỏ hàng vào localStorage trước khi chuyển trang
            localStorage.setItem('cart', JSON.stringify(cartItems));
            
            // Chuyển đến trang checkout
            window.location.href = 'checkout.html';
        } else {
            alert('Vui lòng chọn ít nhất một sản phẩm!');
        }
    });
    
    // Cập nhật hiển thị giỏ hàng và nút checkout
    function updateCartSummary() {
        const totalItems = cartItems.length;
        const totalPrice = (totalItems * PRICE_PER_ITEM).toFixed(2);
        
        // Cập nhật số lượng sản phẩm đã chọn
        if (summarySelect) {
            summarySelect.textContent = `${totalItems}/${MAX_SLOTS} SELECTED`;
        }
        
        // Cập nhật nút "Fill Slots"
        if (fillSlotsBtn) {
            const remainingSlots = MAX_SLOTS - totalItems;
            if (remainingSlots > 0) {
                fillSlotsBtn.textContent = `Fill ${remainingSlots} More Slots • $${totalPrice}`;
            } else {
                fillSlotsBtn.textContent = `CHECKOUT • $${totalPrice}`;
            }
            
            // Kích hoạt nút khi đã có ít nhất một sản phẩm
            fillSlotsBtn.disabled = (totalItems === 0);
        }
    }
    
    // Cập nhật hiển thị các slot trong giỏ hàng
    function updatePackSlots() {
        packSlots.forEach((slot, index) => {
            // Nếu có sản phẩm ở index này
            if (index < cartItems.length) {
                slot.classList.remove('empty');
                slot.innerHTML = `
                    <div class="slot-product">
                        <img src="${cartItems[index].image}" alt="${cartItems[index].name}">
                        <button class="remove-slot-btn" data-index="${index}">×</button>
                    </div>
                `;
            } else {
                slot.classList.add('empty');
                slot.innerHTML = `
                    <button class="add-slot-btn">
                        <i class="lni lni-plus"></i>
                    </button>
                `;
            }
        });
        
        // Thêm sự kiện cho nút xóa sản phẩm
        document.querySelectorAll('.remove-slot-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeItemFromCart(index);
            });
        });
    }
    
    // Xóa sản phẩm khỏi giỏ hàng
    function removeItemFromCart(index) {
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        updateCartSummary();
        updatePackSlots();
    }
    
    // Kiểm tra localStorage nếu đã có giỏ hàng
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartSummary();
        updatePackSlots();
    }
});