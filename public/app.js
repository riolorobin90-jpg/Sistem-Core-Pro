/**
 * app.js - Frontend Logic for Burger Lab
 */

// Global State
let order = {};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. State


    // 2. Initial Load
    const loadingScreen = document.getElementById('loading-screen');
    const appContent = document.getElementById('app-content');

    try {
        // Load data from Supabase (via data.js)
        await loadDataFromServer();
        
        // Setup UI
        initApp();
        
        // Hide loading
        loadingScreen.classList.add('opacity-0');
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            appContent.classList.remove('hidden');
            void appContent.offsetWidth; // Trigger reflow
            appContent.classList.remove('opacity-0');
        }, 500);
    } catch (error) {
        console.error("Critical Init Error:", error);
        document.body.innerHTML = `
            <div class="h-screen flex items-center justify-center bg-[#0a0a0c] text-red-500 p-8 text-center">
                <div>
                    <i data-lucide="alert-circle" class="w-16 h-16 mx-auto mb-4"></i>
                    <h1 class="text-2xl font-bold mb-2">Errore di Inizializzazione</h1>
                    <p class="text-white/60">${error.message}</p>
                    <button onclick="location.reload()" class="mt-6 bg-white/10 px-6 py-2 rounded-lg text-white">Riprova</button>
                </div>
            </div>
        `;
        lucide.createIcons();
    }

    function initApp() {
        applyBrandConfig();
        renderCategories();
        updateSummary();
        lucide.createIcons();
    }

    function applyBrandConfig() {
        document.documentElement.style.setProperty('--brand-orange', appConfig.primaryColor);
        document.documentElement.style.setProperty('--brand-red', appConfig.secondaryColor);
        
        // Update Logo
        const logoContainer = document.getElementById('logo-container');
        if (appConfig.logoBase64 && logoContainer) {
            logoContainer.innerHTML = `<img src="${appConfig.logoBase64}" class="w-10 h-10 object-contain">`;
        }
        
        // Update Texts
        const nameDisplay = document.getElementById('app-name-display');
        if (nameDisplay) nameDisplay.innerText = appConfig.appName || "Burger Lab";
        
        const subtitleDisplay = document.getElementById('app-subtitle-display');
        if (subtitleDisplay) subtitleDisplay.innerText = appConfig.subtitle || "System Core Pro";
        
        const statusDisplay = document.getElementById('app-status-display');
        if (statusDisplay) statusDisplay.innerText = appConfig.statusText || "Live Order System";
    }

    function renderCategories() {
        const categoriesContainer = document.getElementById('categories-container');
        const categories = [...new Set(productsData.map(p => p.category))];
        
        categoriesContainer.innerHTML = categories.map(cat => {
            const catItems = productsData.filter(p => p.category === cat);
            const iconName = getCategoryIcon(cat);
            
            return `
                <div class="category-card bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl mb-8">
                    <div class="flex items-center gap-4 mb-6">
                        <div class="p-3 rounded-2xl bg-gradient-to-br from-brand-orange to-brand-red shadow-lg">
                            <i data-lucide="${iconName}" class="w-6 h-6 text-white"></i>
                        </div>
                        <h2 class="text-xl font-bold text-white tracking-tight">${cat}</h2>
                        <div class="ml-auto text-xs font-medium text-white/30 uppercase tracking-widest">${catItems.length} Articoli</div>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${catItems.map(item => renderItem(item)).join('')}
                    </div>
                </div>
            `;
        }).join('');
        
        lucide.createIcons();
        attachItemEvents();
    }

    function renderItem(item) {
        return `
            <div class="item-row group flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300">
                <div class="flex flex-col">
                    <span class="text-white font-medium group-hover:text-brand-orange transition-colors">${item.name}</span>
                    <span class="text-[10px] text-white/30 uppercase tracking-wider">${item.supplier}</span>
                </div>
                <div class="flex items-center gap-3">
                    <button class="qty-btn minus-btn w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-red hover:text-white hover:border-transparent transition-all" data-id="${item.id}">
                        <i data-lucide="minus" class="w-4 h-4"></i>
                    </button>
                    <div class="w-10 text-center">
                        <span class="qty-display font-bold text-white" id="qty-${item.id}">0</span>
                        <span class="text-[10px] block text-white/30 -mt-1">${item.unit}</span>
                    </div>
                    <button class="qty-btn plus-btn w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:bg-brand-orange hover:text-white hover:border-transparent transition-all" data-id="${item.id}">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        `;
    }

    function getCategoryIcon(cat) {
        const map = {
            'Bakery': 'croissant',
            'Carni': 'drumstick',
            'Latticini': 'milk',
            'Ortofrutta': 'leaf',
            'Surgelati': 'snowflake',
            'Salse': 'droplets',
            'Bevande': 'glass-water',
            'Spezie': 'sparkles',
            'Pesce': 'fish',
            'Packaging': 'package'
        };
        return map[cat] || 'package';
    }



    function attachItemEvents() {
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                order[id] = (order[id] || 0) + 1;
                updateItemQty(id);
            };
        });

        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.onclick = () => {
                const id = btn.dataset.id;
                if (order[id] > 0) {
                    order[id]--;
                    if (order[id] === 0) delete order[id];
                    updateItemQty(id);
                }
            };
        });
    }

    function updateItemQty(id) {
        const display = document.getElementById(`qty-${id}`);
        if (display) display.innerText = order[id] || 0;
        updateSummary();
    }

    function updateSummary() {
        const count = Object.keys(order).length;
        const badge = document.getElementById('order-badge');
        badge.innerText = count;
        badge.style.display = count > 0 ? 'flex' : 'none';
    }

    // Generate Order
    document.getElementById('btn-generate-order').onclick = () => {
        if (Object.keys(order).length === 0) {
            alert("L'ordine è vuoto!");
            return;
        }

        const globalPhone = appConfig.whatsappNumber ? appConfig.whatsappNumber.replace(/[^0-9]/g, '') : '';
        const orderGroups = {};

        // Raggruppa i prodotti ordinati per numero WhatsApp
        productsData.filter(p => order[p.id]).forEach(p => {
            const phone = p.whatsapp ? p.whatsapp.replace(/[^0-9]/g, '') : globalPhone;
            const key = phone || 'default';
            if (!orderGroups[key]) orderGroups[key] = { phone: phone, items: [] };
            orderGroups[key].items.push(p);
        });

        const groups = Object.values(orderGroups);

        function generateMessage(items) {
            const suppliers = [...new Set(items.map(p => p.supplier))];
            let message = `🚀 *ORDINE ${appConfig.appName.toUpperCase()}*\n📅 Data: ${new Date().toLocaleDateString()}\n\n`;

            suppliers.forEach(sup => {
                message += `*DA: ${sup.toUpperCase()}*\n`;
                items.filter(p => p.supplier === sup).forEach(p => {
                    message += `- ${p.name}: ${order[p.id]} ${p.unit}\n`;
                });
                message += `\n`;
            });
            return message;
        }

        if (groups.length === 1) {
            // Solo un gruppo, invia normalmente
            const grp = groups[0];
            const msg = generateMessage(grp.items);
            const whatsappUrl = `https://wa.me/${grp.phone}?text=${encodeURIComponent(msg)}`;
            window.open(whatsappUrl, '_blank');
        } else {
            // Multipli numeri, mostra la modale per invii separati
            let modal = document.getElementById('modal-multi-order');
            if(!modal) {
                modal = document.createElement('div');
                modal.id = 'modal-multi-order';
                modal.className = 'fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 opacity-0 hidden';
                document.body.appendChild(modal);
            }
            
            let html = `
            <div class="bg-brand-card backdrop-blur-3xl border border-brand-border rounded-[2rem] w-full max-w-md p-8 transform transition-transform duration-300 shadow-2xl">
                <h3 class="text-2xl font-black mb-2 text-white">Ordini Separati</h3>
                <p class="text-sm text-white/50 mb-6">Hai inserito prodotti da fornitori speciali (es. MD). Clicca sui tasti per inviare ogni ordine al suo numero.</p>
                <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">`;

            groups.forEach(grp => {
                const sups = [...new Set(grp.items.map(p => p.supplier))].join(', ');
                const qty = grp.items.length;
                const msg = generateMessage(grp.items);
                const url = `https://wa.me/${grp.phone}?text=${encodeURIComponent(msg)}`;
                html += `
                <a href="${url}" target="_blank" class="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 p-4 rounded-xl transition-all group">
                    <div class="overflow-hidden">
                        <div class="text-brand-orange font-bold text-sm truncate w-[180px]">${sups}</div>
                        <div class="text-xs text-white/50">${grp.phone ? 'WA: '+grp.phone : 'Base'}</div>
                    </div>
                    <div class="text-right flex items-center gap-3">
                        <div class="text-sm text-white font-bold">${qty} Articoli</div>
                        <div class="bg-[#25D366] text-white p-2 rounded-lg group-hover:scale-110 transition-transform"><i data-lucide="send" class="w-4 h-4"></i></div>
                    </div>
                </a>`;
            });

            html += `</div>
                <button id="btn-close-multi" class="w-full mt-6 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-all">Chiudi</button>
            </div>`;
            
            modal.innerHTML = html;
            modal.classList.remove('hidden');
            // Allow reflow
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            
            if(window.lucide) window.lucide.createIcons();

            document.getElementById('btn-close-multi').onclick = () => {
                modal.classList.add('opacity-0');
                setTimeout(() => modal.classList.add('hidden'), 300);
            };
        }
    };
});
