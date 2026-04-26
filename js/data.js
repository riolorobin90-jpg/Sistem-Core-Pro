/**
 * data.js - Supabase Sync Version
 */
const SUPABASE_URL = 'https://epzgzyytcszsfsaxemnj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwemd6eXl0Y3N6c2ZzYXhlbW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxMzQyNDIsImV4cCI6MjAyOTcxMDI0Mn0.N6U-Hjc0MDgxeNn0.5rbKhco2A1O9aumcWWkg5abJYErJjZbm5oNsR2qi8UU';

let productsData = [];
let categoriesData = [
        { id: 1, name: "Bun e Pane" },
        { id: 2, name: "Hamburger e Carni" },
        { id: 3, name: "Verdure Fresche" },
        { id: 4, name: "Formaggi e Latticini" }
        ];
let suppliersData = [
        { id: 1, name: "Forno Rossi", phone: "39123456789" },
        { id: 2, name: "Carni Scelte srl", phone: "39987654321" },
        { id: 3, name: "Ortofrutta Bio", phone: "39000000000" }
        ];
let appConfig = {
            appName: "Burger Lab",
            primaryColor: "#FF512F",
            secondaryColor: "#DD2476",
            logoBase64: ""
};

async function loadDataFromServer() {
            try {
                            const response = await fetch(`${SUPABASE_URL}/rest/v1/app_store?id=eq.1&select=data`, {
                                                method: 'GET',
                                                headers: {
                                                                        'apikey': SUPABASE_KEY,
                                                                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                                                                        'Content-Type': 'application/json'
                                                }
                            });
                            if (!response.ok) throw new Error('Failed to load data from Supabase');
                            const result = await response.json();
                            if (result && result.length > 0 && result[0].data) {
                                                const serverData = result[0].data;
                                                productsData = serverData.items || [];
                                                categoriesData = serverData.categories || categoriesData;
                                                suppliersData = serverData.suppliers || suppliersData;
                                                appConfig = serverData.config || appConfig;
                            }
                            return { items: productsData, categories: categoriesData, suppliers: suppliersData, config: appConfig };
            } catch (error) {
                            console.error("Error loading data:", error);
                            return { items: productsData, categories: categoriesData, suppliers: suppliersData, config: appConfig };
            }
}

async function saveDataToServer() {
            const dataToSave = { 
                            config: appConfig, 
                            items: productsData,
                            categories: categoriesData,
                            suppliers: suppliersData
            };
            try {
                            const response = await fetch(`${SUPABASE_URL}/rest/v1/app_store?id=eq.1`, {
                                                method: 'PATCH',
                                                headers: {
                                                                        'apikey': SUPABASE_KEY,
                                                                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                                                                        'Content-Type': 'application/json',
                                                                        'Prefer': 'return=minimal'
                                                },
                                                body: JSON.stringify({ data: dataToSave })
                            });
                            if (!response.ok) throw new Error('Failed to save data');
                            return true;
            } catch (error) {
                            console.error("Error saving data:", error);
                            return false;
            }
}
