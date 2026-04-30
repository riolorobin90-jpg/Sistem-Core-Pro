/**
 * data.js - Supabase Sync Version
 * Handles data loading and saving using Supabase as a backend.
 */

const SUPABASE_URL = 'https://epzgzyytcszsfsaxemnj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_7bEHJexUgEb5gE2Zf1HmLw_AL94bRIt';

let productsData = [
    // Bakery
    { "id": 1, "name": "Fluffy Bun Sesamo", "supplier": "Panificio", "category": "Bakery", "unit": "Pz" },
    { "id": 2, "name": "Palline Impasto Pizza", "supplier": "Panificio", "category": "Bakery", "unit": "Pz" },
    
    // Carni e Salumi
    { "id": 3, "name": "Hamburger Manzo", "supplier": "Macelleria", "category": "Carni", "unit": "Pz" },
    { "id": 4, "name": "Hamburger Cinghiale", "supplier": "Macelleria", "category": "Carni", "unit": "Pz" },
    { "id": 5, "name": "Hamburger Cervo", "supplier": "Macelleria", "category": "Carni", "unit": "Pz" },
    { "id": 6, "name": "Burger Vegetale", "supplier": "Alimentari", "category": "Carni", "unit": "Pz" },
    { "id": 7, "name": "Bacon", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 8, "name": "Mortadella", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    { "id": 9, "name": "Prosciutto Crudo", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    { "id": 10, "name": "Pancetta", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    { "id": 11, "name": "Salsiccia", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 12, "name": "Capocollo Suino Nebrodi", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    { "id": 13, "name": "Wurstel", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    { "id": 14, "name": "Ventricina Piccante", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    { "id": 15, "name": "Prosciutto Cotto", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },

    // Latticini e Formaggi
    { "id": 16, "name": "Scamorza", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 17, "name": "Scamorza Affumicata", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 18, "name": "Cheddar", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 19, "name": "Burratina / Burrata", "supplier": "Caseificio", "category": "Latticini", "unit": "Pz" },
    { "id": 20, "name": "Mozzarella di Bufala", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 21, "name": "Mozzarella Fiordilatte", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 22, "name": "Maiorchino", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 23, "name": "Provola Sfogliata", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 24, "name": "Tuma Persa", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 25, "name": "Piacentino Ennese", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 26, "name": "Stracciatella", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 27, "name": "Ricotta Fresca", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 28, "name": "Ricotta Salata Nebrodi", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 29, "name": "Grana", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 30, "name": "Gorgonzola Dolce", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 31, "name": "Auricchio Dolce", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    { "id": 32, "name": "Tuma", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },

    // Ortofrutta
    { "id": 33, "name": "Insalata Iceberg", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 34, "name": "Cipolle", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 35, "name": "Zucchine", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 36, "name": "Radicchio", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 37, "name": "Melanzane", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 38, "name": "Pomodorino Pachino", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 39, "name": "Rucola", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 40, "name": "Funghi Porcini", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 41, "name": "Broccoli", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 42, "name": "Funghi Champignon", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 43, "name": "Basilico Fresco", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Mz" },
    { "id": 44, "name": "Uova", "supplier": "Alimentari", "category": "Ortofrutta", "unit": "Pz" },

    // Pesce
    { "id": 45, "name": "Alici di Mazara", "supplier": "Pescheria", "category": "Pesce", "unit": "Kg" },
    { "id": 46, "name": "Salmone", "supplier": "Pescheria", "category": "Pesce", "unit": "Kg" },
    { "id": 47, "name": "Gamberoni", "supplier": "Pescheria", "category": "Pesce", "unit": "Kg" },

    // Salse e Creme
    { "id": 48, "name": "Ketchup", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 49, "name": "Maionese", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 50, "name": "Salsa BBQ", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 51, "name": "Salsa Greca", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 52, "name": "Salsa Tartara", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 53, "name": "Salsa Sweet Chili", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 54, "name": "Crema di Pistacchio", "supplier": "Alimentari", "category": "Salse", "unit": "Kg" },
    { "id": 55, "name": "Pesto", "supplier": "Alimentari", "category": "Salse", "unit": "Kg" },
    { "id": 56, "name": "Crema di Zucca", "supplier": "Alimentari", "category": "Salse", "unit": "Kg" },
    { "id": 57, "name": "Passata di Pomodoro", "supplier": "Alimentari", "category": "Salse", "unit": "L" },
    { "id": 58, "name": "Nutella", "supplier": "Alimentari", "category": "Salse", "unit": "Kg" },

    // Dispensa / Surgelati / Spezie
    { "id": 59, "name": "Olio Extravergine d'Oliva", "supplier": "Alimentari", "category": "Spezie", "unit": "L" },
    { "id": 60, "name": "Sale", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 61, "name": "Pepe", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 62, "name": "Origano", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 63, "name": "Zucchero a Velo", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 64, "name": "Granella di Pistacchio", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 65, "name": "Mandorle Tostate", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 66, "name": "Semi di Chia", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 67, "name": "Pomodorino Confit", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 68, "name": "Pomodori Secchi / Capuliato", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 69, "name": "Patatine Fritte Surgelate", "supplier": "Surgelati", "category": "Surgelati", "unit": "Ct" },
    { "id": 70, "name": "Chips di Patate", "supplier": "Alimentari", "category": "Surgelati", "unit": "Ct" },
    { "id": 71, "name": "Anelli di Cipolla Surgelati", "supplier": "Surgelati", "category": "Surgelati", "unit": "Ct" },
    
    // Packaging (Default generici)
    { "id": 72, "name": "Scatole Burger", "supplier": "Packaging", "category": "Packaging", "unit": "Ct" },
    { "id": 73, "name": "Scatole Pizza", "supplier": "Packaging", "category": "Packaging", "unit": "Ct" },
    { "id": 74, "name": "Tovaglioli", "supplier": "Packaging", "category": "Packaging", "unit": "Ct" },

    // Carni Aggiuntive
    { "id": 75, "name": "Alette di Pollo", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 76, "name": "Alette di Pollo Piccanti", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 77, "name": "Tartare / Battuta di Manzo", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 78, "name": "Filetto di Manzo", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 79, "name": "Costata di Cinta Senese", "supplier": "Macelleria", "category": "Carni", "unit": "Kg" },
    { "id": 80, "name": "Stinco di Maiale", "supplier": "Macelleria", "category": "Carni", "unit": "Pz" },
    { "id": 81, "name": "Guanciale", "supplier": "Salumificio", "category": "Carni", "unit": "Kg" },
    
    // Latticini Aggiuntivi
    { "id": 82, "name": "Pecorino Romano", "supplier": "Caseificio", "category": "Latticini", "unit": "Kg" },
    
    // Ortofrutta e Varie Aggiuntive
    { "id": 83, "name": "Peperoni", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 84, "name": "Lattuga", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 85, "name": "Carote a Julienne", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 86, "name": "Cipolla di Tropea / Rossa", "supplier": "Ortofrutta", "category": "Ortofrutta", "unit": "Kg" },
    { "id": 87, "name": "Mais", "supplier": "Alimentari", "category": "Spezie", "unit": "Ct" },
    { "id": 88, "name": "Olive Nere", "supplier": "Alimentari", "category": "Spezie", "unit": "Kg" },
    { "id": 89, "name": "Casarecce / Pasta Fresca", "supplier": "Panificio", "category": "Bakery", "unit": "Kg" },
    { "id": 90, "name": "Tagliatelle", "supplier": "Panificio", "category": "Bakery", "unit": "Kg" },
    { "id": 91, "name": "Tonno in scatola", "supplier": "Alimentari", "category": "Pesce", "unit": "Ct" },
    { "id": 92, "name": "Birra (Cottura)", "supplier": "Alimentari", "category": "Spezie", "unit": "L" }
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
