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
    logoBase64: "",
    primaryColor: "#FF512F",
    secondaryColor: "#DD2476"
};

async function loadDataFromServer() {
    try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        if (data.config) appConfig = data.config;
        if (data.items) productsData = data.items;
        
        return true;
    } catch (error) {
        console.error("Error loading data:", error);
        // Fallback to localStorage if server fails (offline mode)
        if (localStorage.getItem('appConfig')) {
            appConfig = JSON.parse(localStorage.getItem('appConfig'));
        }
        if (localStorage.getItem('productsData')) {
            productsData = JSON.parse(localStorage.getItem('productsData'));
        }
        return false;
    }
}

async function saveDataToServer() {
    // Save to local for immediate feedback/offline
    localStorage.setItem('appConfig', JSON.stringify(appConfig));
    localStorage.setItem('productsData', JSON.stringify(productsData));

    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                config: appConfig,
                items: productsData
            })
        });
        return response.ok;
    } catch (error) {
        console.error("Error saving data:", error);
        return false;
    }
}
