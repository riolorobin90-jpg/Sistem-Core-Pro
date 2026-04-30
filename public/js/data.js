/**
 * data.js - Supabase Sync Version
 * Handles data loading and saving using Supabase as a backend.
 */

const SUPABASE_URL = 'https://epzgzyytcszsfsaxemnj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwemd6eXl0Y3N6c2ZzYXhlbW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQxMzQyNDIsImV4cCI6MjAyOTcxMDI0Mn0.N6U-Hjc0MDgxeNn0.5rbKhco2A1O9aumcWWkg5abJYErJjZbm5oNsR2qi8UU';

let productsData = [
    { "id": 1, "name": "Bun Patate (Pack)", "supplier": "Panificio Rossi", "category": "Bakery", "unit": "Pz" },
    { "id": 2, "name": "Bun Sesamo (Pack)", "supplier": "Panificio Rossi", "category": "Bakery", "unit": "Pz" },
    { "id": 3, "name": "Hamburger 150g", "supplier": "Macelleria Neri", "category": "Carni", "unit": "Kg" },
    { "id": 4, "name": "Hamburger 200g", "supplier": "Macelleria Neri", "category": "Carni", "unit": "Kg" },
    { "id": 5, "name": "Bacon Affumicato", "supplier": "Macelleria Neri", "category": "Carni", "unit": "Kg" },
    { "id": 6, "name": "Cheddar a fette", "supplier": "Latteria Bianca", "category": "Latticini", "unit": "Pz" },
    { "id": 7, "name": "Pomodori Ramati", "supplier": "Ortofrutta Verde", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 8, "name": "Insalata Iceberg", "supplier": "Ortofrutta Verde", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 9, "name": "Patatine Dippers", "supplier": "Surgelati Gialli", "category": "Surgelati", "unit": "Ct" },
    { "id": 10, "name": "Nuggets di Pollo", "supplier": "Surgelati Gialli", "category": "Surgelati", "unit": "Ct" },
    { "id": 11, "name": "Maionese", "supplier": "Salse & Co.", "category": "Salse", "unit": "L" },
    { "id": 12, "name": "Ketchup", "supplier": "Salse & Co.", "category": "Salse", "unit": "L" },
    { "id": 13, "name": "Salsa BBQ", "supplier": "Salse & Co.", "category": "Salse", "unit": "L" },
    { "id": 14, "name": "Coca Cola Vetro", "supplier": "Beverage Spa", "category": "Bevande", "unit": "Cas" },
    { "id": 15, "name": "Birra Artigianale", "supplier": "Beverage Spa", "category": "Bevande", "unit": "Cas" },
    { "id": 16, "name": "Pepe Nero in grani", "supplier": "Spezie del Mondo", "category": "Spezie", "unit": "Kg" },
    { "id": 17, "name": "Paprika Dolce", "supplier": "Spezie del Mondo", "category": "Spezie", "unit": "Kg" },
    { "id": 18, "name": "Sale Fino", "supplier": "Spezie del Mondo", "category": "Spezie", "unit": "Kg" },
    { "id": 19, "name": "Vaschette Alluminio", "supplier": "Royil Carta", "category": "Packaging", "unit": "Ct" },
    { "id": 20, "name": "Vaschette Plastica Trasp.", "supplier": "Royil Carta", "category": "Packaging", "unit": "Ct" },
    { "id": 21, "name": "Tovaglioli Monovelo", "supplier": "Royil Carta", "category": "Packaging", "unit": "Ct" },
    { "id": 22, "name": "Bicchieri Plastica", "supplier": "Royil Carta", "category": "Packaging", "unit": "Ct" }
];
let appConfig = {
    appName: "Burger Lab",
    subtitle: "System Core Pro",
    statusText: "Live Order System",
    whatsappNumber: "",
    primaryColor: "#FF512F",
    secondaryColor: "#DD2476",
    logoBase64: ""
};

/**
 * Loads data from Supabase with timeout
 */
async function loadDataFromServer() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/app_store?id=eq.1&select=data`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            },
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) throw new Error('Failed to load data from Supabase');

        const result = await response.json();
        
        if (result && result.length > 0 && result[0].data && Object.keys(result[0].data).length > 0) {
            const serverData = result[0].data;
            productsData = serverData.items || [];
            appConfig = serverData.config || appConfig;
            console.log("Data loaded from Supabase successfully");
        } else {
            console.log("No data found in Supabase, using defaults");
            await saveDataToServer();
        }
        return { items: productsData, config: appConfig };
    } catch (error) {
        console.error("Error loading data:", error);
        return { items: productsData, config: appConfig };
    }
}

/**
 * Saves current state to Supabase
 */
async function saveDataToServer() {
    const dataToSave = {
        config: appConfig,
        items: productsData
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

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save data: ${errorText}`);
        }

        console.log("Data saved to Supabase successfully");
        return true;
    } catch (error) {
        console.error("Error saving data:", error);
        return false;
    }
}
