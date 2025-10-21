document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab-link');
    const productContainers = document.querySelectorAll('.product-container');
    
    // Ẩn tất cả container trừ cái đầu tiên khi load trang
    if (productContainers.length > 0) {
        productContainers.forEach((container, index) => {
            if (index !== 0) {
                container.style.display = 'none';
            }
        });
    }
    
    // Thêm event listener cho từng tab
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function() {
            // Xóa active class từ tất cả tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Thêm active class vào tab được click
            this.classList.add('active');
            
            // Ẩn tất cả product containers
            if (productContainers.length > 0) {
                productContainers.forEach(container => {
                    container.style.display = 'none';
                });
                
                // Hiển thị container tương ứng với tab được click
                if (productContainers[index]) {
                    productContainers[index].style.display = 'flex';
                }
            }
            
            // Smooth scroll đến tab container
            const tabContainer = document.querySelector('.menu-tabs-container');
            if (tabContainer) {
                tabContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});