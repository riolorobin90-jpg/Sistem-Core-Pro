/**
 * app.js - Frontend Logic for Burger Lab
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial Load
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
        
        // Update Title
        const nameDisplay = document.getElementById('app-name-display');
        if (nameDisplay) {
            nameDisplay.innerText = appConfig.appName;
        }
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
            'Bakery': 'bread',
            'Carni': 'beef',
            'Latticini': 'cheese',
            'Ortofrutta': 'leaf',
            'Surgelati': 'snowflake',
            'Salse': 'droplet',
            'Bevande': 'cup-soda',
            'Spezie': 'sparkles',
            'Packaging': 'package'
        };
        return map[cat] || 'package';
    }

    const order = {};

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

        const suppliers = [...new Set(productsData.filter(p => order[p.id]).map(p => p.supplier))];
        let message = `🚀 *ORDINE ${appConfig.appName.toUpperCase()}*\n📅 Data: ${new Date().toLocaleDateString()}\n\n`;

        suppliers.forEach(sup => {
            message += `*DA: ${sup.toUpperCase()}*\n`;
            productsData.filter(p => p.supplier === sup && order[p.id]).forEach(p => {
                message += `- ${p.name}: ${order[p.id]} ${p.unit}\n`;
            });
            message += `\n`;
        });

        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };
});
