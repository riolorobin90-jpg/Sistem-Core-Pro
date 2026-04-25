document.addEventListener('DOMContentLoaded', () => {
    // State
    let data = {
        categories: [],
        suppliers: [],
        items: []
    };
    let orderQuantities = {}; // { itemId: quantity }

    // DOM Elements
    const loader = document.getElementById('loader');
    const catalogContainer = document.getElementById('catalogContainer');
    const ordersContainer = document.getElementById('ordersContainer');
    const ordersList = document.getElementById('ordersList');
    const generateOrdersBtn = document.getElementById('generateOrdersBtn');
    const mobileGenerateOrdersBtn = document.getElementById('mobileGenerateOrdersBtn');
    const backToCatalogBtn = document.getElementById('backToCatalogBtn');
    const headerCartCount = document.getElementById('headerCartCount');
    const mobileCartCount = document.getElementById('mobileCartCount');

    // Init
    fetchData();

    // Fetch data from API
    async function fetchData() {
        try {
            const response = await fetch('/api/data');
            if (!response.ok) throw new Error('Network response was not ok');
            data = await response.json();
            
            // Apply config
            if (data.config) {
                document.documentElement.style.setProperty('--color-primary', data.config.primaryColor || '#F97316');
                document.documentElement.style.setProperty('--color-secondary', data.config.secondaryColor || '#FACC15');
                const appNameHeader = document.getElementById('appNameHeader');
                if (appNameHeader) appNameHeader.innerText = data.config.appName || 'App Ordini';
                document.title = (data.config.appName || 'App Ordini') + ' - Gestione';
            }

            // Initialize quantities
            data.items.forEach(item => {
                orderQuantities[item.id] = 0;
            });

            renderCatalog();
            
            loader.classList.add('hidden');
            catalogContainer.classList.remove('hidden');
        } catch (error) {
            console.error('Error fetching data:', error);
            loader.innerHTML = `
                <div class="text-red-500 flex flex-col items-center">
                    <i class="ph-bold ph-warning-circle text-4xl mb-2"></i>
                    <p>Errore nel caricamento dei dati.</p>
                </div>
            `;
        }
    }

    // Helper: Get supplier by ID
    function getSupplier(id) {
        return data.suppliers.find(s => s.id === id);
    }

    // Render Catalog
    function renderCatalog() {
        catalogContainer.innerHTML = '';

        data.categories.forEach((category, index) => {
            // Find items for this category
            const categoryItems = data.items.filter(item => item.categoryId === category.id);
            if (categoryItems.length === 0) return;

            // Create category section
            const section = document.createElement('section');
            section.className = `animate-fade-in`;
            section.style.animationDelay = `${index * 0.1}s`;

            // Category header
            const header = document.createElement('h2');
            header.className = 'text-2xl font-bold mb-6 flex items-center gap-3 text-secondary';
            
            // Icon logic based on category name
            let iconClass = 'ph-tag';
            if (category.name.toLowerCase().includes('verdure')) iconClass = 'ph-leaf';
            if (category.name.toLowerCase().includes('formaggi')) iconClass = 'ph-cheese';
            if (category.name.toLowerCase().includes('carni')) iconClass = 'ph-cow';

            header.innerHTML = `<i class="ph-duotone ${iconClass} text-3xl"></i> ${category.name}`;
            section.appendChild(header);

            // Items grid
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6';

            categoryItems.forEach(item => {
                const supplier = getSupplier(item.supplierId);
                const card = document.createElement('div');
                card.className = 'glass-card rounded-2xl p-5 flex flex-col justify-between hover:border-primary/30 transition-colors group';
                
                card.innerHTML = `
                    <div>
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-semibold text-white group-hover:text-primary transition-colors">${item.name}</h3>
                            <span class="text-xs font-medium bg-white/10 text-gray-300 px-2 py-1 rounded-md">${item.unit}</span>
                        </div>
                        <p class="text-sm text-gray-400 mb-4 flex items-center gap-1">
                            <i class="ph ph-truck"></i> ${supplier ? supplier.name : 'Sconosciuto'}
                        </p>
                    </div>
                    
                    <div class="flex items-center justify-between bg-dark/50 rounded-xl p-2 border border-white/5">
                        <button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary/20 text-white flex items-center justify-center transition-colors btn-minus" data-id="${item.id}">
                            <i class="ph-bold ph-minus"></i>
                        </button>
                        <input type="number" min="0" value="${orderQuantities[item.id]}" class="w-16 bg-transparent text-center font-bold text-xl text-white focus:outline-none qty-input" data-id="${item.id}" />
                        <button class="w-10 h-10 rounded-lg bg-white/5 hover:bg-primary text-white flex items-center justify-center transition-colors btn-plus" data-id="${item.id}">
                            <i class="ph-bold ph-plus"></i>
                        </button>
                    </div>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);
            catalogContainer.appendChild(section);
        });

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                if (orderQuantities[id] > 0) {
                    orderQuantities[id]--;
                    updateInputAndCart(id);
                }
            });
        });

        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                orderQuantities[id]++;
                updateInputAndCart(id);
            });
        });

        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 0) val = 0;
                orderQuantities[id] = val;
                updateInputAndCart(id);
            });
        });
    }

    function updateInputAndCart(id) {
        // Update input field
        const input = document.querySelector(`.qty-input[data-id="${id}"]`);
        if (input) input.value = orderQuantities[id];

        // Update total items count in cart
        let totalItems = Object.values(orderQuantities).filter(qty => qty > 0).length;
        
        [headerCartCount, mobileCartCount].forEach(badge => {
            if (badge) {
                badge.innerText = totalItems;
                if (totalItems > 0) {
                    badge.classList.remove('opacity-0', 'hidden');
                    badge.classList.add('opacity-100');
                    // Add a tiny bounce animation
                    badge.classList.add('animate-bounce');
                    setTimeout(() => badge.classList.remove('animate-bounce'), 500);
                } else {
                    badge.classList.add('opacity-0');
                    if(badge.id === 'mobileCartCount') badge.classList.add('hidden');
                }
            }
        });
    }

    // Generate Orders
    function generateOrders() {
        // Filter items to order
        const itemsToOrder = data.items.filter(item => orderQuantities[item.id] > 0);
        
        if (itemsToOrder.length === 0) {
            alert('Aggiungi almeno un articolo per generare un ordine.');
            return;
        }

        // Group by supplier
        const ordersBySupplier = {};
        itemsToOrder.forEach(item => {
            if (!ordersBySupplier[item.supplierId]) {
                ordersBySupplier[item.supplierId] = [];
            }
            ordersBySupplier[item.supplierId].push(item);
        });

        // Render Orders View
        renderOrdersList(ordersBySupplier);

        // Switch Views
        catalogContainer.classList.add('hidden');
        document.querySelector('.fixed.bottom-6').classList.add('hidden'); // Hide mobile button
        ordersContainer.classList.remove('hidden');
        window.scrollTo(0,0);
    }

    function renderOrdersList(ordersMap) {
        ordersList.innerHTML = '';
        let index = 0;

        for (const [supplierId, items] of Object.entries(ordersMap)) {
            const supplier = getSupplier(supplierId);
            if (!supplier) continue;

            const card = document.createElement('div');
            card.className = 'glass-card rounded-2xl p-6 flex flex-col h-full animate-fade-in';
            card.style.animationDelay = `${index * 0.1}s`;
            index++;

            // Create list HTML
            let appName = data.config ? data.config.appName : 'App';
            let listHTML = '<ul class="space-y-3 mb-6 flex-grow">';
            let textForWhatsApp = `*NUOVO ORDINE - ${appName.toUpperCase()}*\nCiao ${supplier.name}, vorrei effettuare il seguente ordine:\n\n`;

            items.forEach(item => {
                const qty = orderQuantities[item.id];
                listHTML += `
                    <li class="flex justify-between items-center border-b border-white/5 pb-2">
                        <div>
                            <span class="font-bold text-secondary">${qty}</span>
                            <span class="text-xs text-gray-400 ml-1">${item.unit}</span>
                        </div>
                        <span class="font-medium text-right ml-4">${item.name}</span>
                    </li>
                `;
                textForWhatsApp += `• ${qty} ${item.unit} di ${item.name}\n`;
            });

            textForWhatsApp += `\nIn attesa di conferma, grazie!`;
            listHTML += '</ul>';

            // WhatsApp link
            const encodedText = encodeURIComponent(textForWhatsApp);
            // Replace leading '+' or '00' if any, ensure it's a valid format for wa.me
            const phone = supplier.phone.replace(/[^0-9]/g, ''); 
            const whatsappUrl = `https://wa.me/${phone}?text=${encodedText}`;

            card.innerHTML = `
                <div class="mb-4">
                    <h3 class="text-xl font-bold text-white mb-1">${supplier.name}</h3>
                    <p class="text-sm text-gray-400 flex items-center gap-1">
                        <i class="ph ph-phone"></i> +${supplier.phone}
                    </p>
                </div>
                ${listHTML}
                <a href="${whatsappUrl}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#25D366]/20 transition-all active:scale-95 mt-auto">
                    <i class="ph-fill ph-whatsapp-logo text-xl"></i>
                    Invia via WhatsApp
                </a>
            `;

            ordersList.appendChild(card);
        }
    }

    // Event Listeners for buttons
    generateOrdersBtn.addEventListener('click', generateOrders);
    mobileGenerateOrdersBtn.addEventListener('click', generateOrders);
    
    backToCatalogBtn.addEventListener('click', () => {
        ordersContainer.classList.add('hidden');
        catalogContainer.classList.remove('hidden');
        document.querySelector('.fixed.bottom-6').classList.remove('hidden'); // Show mobile button
    });
});
