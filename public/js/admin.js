document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const cfgAppName = document.getElementById('cfg-app-name');
    const cfgSubtitle = document.getElementById('cfg-subtitle');
    const cfgStatusText = document.getElementById('cfg-status-text');
    const cfgWhatsappNumber = document.getElementById('cfg-whatsapp-number');
    const cfgColorPrimary = document.getElementById('cfg-color-primary');
    const cfgColorPrimaryText = document.getElementById('cfg-color-primary-text');
    const cfgColorSecondary = document.getElementById('cfg-color-secondary');
    const cfgColorSecondaryText = document.getElementById('cfg-color-secondary-text');
    const cfgLogoFile = document.getElementById('cfg-logo-file');
    const logoPreview = document.getElementById('logo-preview');
    const btnRemoveLogo = document.getElementById('btn-remove-logo');
    const productsList = document.getElementById('products-list');
    
    // Modals
    const modalProduct = document.getElementById('modal-product');
    const modalContent = document.getElementById('modal-content');
    
    // Init state
    let currentLogoBase64 = appConfig.logoBase64 || '';
    async function init() {
        await loadDataFromServer();
        initUI();
    }
    
    init();

    function initUI() {
        // Init Config
        cfgAppName.value = appConfig.appName || "Burger Lab";
        cfgSubtitle.value = appConfig.subtitle || "System Core Pro";
        cfgStatusText.value = appConfig.statusText || "Live Order System";
        cfgWhatsappNumber.value = appConfig.whatsappNumber || "";
        cfgColorPrimary.value = appConfig.primaryColor || "#FF512F";
        cfgColorPrimaryText.value = appConfig.primaryColor;
        cfgColorSecondary.value = appConfig.secondaryColor;
        cfgColorSecondaryText.value = appConfig.secondaryColor;
        
        updateLogoPreview();
        renderProducts();
        applyColors();
    }

    function applyColors() {
        document.documentElement.style.setProperty('--brand-orange', appConfig.primaryColor);
        document.documentElement.style.setProperty('--brand-red', appConfig.secondaryColor);
    }

    function updateLogoPreview() {
        if (currentLogoBase64) {
            logoPreview.innerHTML = `<img src="${currentLogoBase64}" class="w-full h-full object-cover">`;
            btnRemoveLogo.classList.remove('hidden');
        } else {
            logoPreview.innerHTML = `<span class="text-xs text-white/30">N/A</span>`;
            btnRemoveLogo.classList.add('hidden');
        }
    }

    // Colors binding
    cfgColorPrimary.addEventListener('input', e => cfgColorPrimaryText.value = e.target.value);
    cfgColorSecondary.addEventListener('input', e => cfgColorSecondaryText.value = e.target.value);
    cfgColorPrimaryText.addEventListener('input', e => cfgColorPrimary.value = e.target.value);
    cfgColorSecondaryText.addEventListener('input', e => cfgColorSecondary.value = e.target.value);

    // Logo Upload
    cfgLogoFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentLogoBase64 = event.target.result;
                updateLogoPreview();
            };
            reader.readAsDataURL(file);
        }
    });

    btnRemoveLogo.addEventListener('click', () => {
        currentLogoBase64 = '';
        cfgLogoFile.value = '';
        updateLogoPreview();
    });

    // Products
    function renderProducts() {
        const categories = [...new Set(productsData.map(p => p.category))];
        let html = '';
        categories.forEach(cat => {
            const items = productsData.filter(p => p.category === cat);
            
            html += `
            <div class="category-card bg-white/[0.03] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div class="flex items-center gap-4">
                        <h2 class="text-xl font-bold text-brand-orange uppercase tracking-widest">${cat}</h2>
                        <span class="text-xs font-medium text-white/30 uppercase tracking-widest">${items.length} Articoli</span>
                    </div>
                    <button class="bg-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white px-4 py-2 rounded-xl transition-all font-bold btn-add-cat-product self-start sm:self-auto" data-cat="${cat}">+ Aggiungi a ${cat}</button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-white/30 text-[10px] uppercase tracking-widest border-b border-white/5">
                                <th class="pb-3 px-2">Nome</th>
                                <th class="pb-3 px-2">Fornitore</th>
                                <th class="pb-3 px-2">Unità</th>
                                <th class="pb-3 px-2 text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
            `;
            
            html += items.map(p => `
                            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td class="py-3 px-2 font-bold text-white">
                                    ${p.name}
                                    ${p.whatsapp ? `<br><span class="text-[10px] text-brand-whatsapp tracking-wider opacity-80 mt-1 inline-block">📱 WA: ${p.whatsapp}</span>` : ''}
                                </td>
                                <td class="py-3 px-2 text-white/70">${p.supplier}</td>
                                <td class="py-3 px-2 text-white/50">${p.unit}</td>
                                <td class="py-3 px-2 text-right">
                                    <button class="text-brand-orange hover:text-white mr-3 btn-edit-product transition-colors" data-id="${p.id}">Modifica</button>
                                    <button class="text-red-500 hover:text-red-400 btn-del-product transition-colors" data-id="${p.id}">Elimina</button>
                                </td>
                            </tr>
            `).join('');

            html += `
                        </tbody>
                    </table>
                </div>
            </div>`;
        });
        productsList.innerHTML = html;

        document.querySelectorAll('.btn-add-cat-product').forEach(b => b.onclick = e => openModal(null, e.target.dataset.cat));
        document.querySelectorAll('.btn-edit-product').forEach(b => b.onclick = e => openModal(e.target.dataset.id));
        document.querySelectorAll('.btn-del-product').forEach(b => b.onclick = e => {
            if(confirm("Eliminare questo articolo?")) {
                const id = parseInt(e.target.dataset.id);
                productsData = productsData.filter(p => p.id !== id);
                renderProducts();
            }
        });
    }

    // Modal logic
    function openModal(id = null, defaultCategory = "") {
        if (id) {
            const p = productsData.find(x => x.id == id);
            document.getElementById('modal-title').innerText = "Modifica Articolo";
            document.getElementById('modal-id').value = p.id;
            document.getElementById('modal-name').value = p.name;
            document.getElementById('modal-supplier').value = p.supplier;
            document.getElementById('modal-category').value = p.category;
            document.getElementById('modal-unit').value = p.unit;
            document.getElementById('modal-whatsapp').value = p.whatsapp || '';
        } else {
            document.getElementById('modal-title').innerText = "Nuovo Articolo";
            document.getElementById('modal-id').value = "";
            document.getElementById('modal-name').value = "";
            document.getElementById('modal-supplier').value = "";
            document.getElementById('modal-category').value = defaultCategory;
            document.getElementById('modal-unit').value = "";
            document.getElementById('modal-whatsapp').value = "";
        }

        modalProduct.classList.remove('hidden');
        void modalProduct.offsetWidth;
        modalProduct.classList.remove('opacity-0');
        modalContent.classList.remove('scale-95');
    }

    function closeModal() {
        modalProduct.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => modalProduct.classList.add('hidden'), 300);
    }

    document.getElementById('btn-add-product').onclick = () => openModal();
    document.getElementById('btn-cancel-modal').onclick = closeModal;

    document.getElementById('btn-save-modal').onclick = () => {
        const id = document.getElementById('modal-id').value;
        const name = document.getElementById('modal-name').value;
        const supplier = document.getElementById('modal-supplier').value;
        const category = document.getElementById('modal-category').value;
        const unit = document.getElementById('modal-unit').value;
        const whatsapp = document.getElementById('modal-whatsapp').value;

        if (!name || !supplier || !category || !unit) {
            alert("Compila tutti i campi!");
            return;
        }

        if (id) {
            const p = productsData.find(x => x.id == id);
            p.name = name;
            p.supplier = supplier;
            p.category = category;
            p.unit = unit;
            p.whatsapp = whatsapp;
        } else {
            const newId = Math.max(...productsData.map(p => p.id), 0) + 1;
            productsData.push({ id: newId, name, supplier, category, unit, whatsapp });
        }

        closeModal();
        renderProducts();
    };

    // Save All
    document.getElementById('btn-save').onclick = async () => {
        appConfig.appName = cfgAppName.value;
        appConfig.subtitle = cfgSubtitle.value;
        appConfig.statusText = cfgStatusText.value;
        appConfig.whatsappNumber = cfgWhatsappNumber.value;
        appConfig.primaryColor = cfgColorPrimaryText.value;
        appConfig.secondaryColor = cfgColorSecondaryText.value;
        appConfig.logoBase64 = currentLogoBase64;

        applyColors();
        const success = await saveDataToServer(); // sync with server

        const toast = document.getElementById('toast');
        if (success) {
            toast.innerText = "Salvataggio completato!";
            toast.className = "fixed bottom-6 right-6 bg-brand-whatsapp text-black font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(0,230,118,0.3)] transform translate-y-0 opacity-100 transition-all duration-300 z-50";
        } else {
            toast.innerText = "Errore nel salvataggio!";
            toast.className = "fixed bottom-6 right-6 bg-red-500 text-white font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(255,0,0,0.3)] transform translate-y-0 opacity-100 transition-all duration-300 z-50";
        }
        
        setTimeout(() => {
            toast.classList.add('translate-y-20', 'opacity-0');
        }, 3000);
    };

    // init() già chiamato sopra
});
