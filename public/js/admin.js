document.addEventListener('DOMContentLoaded', () => {
        let data = { categories: [], suppliers: [], items: [], config: {} };
        const loader = document.getElementById('loader');
        const adminContent = document.getElementById('adminContent');
        const cfgAppName = document.getElementById('cfgAppName');
        const cfgColorPrimary = document.getElementById('cfgColorPrimary');
        const cfgColorSecondary = document.getElementById('cfgColorSecondary');
        const categoriesList = document.getElementById('categoriesList');
        const suppliersList = document.getElementById('suppliersList');
        const itemsList = document.getElementById('itemsList');

                              fetchData();

                              async function fetchData() {
                                          try {
                                                          const serverData = await loadDataFromServer();
                                                          data.items = serverData.items || [];
                                                          data.categories = serverData.categories || [];
                                                          data.suppliers = serverData.suppliers || [];
                                                          data.config = serverData.config || {};
                                                          renderAll();
                                                          loader.classList.add('hidden');
                                                          adminContent.classList.remove('hidden');
                                          } catch (error) {
                                                          console.error('Error fetching data:', error);
                                                          alert('Errore nel caricamento dei dati.');
                                          }
                              }

                              async function saveData() {
                                          try {
                                                          const btn = document.getElementById('saveBtn');
                                                          btn.innerHTML = 'Salvataggio...';
                                                          btn.disabled = true;
                                                          const success = await saveDataToServer();
                                                          if (!success) throw new Error('Save failed');
                                                          alert('Dati salvati!');
                                          } catch (e) {
                                                          console.error(e);
                                                          alert("Errore durante il salvataggio.");
                                          } finally {
                                                          const btn = document.getElementById('saveBtn');
                                                          btn.innerHTML = 'Salva Modifiche';
                                                          btn.disabled = false;
                                          }
                              }

                              function renderAll() {
                                          if (cfgAppName) cfgAppName.value = data.config.appName || '';
                                          if (cfgColorPrimary) cfgColorPrimary.value = data.config.primaryColor || '#FF512F';
                                          if (cfgColorSecondary) cfgColorSecondary.value = data.config.secondaryColor || '#DD2476';
                                          renderCategories();
                                          renderSuppliers();
                                          renderItems();
                              }

                              function renderCategories() {
                                          if (!categoriesList) return;
                                          categoriesList.innerHTML = '';
                                          data.categories.forEach(cat => {
                                                          const div = document.createElement('div');
                                                          div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-xl';
                                                          div.innerHTML = `<span>${cat.name}</span><button class="delete-cat" data-id="${cat.id}">Elimina</button>`;
                                                          categoriesList.appendChild(div);
                                          });
                              }

                              function renderSuppliers() {
                                          if (!suppliersList) return;
                                          suppliersList.innerHTML = '';
                                          data.suppliers.forEach(sup => {
                                                          const div = document.createElement('div');
                                                          div.className = 'p-4 bg-gray-50 rounded-xl';
                                                          div.innerHTML = `<h4>${sup.name}</h4><p>${sup.phone}</p><button class="delete-sup" data-id="${sup.id}">Elimina</button>`;
                                                          suppliersList.appendChild(div);
                                          });
                              }

                              function renderItems() {
                                          if (!itemsList) return;
                                          itemsList.innerHTML = '';
                                          data.items.forEach(item => {
                                                          const div = document.createElement('div');
                                                          div.className = 'p-4 bg-gray-50 rounded-xl';
                                                          div.innerHTML = `<h4>${item.name}</h4><p>${item.category} - ${item.supplier}</p><button class="delete-item" data-id="${item.id}">Elimina</button>`;
                                                          itemsList.appendChild(div);
                                          });
                                          updateSelectors();
                              }

                              function updateSelectors() {
                                          const catSelect = document.getElementById('itemCategory');
                                          const supSelect = document.getElementById('itemSupplier');
                                          if (catSelect) catSelect.innerHTML = data.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
                                          if (supSelect) supSelect.innerHTML = data.suppliers.map(s => `<option value="${s.name}">${s.name}</option>`).join('');
                              }

                              if (document.getElementById('saveBtn')) document.getElementById('saveBtn').onclick = saveData;

                              if (document.getElementById('addCategoryBtn')) {
                                          document.getElementById('addCategoryBtn').onclick = () => {
                                                          const name = document.getElementById('newCategoryName').value;
                                                          if (name) { data.categories.push({ id: Date.now(), name }); renderCategories(); updateSelectors(); }
                                          };
                              }

                              if (document.getElementById('addItemBtn')) {
                                          document.getElementById('addItemBtn').onclick = () => {
                                                          const name = document.getElementById('itemName').value;
                                                          const category = document.getElementById('itemCategory').value;
                                                          const supplier = document.getElementById('itemSupplier').value;
                                                          const unit = document.getElementById('itemUnit').value;
                                                          if (name) { data.items.push({ id: Date.now(), name, category, supplier, unit }); renderItems(); }
                                          };
                              }

                              document.addEventListener('click', (e) => {
                                          if (e.target.classList.contains('delete-cat')) {
                                                          data.categories = data.categories.filter(c => c.id != e.target.dataset.id); renderCategories(); updateSelectors();
                                          }
                                          if (e.target.classList.contains('delete-item')) {
                                                          data.items = data.items.filter(i => i.id != e.target.dataset.id); renderItems();
                                          }
                              });
});
