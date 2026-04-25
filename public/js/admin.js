document.addEventListener('DOMContentLoaded', () => {
    let data = {
        config: { appName: '', primaryColor: '', secondaryColor: '' },
        categories: [],
        suppliers: [],
        items: []
    };

    // Elements
    const cfgAppName = document.getElementById('cfgAppName');
    const cfgColorPrimary = document.getElementById('cfgColorPrimary');
    const cfgColorPrimaryText = document.getElementById('cfgColorPrimaryText');
    const cfgColorSecondary = document.getElementById('cfgColorSecondary');
    const cfgColorSecondaryText = document.getElementById('cfgColorSecondaryText');
    const categoriesList = document.getElementById('categoriesList');
    const suppliersList = document.getElementById('suppliersList');
    const itemsList = document.getElementById('itemsList');

    // Modals
    const modalOverlay = document.getElementById('modalOverlay');
    const itemModal = document.getElementById('itemModal');

    // Init
    fetchData();

    async function fetchData() {
        try {
            const res = await fetch('/api/data');
            const d = await res.json();
            if (d.config) data.config = d.config;
            if (d.categories) data.categories = d.categories;
            if (d.suppliers) data.suppliers = d.suppliers;
            if (d.items) data.items = d.items;
            
            renderAll();
        } catch (e) {
            console.error(e);
            alert("Errore nel caricamento dei dati");
        }
    }

    function renderAll() {
        // Config
        cfgAppName.value = data.config.appName || 'Burger Lab';
        cfgColorPrimary.value = data.config.primaryColor || '#F97316';
        cfgColorPrimaryText.value = data.config.primaryColor || '#F97316';
        cfgColorSecondary.value = data.config.secondaryColor || '#FACC15';
        cfgColorSecondaryText.value = data.config.secondaryColor || '#FACC15';

        // Categories
        categoriesList.innerHTML = data.categories.map(c => `
            <div class="flex justify-between items-center bg-white/5 px-4 py-2 rounded-lg">
                <span>${c.name}</span>
                <button class="text-red-400 hover:text-red-300 btn-del-cat" data-id="${c.id}"><i class="ph-bold ph-trash"></i></button>
            </div>
        `).join('');

        // Suppliers
        suppliersList.innerHTML = data.suppliers.map(s => `
            <div class="flex justify-between items-center bg-white/5 px-4 py-3 rounded-lg">
                <div>
                    <div class="font-bold">${s.name}</div>
                    <div class="text-sm text-gray-400"><i class="ph ph-phone"></i> ${s.phone}</div>
                </div>
                <button class="text-red-400 hover:text-red-300 btn-del-sup" data-id="${s.id}"><i class="ph-bold ph-trash"></i></button>
            </div>
        `).join('');

        // Items
        itemsList.innerHTML = data.items.map(i => {
            const cat = data.categories.find(c => c.id == i.categoryId);
            const sup = data.suppliers.find(s => s.id == i.supplierId);
            return `
            <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td class="py-3 font-semibold">${i.name}</td>
                <td class="py-3 text-gray-400">${cat ? cat.name : '-'}</td>
                <td class="py-3 text-gray-400">${sup ? sup.name : '-'}</td>
                <td class="py-3 text-gray-400">${i.unit}</td>
                <td class="py-3 text-right">
                    <button class="text-blue-400 hover:text-blue-300 mr-3 btn-edit-item" data-id="${i.id}"><i class="ph-bold ph-pencil-simple"></i></button>
                    <button class="text-red-400 hover:text-red-300 btn-del-item" data-id="${i.id}"><i class="ph-bold ph-trash"></i></button>
                </td>
            </tr>
        `}).join('');

        attachListeners();
    }

    function attachListeners() {
        document.querySelectorAll('.btn-del-cat').forEach(b => b.onclick = (e) => {
            if(confirm("Sicuro di voler eliminare questa categoria?")) {
                const id = e.currentTarget.dataset.id;
                data.categories = data.categories.filter(c => c.id != id);
                renderAll();
            }
        });
        document.querySelectorAll('.btn-del-sup').forEach(b => b.onclick = (e) => {
            if(confirm("Sicuro di voler eliminare questo fornitore?")) {
                const id = e.currentTarget.dataset.id;
                data.suppliers = data.suppliers.filter(s => s.id != id);
                renderAll();
            }
        });
        document.querySelectorAll('.btn-del-item').forEach(b => b.onclick = (e) => {
            if(confirm("Sicuro di voler eliminare questo articolo?")) {
                const id = e.currentTarget.dataset.id;
                data.items = data.items.filter(i => i.id != id);
                renderAll();
            }
        });
        document.querySelectorAll('.btn-edit-item').forEach(b => b.onclick = (e) => {
            const id = e.currentTarget.dataset.id;
            openItemModal(id);
        });
    }

    // Color Pickers
    cfgColorPrimary.addEventListener('input', e => cfgColorPrimaryText.value = e.target.value);
    cfgColorSecondary.addEventListener('input', e => cfgColorSecondaryText.value = e.target.value);
    cfgColorPrimaryText.addEventListener('input', e => cfgColorPrimary.value = e.target.value);
    cfgColorSecondaryText.addEventListener('input', e => cfgColorSecondary.value = e.target.value);

    // Add Buttons
    document.getElementById('addCategoryBtn').onclick = () => {
        const name = prompt("Nome della nuova categoria:");
        if (name) {
            const maxId = Math.max(0, ...data.categories.map(c => c.id));
            data.categories.push({ id: maxId + 1, name });
            renderAll();
        }
    };

    document.getElementById('addSupplierBtn').onclick = () => {
        const name = prompt("Nome del fornitore:");
        if (!name) return;
        const phone = prompt("Numero di telefono (solo numeri, senza +):");
        if (!phone) return;
        const id = 's' + Date.now();
        data.suppliers.push({ id, name, phone });
        renderAll();
    };

    // Items Modal
    function openItemModal(itemId = null) {
        // Populate select options
        const catSelect = document.getElementById('modalItemCategory');
        catSelect.innerHTML = data.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        const supSelect = document.getElementById('modalItemSupplier');
        supSelect.innerHTML = data.suppliers.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

        if (itemId) {
            const item = data.items.find(i => i.id == itemId);
            document.getElementById('itemModalTitle').innerText = "Modifica Articolo";
            document.getElementById('modalItemId').value = item.id;
            document.getElementById('modalItemName').value = item.name;
            document.getElementById('modalItemCategory').value = item.categoryId;
            document.getElementById('modalItemSupplier').value = item.supplierId;
            document.getElementById('modalItemUnit').value = item.unit;
        } else {
            document.getElementById('itemModalTitle').innerText = "Nuovo Articolo";
            document.getElementById('modalItemId').value = "";
            document.getElementById('modalItemName').value = "";
            document.getElementById('modalItemUnit').value = "";
        }

        modalOverlay.classList.remove('hidden');
        itemModal.classList.remove('hidden');
    }

    document.getElementById('addItemBtn').onclick = () => openItemModal();

    document.querySelectorAll('.btn-cancel-modal').forEach(b => b.onclick = () => {
        modalOverlay.classList.add('hidden');
        itemModal.classList.add('hidden');
    });

    document.getElementById('saveItemBtn').onclick = () => {
        const id = document.getElementById('modalItemId').value;
        const name = document.getElementById('modalItemName').value;
        const categoryId = parseInt(document.getElementById('modalItemCategory').value);
        const supplierId = document.getElementById('modalItemSupplier').value;
        const unit = document.getElementById('modalItemUnit').value;

        if (!name || !unit) {
            alert("Compila tutti i campi");
            return;
        }

        if (id) {
            const item = data.items.find(i => i.id == id);
            item.name = name;
            item.categoryId = categoryId;
            item.supplierId = supplierId;
            item.unit = unit;
        } else {
            const maxId = Math.max(0, ...data.items.map(i => i.id));
            data.items.push({ id: maxId + 1, name, categoryId, supplierId, unit });
        }

        modalOverlay.classList.add('hidden');
        itemModal.classList.add('hidden');
        renderAll();
    };

    // Save All Data
    document.getElementById('saveBtn').onclick = async () => {
        // Update config from inputs
        data.config.appName = cfgAppName.value;
        data.config.primaryColor = cfgColorPrimaryText.value;
        data.config.secondaryColor = cfgColorSecondaryText.value;

        try {
            const btn = document.getElementById('saveBtn');
            btn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Salvataggio...';
            btn.disabled = true;

            const res = await fetch('/api/data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Network error');

            // Show Toast
            const toast = document.getElementById('toast');
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => {
                toast.classList.add('translate-y-20', 'opacity-0');
            }, 3000);

            // Update local CSS vars for admin page to reflect
            document.documentElement.style.setProperty('--color-primary', data.config.primaryColor);
            document.documentElement.style.setProperty('--color-secondary', data.config.secondaryColor);

        } catch (e) {
            console.error(e);
            alert("Errore durante il salvataggio.");
        } finally {
            const btn = document.getElementById('saveBtn');
            btn.innerHTML = '<i class="ph-bold ph-floppy-disk"></i> Salva Modifiche';
            btn.disabled = false;
        }
    };
});
