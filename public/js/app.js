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
                                  const serverData = await loadDataFromServer();
                                  data.items = serverData.items || [];
                                  data.categories = serverData.categories || [];
                                  data.suppliers = serverData.suppliers || [];
                                  data.config = serverData.config || {};

                      if (data.config) {
                                          document.documentElement.style.setProperty('--color-primary', data.config.primaryColor || '#FF512F');
                                          document.documentElement.style.setProperty('--color-secondary', data.config.secondaryColor || '#DD2476');
                                          const appNameHeader = document.getElementById('appNameHeader');
                                          if (appNameHeader) appNameHeader.innerText = data.config.appName || 'Burger Lab';
                                          document.title = (data.config.appName || 'Burger Lab') + ' - Gestione';
                      }

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
    
