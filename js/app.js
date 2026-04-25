document.addEventListener('DOMContentLoaded', () => {
    const state = {
        orders: {},
        today: new Date()
    };

    const catalogContainer = document.getElementById('catalog-container');
    const badgeTotalItems = document.getElementById('badge-total-items');
    const btnGenerateOrders = document.getElementById('btn-generate-orders');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const ordersPanel = document.getElementById('orders-panel');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const ordersContent = document.getElementById('orders-content');
    const currentDateEl = document.getElementById('current-date');

    async function init() {
        await loadDataFromServer();
        
        const today = state.today;
        currentDateEl.textContent = today.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });

        // Apply config
        if (typeof appConfig !== 'undefined') {
            const appNameDisplay = document.getElementById('app-name-display');
            if (appNameDisplay) appNameDisplay.textContent = appConfig.appName;
            document.title = `${appConfig.appName} - Gestione Ordini Pro`;

            if (appConfig.logoBase64) {
                const logoContainer = document.getElementById('logo-container');
                if (logoContainer) {
                    logoContainer.innerHTML = `<img src="${appConfig.logoBase64}" class="w-full h-full object-cover rounded-2xl" alt="Logo">`;
                }
            }

            document.documentElement.style.setProperty('--brand-orange', appConfig.primaryColor);
            document.documentElement.style.setProperty('--brand-red', appConfig.secondaryColor);
        }

        initCatalog();
        updateBottomBar();
    }

    init();

    function getCategoryIcon(category) {
        const cat = category.toLowerCase();
        let iconName = 'star';
        if (cat.includes('bakery') || cat.includes('pane')) {
            iconName = 'croissant';
        } else if (cat.includes('carn')) {
            iconName = 'steak';
        } else if (cat.includes('latt') || cat.includes('formagg')) {
            iconName = 'cheese';
        } else if (cat.includes('orto') || cat.includes('verd')) {
            iconName = 'cabbage';
        } else if (cat.includes('surgelat')) {
            iconName = 'snowflake';
        } else if (cat.includes('salse')) {
            iconName = 'ketchup';
        } else if (cat.includes('bevand')) {
            iconName = 'soda-cup';
        } else if (cat.includes('spez')) {
            iconName = 'sparkling';
        } else if (cat.includes('pack') || cat.includes('carta') || cat.includes('monouso')) {
            iconName = 'take-away-food';
        }
        return `<img src="https://img.icons8.com/3d-fluency/94/${iconName}.png" alt="${category}" class="w-14 h-14 object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)] transform group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500 ease-out" />`;
    }

    function initCatalog() {
        const groupedProducts = productsData.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = [];
            acc[product.category].push(product);
            return acc;
        }, {});

        catalogContainer.innerHTML = '';
        
        for (const [category, products] of Object.entries(groupedProducts)) {
            const categorySection = document.createElement('div');
            
            const categoryTitle = document.createElement('div');
            categoryTitle.className = 'mb-10 flex items-center gap-4 w-full';
            categoryTitle.innerHTML = `
                <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div class="flex items-center gap-6 relative group cursor-default">
                    <span class="absolute inset-0 bg-brand-orange/40 blur-[30px] rounded-full z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700"></span>
                    <div class="relative z-10 bg-gradient-to-br from-white/20 to-white/5 p-4 rounded-[2rem] border border-white/30 shadow-[0_10px_40px_rgba(255,81,47,0.3),inset_0_2px_20px_rgba(255,255,255,0.2)] flex items-center justify-center backdrop-blur-xl overflow-visible">
                        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[2rem] pointer-events-none"></div>
                        ${getCategoryIcon(category)}
                    </div>
                    <h2 class="relative z-10 text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/30 uppercase tracking-[0.15em] drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">${category}</h2>
                </div>
                <div class="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            `;
            
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8';

            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'relative bg-brand-card backdrop-blur-2xl border border-brand-border rounded-[2rem] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-10px_rgba(255,81,47,0.2)] hover:border-brand-orange/30 group overflow-hidden';
                
                card.innerHTML = `
                    <div class="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                    <div class="relative z-10">
                        <div class="mb-6">
                            <span class="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">${product.supplier}</span>
                            <h3 class="text-xl font-bold text-white leading-tight mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-300">${product.name}</h3>
                            <span class="text-xs font-medium text-white/50 bg-white/5 px-3 py-1.5 rounded-xl inline-block mt-3 border border-white/5 shadow-inner">Unità: <span class="text-white">${product.unit}</span></span>
                        </div>
                        
                        <div class="mt-auto pt-2 flex items-center justify-between">
                            <button class="btn-minus w-14 h-14 rounded-full bg-white/5 border border-white/10 text-white/70 flex items-center justify-center text-3xl font-light transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-110 active:scale-95 no-select shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]" data-id="${product.id}" aria-label="Diminuisci quantità">-</button>
                            <div class="flex-1 flex justify-center relative">
                                <span class="qty-display text-4xl font-light text-white w-16 text-center no-select transition-all duration-300 transform" id="qty-${product.id}">0</span>
                            </div>
                            <button class="btn-plus w-14 h-14 rounded-full bg-gradient-to-br from-brand-orange to-brand-red text-white flex items-center justify-center text-3xl font-light transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,81,47,0.5)] active:scale-95 no-select relative overflow-hidden group/btn" data-id="${product.id}" aria-label="Aumenta quantità">
                                <div class="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                                +
                            </button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });

            categorySection.appendChild(categoryTitle);
            categorySection.appendChild(grid);
            catalogContainer.appendChild(categorySection);
        }

        document.querySelectorAll('.btn-plus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.closest('button').dataset.id, 1));
        });
        document.querySelectorAll('.btn-minus').forEach(btn => {
            btn.addEventListener('click', (e) => updateQuantity(e.target.closest('button').dataset.id, -1));
        });

        // Inizializza le icone Lucide appena aggiunte al DOM
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function updateQuantity(productId, change) {
        const id = parseInt(productId);
        const currentQty = state.orders[id] || 0;
        const newQty = Math.max(0, currentQty + change);
        
        if (newQty > 0) {
            state.orders[id] = newQty;
        } else {
            delete state.orders[id];
        }

        const qtyDisplay = document.getElementById(`qty-${id}`);
        if (qtyDisplay) {
            qtyDisplay.textContent = newQty;
            
            qtyDisplay.style.transform = 'scale(1.3) translateY(-2px)';
            qtyDisplay.style.color = '#FF512F';
            qtyDisplay.style.textShadow = '0 0 15px rgba(255,81,47,0.5)';
            setTimeout(() => {
                qtyDisplay.style.transform = 'scale(1) translateY(0)';
                qtyDisplay.style.color = '#ffffff';
                qtyDisplay.style.textShadow = 'none';
            }, 200);
        }

        updateBottomBar();
    }

    function updateBottomBar() {
        const totalItems = Object.keys(state.orders).length;
        if (totalItems > 0) {
            badgeTotalItems.textContent = totalItems;
            badgeTotalItems.classList.remove('hidden');
            btnGenerateOrders.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
            badgeTotalItems.classList.add('hidden');
            btnGenerateOrders.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }

    function openModal() {
        if (Object.keys(state.orders).length === 0) return;
        
        generateOrderSummary();
        
        modalBackdrop.classList.remove('hidden');
        void modalBackdrop.offsetWidth;
        modalBackdrop.classList.remove('opacity-0');
        
        ordersPanel.classList.remove('translate-x-full');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalBackdrop.classList.add('opacity-0');
        ordersPanel.classList.add('translate-x-full');
        document.body.style.overflow = '';
        
        setTimeout(() => {
            modalBackdrop.classList.add('hidden');
        }, 500);
    }

    function generateOrderSummary() {
        ordersContent.innerHTML = '';
        
        const orderedItems = Object.entries(state.orders).map(([id, qty]) => {
            const product = productsData.find(p => p.id === parseInt(id));
            return { ...product, qty };
        });

        const ordersBySupplier = orderedItems.reduce((acc, item) => {
            if (!acc[item.supplier]) acc[item.supplier] = [];
            acc[item.supplier].push(item);
            return acc;
        }, {});

        for (const [supplier, items] of Object.entries(ordersBySupplier)) {
            const receiptCard = document.createElement('div');
            receiptCard.className = 'bg-brand-card backdrop-blur-2xl border border-brand-border rounded-[2rem] p-6 md:p-8 relative overflow-hidden group';
            
            let itemsHtml = items.map(item => `
                <div class="flex justify-between items-center py-3 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors rounded-xl px-4 -mx-4">
                    <div>
                        <span class="font-bold text-white text-lg">${item.name}</span>
                        <span class="text-[10px] uppercase tracking-[0.2em] text-white/40 block mt-1">${item.category}</span>
                    </div>
                    <div class="font-black text-xl bg-white/5 border border-white/10 px-4 py-1.5 rounded-xl text-white shadow-inner flex items-baseline gap-1">
                        ${item.qty} <span class="text-xs text-white/50 font-medium">${item.unit}</span>
                    </div>
                </div>
            `).join('');
            
            const dateStr = state.today.toLocaleDateString('it-IT');
            let appName = (typeof appConfig !== 'undefined') ? appConfig.appName.toUpperCase() : "BURGER LAB";
            let whatsappText = `*ORDINE ${appName}* - ${dateStr}%0A%0A*Fornitore:* ${supplier}%0A%0A`;
            items.forEach(item => {
                whatsappText += `- ${item.name}: *${item.qty} ${item.unit}*%0A`;
            });
            whatsappText += `%0AGrazie!`;

            receiptCard.innerHTML = `
                <div class="absolute -top-20 -right-20 w-48 h-48 bg-brand-orange/10 blur-[50px] rounded-full z-0 pointer-events-none group-hover:bg-brand-orange/20 transition-colors duration-500"></div>
                <div class="relative z-10">
                    <div class="mb-8 flex justify-between items-start">
                        <div>
                            <h3 class="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">${supplier}</h3>
                            <p class="text-[10px] text-brand-orange font-bold uppercase tracking-[0.2em] mt-2">Ordine del ${dateStr}</p>
                        </div>
                        <div class="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 shadow-[inset_0_2px_10px_rgba(255,255,255,0.02)]">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        </div>
                    </div>
                    
                    <div class="mb-10 space-y-1">
                        ${itemsHtml}
                    </div>
                    
                    <a href="https://wa.me/?text=${whatsappText}" target="_blank" class="w-full bg-brand-whatsapp/10 border border-brand-whatsapp/30 text-brand-whatsapp font-bold text-lg py-5 px-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-brand-whatsapp hover:text-[#050505] transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_40px_rgba(37,211,102,0.4)] active:scale-95 group/btn isolate overflow-hidden relative">
                        <div class="absolute inset-0 bg-brand-whatsapp opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 z-[-1]"></div>
                        <svg class="w-7 h-7 group-hover/btn:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        <span class="tracking-widest">INVIA ORDINE</span>
                    </a>
                </div>
            `;
            
            ordersContent.appendChild(receiptCard);
        }
    }

    btnGenerateOrders.addEventListener('click', () => {
        if (!btnGenerateOrders.classList.contains('cursor-not-allowed')) {
            openModal();
        }
    });
    btnCloseModal.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    
    // init() già chiamato sopra
});
